# Skills i ClawHub

## Czym są skille?

Skill to **rozszerzenie agenta** — folder z plikiem `SKILL.md`, który dodaje agentowi nowe umiejętności. Np. skill `weather` uczy agenta sprawdzać pogodę, `github` pozwala zarządzać PR-ami, a `notion` integruje z Notion API.

Skille działają jak instrukcje: mówią agentowi jakich narzędzi użyć i jak się zachować w kontekście danego zadania.

## Czym jest ClawHub?

[ClawHub](https://clawhub.ai) to **publiczny katalog skilli** dla OpenClaw. Wszystkie skille są darmowe i otwarte. Możesz je przeglądać na stronie lub instalować przez CLI.

---

## Instalacja ClawHub CLI

### npm (lokalnie)

```bash
npm i -g clawhub
```

### Docker

Wejdź do kontenera i zainstaluj:

```bash
docker exec -it openclaw-openclaw-gateway-1 bash

# Wewnątrz kontenera:
npm i -g clawhub
```

Lub trwale — dodaj do `Dockerfile` przed końcowym `CMD`:
```dockerfile
RUN npm install -g clawhub
```

Potem przebuduj:
```bash
cd ~/openclaw
docker compose build
docker compose up -d openclaw-gateway
```

---

## Szukanie skilli

```bash
clawhub search "pogoda"
clawhub search "notes productivity"
clawhub search "github code review"
clawhub search "image generation" --limit 20
```

Wyszukiwanie jest semantyczne — nie musisz trafiać w dokładną nazwę.

## Instalacja skilla

```bash
clawhub install weather
clawhub install github
clawhub install notion
```

### Docker

```bash
# Z hosta:
docker compose run --rm openclaw-cli bash -c "npm i -g clawhub && clawhub install weather"

# Lub wewnątrz kontenera (jeśli clawhub jest zainstalowany):
clawhub install weather
```

## Po instalacji — odświeżenie

Agent widzi skille na początku sesji. Po instalacji nowego skilla:

1. **Rozpocznij nową sesję** (nowa wiadomość do bota) — najprostsze
2. Lub poproś agenta: *"refresh skills"*
3. Lub zrestartuj gateway:
   ```bash
   # npm:
   openclaw restart

   # Docker:
   docker compose restart openclaw-gateway
   ```

## Zarządzanie skillami

```bash
clawhub list                    # zainstalowane skille
clawhub update weather          # aktualizuj konkretny
clawhub update --all            # aktualizuj wszystkie

# W OpenClaw CLI:
openclaw skills list            # lista dostępnych skilli
openclaw skills list --eligible # tylko te które spełniają wymagania
openclaw skills check           # sprawdź które działają
```

### Docker

```bash
docker compose run --rm openclaw-cli skills list
docker compose run --rm openclaw-cli skills list --eligible
docker compose run --rm openclaw-cli skills check
```

---

## Rekomendowane skille według typu zadań

### Osobisty asystent / codzienna produktywność

| Skill | Co robi | Wymaga |
|-------|---------|--------|
| `weather` | Pogoda i prognozy | nic (darmowy) |
| `summarize` | Streszczenia URL, plików, YouTube | `brew install steipete/tap/summarize` |
| `apple-reminders` | Zarządzanie przypomnieniami | macOS |
| `apple-notes` | Zarządzanie notatkami | macOS |

Zacznij od `weather` i `summarize` — nie wymagają kluczy API i od razu pokazują wartość.

### Praca z notatkami i wiedzą

| Skill | Co robi | Wymaga |
|-------|---------|--------|
| `notion` | Strony, bazy danych, bloki w Notion | `NOTION_API_KEY` |
| `obsidian` | Praca z vaultami Obsidian (Markdown) | `obsidian-cli` |
| `bear-notes` | Bear Notes | macOS |
| `nano-pdf` | Przetwarzanie plików PDF | — |

### Programowanie i dev tools

| Skill | Co robi | Wymaga |
|-------|---------|--------|
| `github` | PR, issues, CI, code review przez `gh` CLI | `gh` (GitHub CLI) |
| `gh-issues` | Zarządzanie GitHub Issues | `gh` |
| `coding-agent` | Delegowanie zadań do Claude Code / Codex | agent AI na maszynie |
| `tmux` | Zarządzanie sesjami tmux | `tmux` |

### Komunikacja

| Skill | Co robi | Wymaga |
|-------|---------|--------|
| `slack` | Wiadomości, reakcje, pinowanie w Slacku | token Slack |
| `himalaya` | Email: czytanie, pisanie, wysyłanie (IMAP/SMTP) | `himalaya` CLI |
| `imsg` | iMessage | macOS |

### Generowanie treści i AI

| Skill | Co robi | Wymaga |
|-------|---------|--------|
| `openai-image-gen` | Generowanie obrazów (DALL-E / GPT) | `OPENAI_API_KEY` |
| `canvas` | Wyświetlanie HTML: gry, wizualizacje, dashboardy | — |
| `openai-whisper-api` | Transkrypcja mowy na tekst | `OPENAI_API_KEY` |

### Smart home i multimedia

| Skill | Co robi | Wymaga |
|-------|---------|--------|
| `openhue` | Sterowanie oświetleniem Philips Hue | bridge Hue |
| `spotify-player` | Sterowanie Spotify | `spogo` lub `spotify_player` |
| `sonoscli` | Sterowanie głośnikami Sonos | `sonoscli` |

---

## Na warsztatach — szybki start

Najłatwiejsze skille na start (bez kluczy API, minimalne wymagania):

```bash
clawhub install weather
clawhub install summarize
clawhub install canvas
```

Potem w Telegramie:
- *"Jaka jest pogoda w Warszawie?"*
- *"Streść mi ten artykuł: [URL]"*
- *"Zrób mi prosty dashboard z zegarem"*

---

## Troubleshooting

| Problem | Rozwiązanie |
|---------|------------|
| Skill nie widoczny po instalacji | Rozpocznij nową sesję lub poproś o "refresh skills" |
| Skill wymaga binarki której nie ma | Zainstaluj ją (`brew install ...` lub `apt-get` w kontenerze) |
| Skill wymaga klucza API | Ustaw zmienną w `~/.openclaw/openclaw.json` sekcja `skills.entries` |
| Skill nie działa w Docker | Binaria/klucze muszą być w kontenerze, nie tylko na hoście |
| `clawhub: command not found` (Docker) | Zainstaluj w kontenerze: `npm i -g clawhub` |
