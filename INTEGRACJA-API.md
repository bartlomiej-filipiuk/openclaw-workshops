# Integracja z zewnętrznym API — plugin + skill

Jak rozszerzyć agenta OpenClaw o własne integracje z zewnętrznymi API. Instrukcja ogólna + pełny przykład z Replicate (generowanie obrazów).

---

## 1. Skills vs Plugins — czym się różnią

| | Skill | Plugin |
|---|-------|--------|
| **Czym jest** | Plik `SKILL.md` z instrukcjami dla LLM | Moduł TypeScript rejestrujący narzędzia |
| **Co robi** | Mówi agentowi *kiedy*, *co* i *jak* decydować | Wykonuje *faktyczne* wywołania API, walidację, obsługę błędów |
| **Format** | Markdown z frontmatter YAML | TypeScript z `api.registerTool()` |
| **Język** | Naturalny (instrukcje dla modelu) | Kod (logika programistyczna) |
| **Przykład** | "Jeśli user chce fotorealizm → użyj modelu X" | `fetch("https://api.example.com/generate", ...)` |

### Kiedy co użyć?

- **Sam skill (bez pluginu)** — wystarczy gdy agent może użyć istniejących narzędzi (np. curl, shell). Proste integracje.
- **Sam plugin (bez skilla)** — wystarczy gdy tool jest prosty i nie wymaga heurystyk decyzyjnych.
- **Plugin + skill (rekomendowane)** — gdy integracja wymaga zarówno logiki API (walidacja, polling, error handling) jak i reguł decyzyjnych (wybór modelu, parametrów, kiedy dopytać usera).

Plugin + skill > sam skill z curl > sam plugin z logiką na sztywno.

---

## 2. Architektura: plugin + skill razem

```
User: "Wygeneruj mi zdjęcie kota na plaży"
  │
  ▼
Skill (SKILL.md) — decyzja:
  "Szybki szkic → flux-schnell, prompt po angielsku, 1:1"
  │
  ▼
Tool z pluginu (replicate_generate_image) — wykonanie:
  POST /v1/models/{owner}/{name}/predictions → polling statusu → URL obrazu
  │
  ▼
Odpowiedź do usera: "Oto Twój obraz: [URL]"
```

- **Plugin** rejestruje tool — stabilne API narzędzia (parametry, walidacja, wywołanie)
- **Skill** zawiera reguły decyzyjne — kiedy jakiego modelu/parametrów użyć
- Plugin może shipować swój skill w podkatalogu `skills/`

---

## 3. Jak zbudować plugin — krok po kroku

### Struktura katalogów

```
moj-plugin/
├── package.json              # manifest npm + deklaracja rozszerzenia
├── openclaw.plugin.json      # manifest pluginu (config, UI hints)
├── src/
│   └── index.ts              # rejestracja tooli
└── skills/                   # opcjonalnie: skille shipowane z pluginem
    └── moj-skill/
        └── SKILL.md
```

### package.json

Kluczowe pole: `openclaw.extensions` — wskazuje plik z rejestracją tooli.

```json
{
  "name": "@moj-namespace/moj-plugin",
  "version": "0.1.0",
  "type": "module",
  "openclaw": {
    "extensions": ["./src/index.ts"]
  },
  "engines": {
    "node": ">=22.0.0"
  }
}
```

Nie potrzebujesz zależności na `node-fetch` — Node 22+ ma wbudowany `fetch`.

### openclaw.plugin.json

Manifest pluginu. Definiuje konfigurację (np. klucz API) i podpowiedzi dla UI dashboardu. Pole `id` jest kluczowe — to po nim odwołujesz się do pluginu w `openclaw.json` (np. `plugins.entries.<id>.config`).

```json
{
  "id": "moj-plugin",
  "name": "Mój Plugin",
  "version": "0.1.0",
  "description": "Opis co plugin robi",
  "configSchema": {
    "apiToken": {
      "type": "string",
      "description": "Klucz API do serwisu X",
      "sensitive": true
    }
  },
  "uiHints": {
    "apiToken": {
      "label": "API Token",
      "sensitive": true,
      "placeholder": "sk-..."
    }
  }
}
```

### src/index.ts — rejestracja toola

```typescript
import { Type } from "@sinclair/typebox";
import type { OpenClawPluginAPI } from "openclaw/plugin";

export default function register(api: OpenClawPluginAPI) {
  api.registerTool({
    name: "moj_tool",
    description: "Opis co tool robi — agent czyta ten opis żeby zdecydować kiedy go użyć",
    parameters: Type.Object({
      query: Type.String({ description: "Parametr wymagany" }),
      limit: Type.Optional(Type.Number({ description: "Parametr opcjonalny", default: 10 })),
    }),

    async execute({ query, limit }, context) {
      const apiKey = context.pluginConfig?.apiToken || process.env.MY_API_KEY;

      if (!apiKey) {
        return { error: "Brak klucza API. Ustaw MY_API_KEY lub skonfiguruj w pluginie." };
      }

      const response = await fetch("https://api.example.com/endpoint", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query, limit }),
      });

      if (!response.ok) {
        return { error: `API error (${response.status}): ${await response.text()}` };
      }

      const data = await response.json();
      return { result: data };
    },
  });
}
```

**Kontrakt toola:**
- `name` — unikalna nazwa (snake_case)
- `description` — opis dla agenta (ważny! agent na tej podstawie decyduje czy użyć toola)
- `parameters` — schemat TypeBox (generuje JSON Schema)
- `execute(params, context)` — funkcja wykonawcza, zwraca obiekt z wynikiem lub `error`

---

## 4. Jak zbudować skill do pluginu

Skill to plik `SKILL.md` w katalogu `skills/<nazwa>/`.

### Frontmatter

```yaml
---
name: moj_skill
description: Krótki opis — agent widzi to w liście skilli
metadata:
  openclaw:
    requires:
      env:
        - MY_API_KEY
      bins:
        - some-cli-tool
---
```

- `name` — identyfikator skilla
- `description` — opis widoczny dla agenta
- `requires.env` — zmienne środowiskowe wymagane do działania
- `requires.bins` — binaria wymagane na systemie (opcjonalne)

### Body — reguły decyzyjne

Treść SKILL.md to instrukcje w języku naturalnym. Agent czyta je i stosuje podczas decydowania jak użyć toola.

```markdown
# Mój skill

Używasz toola `moj_tool` gdy user prosi o X.

## Reguły

1. Domyślnie użyj parametru A.
2. Jeśli user chce Y → zmień parametr na B.
3. Jeśli nie jesteś pewien → dopytaj usera.
```

Możesz odwoływać się do zasobów pluginu przez `{baseDir}`:
```markdown
Szczegóły w pliku: {baseDir}/docs/reference.md
```

---

## 5. Bezpieczne zarządzanie kluczami API

### Opcja A: Zmienna środowiskowa (najprostsze)

```bash
export REPLICATE_API_TOKEN=r8_abc123...
```

Plugin odczytuje przez `process.env.REPLICATE_API_TOKEN`.

### Opcja B: SecretRef w openclaw.json

W pliku `~/.openclaw/openclaw.json`:

```json
{
  "plugins": {
    "entries": {
      "replicate": {
        "config": {
          "apiToken": {
            "source": "env",
            "key": "REPLICATE_API_TOKEN"
          }
        }
      }
    }
  }
}
```

Typy SecretRef:
- `"source": "env"` — ze zmiennej środowiskowej
- `"source": "file"` — z pliku (np. `"path": "/run/secrets/replicate"`)
- `"source": "exec"` — z komendy (np. `"command": "op read op://vault/replicate/token"` dla 1Password)

### Opcja C: Konfiguracja wprost (tylko do testów!)

```json
{
  "plugins": {
    "entries": {
      "replicate": {
        "config": {
          "apiToken": "r8_abc123..."
        }
      }
    }
  }
}
```

**Nie rób tego w produkcji** — klucz w pliku konfiguracji jest mniej bezpieczny.

### Docker — ważne

Zmienne środowiskowe z hosta **nie trafiają automatycznie** do kontenera. Musisz je przekazać jawnie:

```yaml
# docker-compose.yml
services:
  openclaw-gateway:
    environment:
      - REPLICATE_API_TOKEN=${REPLICATE_API_TOKEN}
```

Lub przez plik `.env` obok `docker-compose.yml`:
```bash
REPLICATE_API_TOKEN=r8_abc123...
```

Alternatywnie, ustaw token w `openclaw.json` → `plugins.entries.replicate.config.apiToken` — wtedy nie musisz przekazywać zmiennej środowiskowej.

---

## 6. Instalacja i uruchomienie

### npm (lokalny development)

```bash
# Zainstaluj plugin z lokalnego katalogu
openclaw plugins install -l ./moj-plugin

# Sprawdź
openclaw plugins list
openclaw skills check
```

### Docker

#### Sposób 1: Volume mount (development)

Zamontuj katalog pluginu jako volume w `docker-compose.yml`:

```yaml
services:
  openclaw-gateway:
    volumes:
      - ~/.openclaw:/home/node/.openclaw
      - ./przyklady/replicate-plugin:/home/node/replicate-plugin
```

Potem wewnątrz kontenera:
```bash
docker exec -it openclaw-openclaw-gateway-1 bash
cd /home/node/replicate-plugin
openclaw plugins install -l .
```

#### Sposób 2: Instalacja w kontenerze

```bash
docker exec -it openclaw-openclaw-gateway-1 bash
# Wewnątrz kontenera:
openclaw plugins install -l /ścieżka/do/pluginu
```

### Po instalacji

1. Zrestartuj gateway:
   ```bash
   # npm:
   openclaw restart

   # Docker:
   docker compose restart openclaw-gateway
   ```

2. Sprawdź:
   ```bash
   openclaw plugins list              # plugin powinien być na liście
   openclaw skills check              # skill powinien być eligible
   ```

3. Przetestuj — napisz do bota: *"Wygeneruj obraz kota w kosmosie"*

### Hard restart (jeśli zmiany nie są widoczne)

```bash
# Docker:
docker compose down
docker compose up -d openclaw-gateway

# Lub force recreate:
docker compose up -d --force-recreate openclaw-gateway
```

---

## 7. Pełny przykład: Replicate (generowanie obrazów)

Gotowy plugin z kodem: [`przyklady/replicate-plugin/`](przyklady/replicate-plugin/)

### Co zawiera

```
przyklady/replicate-plugin/
├── package.json              # manifest npm
├── openclaw.plugin.json      # manifest pluginu (configSchema dla API tokenu)
├── src/
│   └── index.ts              # tool replicate_generate_image
└── skills/
    └── replicate-image/
        └── SKILL.md          # reguły: wybór modelu, aspect ratio, format
```

### Jak to działa

1. **Plugin** (`src/index.ts`) rejestruje tool `replicate_generate_image`:
   - Przyjmuje: `prompt`, `model` (opcjonalny), `aspect_ratio`, `output_format`
   - Wysyła POST do `/v1/models/{owner}/{name}/predictions` → tworzy prediction
   - Polluje status co 2 sekundy aż do `succeeded` / `failed` / timeout (3 min)
   - Zwraca URL wygenerowanego obrazu

2. **Skill** (`skills/replicate-image/SKILL.md`) zawiera reguły decyzyjne:
   - Szybki szkic → `flux-schnell` (szybki, tani)
   - Fotorealizm → `flux-1.1-pro` (jakościowy)
   - Duża rozdzielczość → `flux-1.1-pro-ultra` (największy output)
   - User podał model → uszanuj override
   - Niejednoznaczny koszt → dopytaj usera

### Krok po kroku: uruchomienie

#### 1. Zdobądź token Replicate

1. Zarejestruj się na https://replicate.com
2. Wejdź w Account → API Tokens
3. Skopiuj token (zaczyna się od `r8_`)

#### 2. Ustaw token

```bash
# Opcja A — zmienna środowiskowa:
export REPLICATE_API_TOKEN=r8_twoj_token

# Opcja B — w openclaw.json:
openclaw config set plugins.entries.replicate.config.apiToken "r8_twoj_token"
```

Docker — dodaj do `docker-compose.yml`:
```yaml
services:
  openclaw-gateway:
    environment:
      - REPLICATE_API_TOKEN=${REPLICATE_API_TOKEN}
```

#### 3. Zainstaluj plugin

```bash
# npm:
openclaw plugins install -l ./przyklady/replicate-plugin

# Docker — zamontuj i zainstaluj:
docker exec -it openclaw-openclaw-gateway-1 bash
openclaw plugins install -l /home/node/replicate-plugin
```

#### 4. Restart i test

```bash
# npm:
openclaw restart

# Docker:
docker compose restart openclaw-gateway
```

Sprawdź:
```bash
openclaw plugins list     # → replicate
openclaw skills check     # → replicate-image: eligible
```

Napisz do bota na Telegramie:
- *"Wygeneruj obraz kota w kosmosie"* → użyje flux-schnell (domyślny)
- *"Zrób profesjonalne zdjęcie produktowe białego kubka"* → skill wybierze flux-1.1-pro
- *"Wygeneruj tapetę 16:9 z górskim krajobrazem"* → skill ustawi aspect_ratio 16:9

---

## Troubleshooting

| Problem | Rozwiązanie |
|---------|------------|
| `Brak tokenu Replicate API` | Ustaw `REPLICATE_API_TOKEN` lub `plugins.entries.replicate.config.apiToken` |
| Plugin nie widoczny po instalacji | `openclaw restart` / `docker compose restart openclaw-gateway` |
| Skill nie eligible | Sprawdź `openclaw skills check` — czy `REPLICATE_API_TOKEN` jest ustawiony |
| Timeout przy generowaniu | Droższe modele (pro, ultra) mogą potrzebować więcej czasu. Spróbuj `flux-schnell` |
| Docker: token nie działa | Upewnij się że token jest w `docker-compose.yml` environment, nie tylko na hoście |
| `openclaw plugins install` nie działa w Docker | Wejdź do kontenera (`docker exec -it ... bash`) i uruchom tam |
