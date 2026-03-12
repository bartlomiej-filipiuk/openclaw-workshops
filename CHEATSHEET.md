# OpenClaw — Cheat Sheet

Wszystkie komendy zakładają Docker. Musisz być w katalogu `openclaw` (gdzie jest `docker-compose.yml`).

## Jak uruchamiać komendy

Są dwa sposoby:

### Sposób 1: Wejdź do kontenera (zalecany)

Zaloguj się do shella wewnątrz kontenera — potem używasz `openclaw` normalnie:

```bash
# macOS / Linux:
docker exec -it openclaw-openclaw-gateway-1 bash

# Windows (PowerShell / CMD):
docker exec -it openclaw-openclaw-gateway-1 bash

# Jeśli bash nie jest dostępny:
docker exec -it openclaw-openclaw-gateway-1 sh
```

Teraz jesteś w kontenerze i komendy działają bezpośrednio:
```bash
openclaw status
openclaw doctor
openclaw models list
# ... itd.
```

Wyjście z kontenera: `exit`

### Sposób 2: Jednorazowe komendy z hosta

Bez logowania do kontenera — każda komenda osobno:
```bash
docker compose run --rm openclaw-cli <komenda>
```

---

## Status i diagnostyka

```bash
openclaw status                          # szybki przegląd — kanały, sesje
openclaw status --deep                   # z probes (sprawdza połączenia na żywo)
openclaw doctor                          # diagnostyka problemów
openclaw doctor --fix                    # automatyczna naprawa znalezionych problemów
openclaw health                          # health check gateway
```

## Logi

```bash
docker compose logs -f openclaw-gateway          # logi na żywo (z hosta)
docker compose logs --tail=50 openclaw-gateway    # ostatnie 50 linii (z hosta)
openclaw channels logs                            # logi kanałów z pliku
```

## Restart / stop / start

```bash
docker compose restart openclaw-gateway    # restart kontenera
docker compose down                        # zatrzymanie
docker compose up -d openclaw-gateway      # uruchomienie
```

---

## Modele AI

```bash
openclaw models                                  # aktualny model
openclaw models list                             # skonfigurowane modele
openclaw models list --all                       # pełny katalog dostępnych modeli
openclaw models set <model>                      # zmień domyślny model

# Przykłady:
openclaw models set openrouter/anthropic/claude-sonnet-4
openclaw models set openrouter/google/gemini-2.5-flash
openclaw models set openai-codex/gpt-5.4

openclaw models status --probe                   # sprawdź czy auth do modelu działa
```

### Fallbacki (zapasowe modele)

```bash
openclaw models fallbacks list                   # lista fallbacków
openclaw models fallbacks add <model>            # dodaj fallback
openclaw models fallbacks remove <model>         # usuń fallback
```

### Autoryzacja modeli

```bash
openclaw models auth add                         # interaktywne dodanie klucza API
openclaw models auth login                       # OAuth login (np. OpenAI)
```

---

## Kanały (Telegram, Discord, itp.)

```bash
openclaw channels list                           # lista kanałów
openclaw channels status --probe                 # status z live check
openclaw channels add                            # dodaj kanał (interaktywne)
openclaw channels remove                         # usuń kanał

# Dodanie Telegrama bezpośrednio:
openclaw channels add --channel telegram --token <BOT_TOKEN>

# Dodanie Discorda:
openclaw channels add --channel discord --token <BOT_TOKEN>
```

## Parowanie (pierwsze połączenie z botem)

```bash
openclaw pairing list                            # pokaż oczekujące kody parowania
openclaw pairing approve telegram <KOD>          # zatwierdź parowanie Telegram
openclaw pairing approve discord <KOD>           # zatwierdź parowanie Discord
```

---

## Cron — zaplanowane zadania

```bash
openclaw cron list                               # lista cron jobów
openclaw cron list --all                         # łącznie z wyłączonymi

# Dodaj cron job:
openclaw cron add --name "poranna-motywacja" \
  --every "day at 7:00" \
  --message "Wyślij mi krótką poranną motywację"

# Więcej przykładów schedulingu:
openclaw cron add --name "raport" --cron "0 18 * * 1-5" --message "Podsumuj mój dzień"
openclaw cron add --name "reminder" --every "2h" --message "Przypomnij mi o przerwie"

openclaw cron run <id>                           # odpal teraz (test)
openclaw cron disable <id>                       # wyłącz
openclaw cron enable <id>                        # włącz
openclaw cron rm <id>                            # usuń
openclaw cron runs --id <id>                     # historia uruchomień
```

---

## Personalizacja agenta

Pliki do edycji w `~/.openclaw/workspace/`:

| Plik | Co zmienić |
|------|-----------|
| `Identity.md` | Imię, rola, emoji, charakter |
| `Soul.md` | Wartości, granice, ton rozmowy |
| `User.md` | Info o Tobie — preferencje, kontekst |
| `Memory.md` | Pamięć długoterminowa (auto-aktualizowana) |
| `Agents.md` | Instrukcje operacyjne |
| `Tools.md` | Dokumentacja narzędzi |
| `Heartbeat.md` | Harmonogram proaktywnych akcji |

Edytuj przez dashboard http://127.0.0.1:18789/ (zakładka Agents) lub dowolnym edytorem.

---

## Pamięć agenta

```bash
openclaw memory status                           # status indeksu pamięci
openclaw memory search "temat"                   # szukaj w pamięci agenta
openclaw memory index                            # przeindeksuj pamięć
openclaw memory index --force                    # pełna reindeksacja
```

## Sesje (historia rozmów)

```bash
openclaw sessions                                # lista sesji z zużyciem tokenów
openclaw sessions cleanup                        # porządkowanie starych sesji
```

---

## Skills (rozszerzenia)

```bash
openclaw skills list                             # dostępne skille
openclaw skills list --eligible                  # gotowe do użycia
openclaw skills info <nazwa>                     # szczegóły skilla
openclaw skills check                            # sprawdź które działają
```

## Pluginy

```bash
openclaw plugins list                            # zainstalowane pluginy
openclaw plugins install <nazwa>                 # zainstaluj plugin
openclaw plugins enable <id>                     # włącz plugin
openclaw plugins disable <id>                    # wyłącz plugin
openclaw plugins update --all                    # aktualizuj wszystkie
openclaw plugins doctor                          # diagnostyka pluginów
```

---

## Konfiguracja (zaawansowane)

```bash
openclaw config get <ścieżka>                   # odczytaj wartość
openclaw config set <ścieżka> <wartość>         # ustaw wartość
openclaw config unset <ścieżka>                 # usuń wartość
openclaw config validate                         # sprawdź poprawność konfiga

# Przykłady:
openclaw config get agents.defaults.model
openclaw config set messages.ackReactionScope "all"
openclaw config set channels.telegram.groupPolicy "open"
```

## Bezpieczeństwo

```bash
openclaw security audit                          # szybki audyt konfiga
openclaw security audit --deep                   # z live probes
openclaw security audit --fix                    # automatyczna naprawa
```

---

## Wysyłanie wiadomości z CLI

```bash
# Wyślij wiadomość do kanału:
openclaw message send --to "telegram:direct:<USER_ID>" --text "Hej!"

# Broadcast do wielu:
openclaw message broadcast --to "telegram:*" --text "Wiadomość do wszystkich"
```

## Backup

```bash
openclaw backup create                           # stwórz backup ~/.openclaw
openclaw backup verify <archiwum>               # zweryfikuj backup
```

## Aktualizacja OpenClaw

```bash
cd openclaw
git pull
./docker-setup.sh                          # przebuduje obraz i zrestartuje
```

---

## Dashboard

Otwórz http://127.0.0.1:18789/ w przeglądarce.

| Zakładka | Co tam jest |
|----------|------------|
| Chat | Rozmowa z agentem przez przeglądarkę |
| Overview | Status gateway, uptime, health |
| Channels | Zarządzanie kanałami |
| Sessions | Historia rozmów |
| Usage | Zużycie API i koszty |
| Cron Jobs | Zaplanowane zadania |
| Agents | Workspace — pliki Identity.md, Soul.md itp. |
| Skills | Rozszerzenia agenta |
| Config | Edytor konfiguracji (JSON) |
| Logs | Logi na żywo |
