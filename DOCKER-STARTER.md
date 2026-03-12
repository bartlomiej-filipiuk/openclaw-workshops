# OpenClaw Docker Starter — prompt dla agenta AI

Poniższy dokument to instrukcja, którą możesz wkleić do agenta AI (Claude Code, Cursor, Codex, itp.) żeby postawił Ci OpenClaw w Dockerze od zera.

---

## Tryb auto (domyślny) — agent wykonuje komendy

Wklej ten prompt do agenta z dostępem do terminala (Claude Code, Cursor, Codex). Agent sam odpala komendy i weryfikuje wyniki.

```
Pomóż mi postawić OpenClaw w Dockerze. Przeprowadź mnie przez cały proces krok po kroku.
Wykonuj komendy po kolei, czekaj na wynik każdej przed przejściem dalej.
Jeśli coś wymaga mojej interakcji (np. onboarding, wklejenie tokena) — powiedz mi co mam zrobić.

### Wymagania wstępne

Sprawdź czy Docker działa:
- `docker info` — powinno zwrócić info o silniku
- `docker compose version` — powinno zwrócić wersję Compose
- `git --version` — potrzebny do sklonowania repo

Jeśli cokolwiek brakuje, powiedz mi co zainstalować i zatrzymaj się.

### Krok 1: Sklonuj repo i uruchom setup

```bash
git clone https://github.com/openclaw/openclaw.git ~/openclaw
cd ~/openclaw
./docker-setup.sh
```

Skrypt jest interaktywny — przeprowadzi onboarding:
1. Ostrzeżenie bezpieczeństwa → akceptuję (Yes)
2. Provider modelu AI → pytam usera o wybór (OpenRouter / Anthropic / OpenAI)
3. Kanał komunikacji → Telegram (user musi podać token z @BotFather)
4. Web Search → opcjonalne, można pominąć
5. Skills → opcjonalne, można pominąć

### Krok 2: Weryfikacja

Po zakończeniu docker-setup.sh sprawdź:

```bash
# Health check
curl http://127.0.0.1:18789/healthz
# Oczekiwany wynik: {"ok":true,"status":"live"}

# Status kanałów
cd ~/openclaw
docker compose run --rm openclaw-cli channels status --probe
# Telegram powinien być: enabled, running, works
```

Jeśli health check nie przechodzi, sprawdź logi:
```bash
docker compose logs --tail=50 openclaw-gateway
```

### Krok 3: Parowanie z Telegramem

Powiedz userowi:
1. Otwórz Telegram, znajdź swojego bota i wyślij `/start`
2. Bot odpowie kodem parowania

Potem uruchom:
```bash
cd ~/openclaw
docker compose run --rm openclaw-cli pairing approve telegram <KOD>
```

### Krok 4: Test

Powiedz userowi żeby napisał wiadomość do bota na Telegramie.
Sprawdź logi czy nie ma błędów:
```bash
docker compose logs --tail=20 openclaw-gateway
```

### Krok 5: Dashboard

Otwórz panel sterowania:
```bash
open http://127.0.0.1:18789/
```

### Restart po zmianach konfiguracji

Po zmianie kluczy API (np. Brave Search, OpenRouter), modelu lub konfiguracji kanałów — gateway musi zostać zrestartowany, żeby zaciągnął nowe wartości.

```bash
cd ~/openclaw
docker compose restart openclaw-gateway
```

Jeśli zwykły restart nie pomaga (gateway się krzaczy, wisi, nie reaguje):
```bash
cd ~/openclaw
docker compose up -d --force-recreate openclaw-gateway
```

`--force-recreate` ubija kontener i tworzy go od nowa — czyści stan procesu, ale **nie kasuje danych** (konfiguracja w `~/.openclaw/` jest na volume).

### Troubleshooting

**EACCES: permission denied, mkdir '/Users'**
Kontener próbuje użyć ścieżek macOS. Napraw:
```bash
# Sprawdź czy config ma ścieżki /Users:
grep '/Users' ~/.openclaw/openclaw.json

# Jeśli agents.defaults.workspace wskazuje na /Users/..., napraw:
cd ~/openclaw
docker compose run --rm openclaw-cli config set agents.defaults.workspace /home/node/.openclaw/workspace
```

Jeśli problem dotyczy starych sesji:
```bash
rm ~/.openclaw/agents/main/sessions/*.jsonl ~/.openclaw/agents/main/sessions/sessions.json
docker compose restart openclaw-gateway
```

**Gateway nie startuje / port zajęty**
```bash
# Sprawdź czy port 18789 jest wolny:
lsof -i :18789

# Jeśli natywny openclaw nadal działa:
openclaw gateway uninstall
```

**Kontener nie odpowiada**
```bash
cd ~/openclaw
docker compose ps -a                    # status kontenerów
docker compose logs -f openclaw-gateway  # logi na żywo
docker compose restart openclaw-gateway  # restart
```

### Ściągawka komend

Wszystkie komendy openclaw w Dockerze idą przez `docker compose run --rm openclaw-cli`:

| Co chcę zrobić | Komenda |
|----------------|---------|
| Status | `docker compose run --rm openclaw-cli status` |
| Kanały | `docker compose run --rm openclaw-cli channels status --probe` |
| Dodaj kanał | `docker compose run --rm openclaw-cli channels add --channel telegram --token <TOKEN>` |
| Parowanie | `docker compose run --rm openclaw-cli pairing approve telegram <KOD>` |
| Zmień model | `docker compose run --rm openclaw-cli models set <model>` |
| Diagnostyka | `docker compose run --rm openclaw-cli doctor` |
| Restart | `docker compose restart openclaw-gateway` |
| Logi | `docker compose logs -f openclaw-gateway` |
| Stop | `docker compose down` |
| Start | `docker compose up -d openclaw-gateway` |
| Dashboard | Otwórz http://127.0.0.1:18789/ w przeglądarce |

Pamiętaj: musisz być w katalogu ~/openclaw (gdzie jest docker-compose.yml) żeby te komendy działały.
```

---

## Tryb guided — agent prowadzi, ty odpalasz komendy

Jeśli wolisz sam wpisywać komendy w terminalu, a agent ma Cię tylko prowadzić — użyj tego promptu. Działa też w agentach bez dostępu do terminala (np. ChatGPT, Claude.ai).

```
Pomóż mi postawić OpenClaw w Dockerze. Prowadź mnie krok po kroku, ale NIE wykonuj komend sam.
Zamiast tego:
- Pokaż mi dokładnie jaką komendę wpisać i co powinien być wynik
- Poczekaj aż wkleję Ci output — dopiero wtedy przejdź dalej
- Jeśli wynik jest inny niż oczekiwany, pomóż mi zdiagnozować problem
- Przy każdym kroku wyjaśnij krótko co robimy i dlaczego

### Wymagania wstępne

Poproś mnie o uruchomienie po kolei:
- `docker info` — powinno zwrócić info o silniku Docker
- `docker compose version` — powinno zwrócić wersję Compose
- `git --version` — potrzebny do sklonowania repo

Jeśli cokolwiek brakuje, powiedz mi co zainstalować i zatrzymaj się.

### Krok 1: Sklonuj repo i uruchom setup

Powiedz mi żebym uruchomił:
```bash
git clone https://github.com/openclaw/openclaw.git ~/openclaw
cd ~/openclaw
./docker-setup.sh
```

Skrypt jest interaktywny — przeprowadzi onboarding:
1. Ostrzeżenie bezpieczeństwa → akceptuję (Yes)
2. Provider modelu AI → pytam o wybór (OpenRouter / Anthropic / OpenAI)
3. Kanał komunikacji → Telegram (muszę podać token z @BotFather)
4. Web Search → opcjonalne, można pominąć
5. Skills → opcjonalne, można pominąć

### Krok 2: Weryfikacja

Poproś mnie o uruchomienie:
```bash
curl http://127.0.0.1:18789/healthz
```
Oczekiwany wynik: `{"ok":true,"status":"live"}`

Potem:
```bash
cd ~/openclaw
docker compose run --rm openclaw-cli channels status --probe
```
Telegram powinien być: enabled, running, works.

### Krok 3: Parowanie z Telegramem

Powiedz mi żebym:
1. Otworzył Telegram, znalazł swojego bota i wysłał `/start`
2. Wkleił kod parowania — potem pokaż mi komendę do zatwierdzenia:
```bash
cd ~/openclaw
docker compose run --rm openclaw-cli pairing approve telegram <KOD>
```

### Krok 4: Test

Powiedz mi żebym napisał wiadomość do bota na Telegramie, a potem wkleił Ci output z:
```bash
docker compose logs --tail=20 openclaw-gateway
```

### Krok 5: Dashboard

Powiedz mi żebym otworzył http://127.0.0.1:18789/ w przeglądarce.

### Restart po zmianach konfiguracji

Po zmianie kluczy API, modelu lub konfiguracji kanałów — gateway wymaga restartu:
```bash
cd ~/openclaw
docker compose restart openclaw-gateway
```

Jeśli restart nie pomaga:
```bash
cd ~/openclaw
docker compose up -d --force-recreate openclaw-gateway
```

### Troubleshooting

Jeśli coś nie działa, pomóż mi diagnozować. Te komendy mogą się przydać:
- `docker compose ps -a` — status kontenerów
- `docker compose logs --tail=50 openclaw-gateway` — ostatnie logi
- `docker compose restart openclaw-gateway` — restart
- `lsof -i :18789` — sprawdź czy port jest wolny
```
