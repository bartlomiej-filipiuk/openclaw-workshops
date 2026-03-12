# OpenClaw — Cheat Sheet

Wszystkie komendy zakładają Docker. Musisz być w katalogu `openclaw` (gdzie jest `docker-compose.yml`).

Skrót używany poniżej:
```bash
# Zamiast pisać za każdym razem pełną komendę:
docker compose run --rm openclaw-cli <komenda>

# Możesz ustawić alias w terminalu:
alias oc='docker compose run --rm openclaw-cli'
# Wtedy: oc status, oc doctor, oc models list, itd.
```

---

## Status i diagnostyka

```bash
oc status                          # szybki przegląd — kanały, sesje
oc status --deep                   # z probes (sprawdza połączenia na żywo)
oc doctor                          # diagnostyka problemów
oc doctor --fix                    # automatyczna naprawa znalezionych problemów
oc health                          # health check gateway
```

## Logi

```bash
docker compose logs -f openclaw-gateway          # logi na żywo
docker compose logs --tail=50 openclaw-gateway    # ostatnie 50 linii
oc channels logs                                  # logi kanałów z pliku
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
oc models                                  # aktualny model
oc models list                             # skonfigurowane modele
oc models list --all                       # pełny katalog dostępnych modeli
oc models set <model>                      # zmień domyślny model

# Przykłady:
oc models set openrouter/anthropic/claude-sonnet-4
oc models set openrouter/google/gemini-2.5-flash
oc models set openai-codex/gpt-5.4

oc models status --probe                   # sprawdź czy auth do modelu działa
```

### Fallbacki (zapasowe modele)

```bash
oc models fallbacks list                   # lista fallbacków
oc models fallbacks add <model>            # dodaj fallback
oc models fallbacks remove <model>         # usuń fallback
```

### Autoryzacja modeli

```bash
oc models auth add                         # interaktywne dodanie klucza API
oc models auth login                       # OAuth login (np. OpenAI)
```

---

## Kanały (Telegram, Discord, itp.)

```bash
oc channels list                           # lista kanałów
oc channels status --probe                 # status z live check
oc channels add                            # dodaj kanał (interaktywne)
oc channels remove                         # usuń kanał

# Dodanie Telegrama bezpośrednio:
oc channels add --channel telegram --token <BOT_TOKEN>

# Dodanie Discorda:
oc channels add --channel discord --token <BOT_TOKEN>
```

## Parowanie (pierwsze połączenie z botem)

```bash
oc pairing list                            # pokaż oczekujące kody parowania
oc pairing approve telegram <KOD>          # zatwierdź parowanie Telegram
oc pairing approve discord <KOD>           # zatwierdź parowanie Discord
```

---

## Cron — zaplanowane zadania

```bash
oc cron list                               # lista cron jobów
oc cron list --all                         # łącznie z wyłączonymi

# Dodaj cron job:
oc cron add --name "poranna-motywacja" \
  --every "day at 7:00" \
  --message "Wyślij mi krótką poranną motywację"

# Więcej przykładów schedulingu:
oc cron add --name "raport" --cron "0 18 * * 1-5" --message "Podsumuj mój dzień"
oc cron add --name "reminder" --every "2h" --message "Przypomnij mi o przerwie"

oc cron run <id>                           # odpal teraz (test)
oc cron disable <id>                       # wyłącz
oc cron enable <id>                        # włącz
oc cron rm <id>                            # usuń
oc cron runs --id <id>                     # historia uruchomień
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
oc memory status                           # status indeksu pamięci
oc memory search "temat"                   # szukaj w pamięci agenta
oc memory index                            # przeindeksuj pamięć
oc memory index --force                    # pełna reindeksacja
```

## Sesje (historia rozmów)

```bash
oc sessions                                # lista sesji z zużyciem tokenów
oc sessions cleanup                        # porządkowanie starych sesji
```

---

## Skills (rozszerzenia)

```bash
oc skills list                             # dostępne skille
oc skills list --eligible                  # gotowe do użycia
oc skills info <nazwa>                     # szczegóły skilla
oc skills check                            # sprawdź które działają
```

## Pluginy

```bash
oc plugins list                            # zainstalowane pluginy
oc plugins install <nazwa>                 # zainstaluj plugin
oc plugins enable <id>                     # włącz plugin
oc plugins disable <id>                    # wyłącz plugin
oc plugins update --all                    # aktualizuj wszystkie
oc plugins doctor                          # diagnostyka pluginów
```

---

## Konfiguracja (zaawansowane)

```bash
oc config get <ścieżka>                   # odczytaj wartość
oc config set <ścieżka> <wartość>         # ustaw wartość
oc config unset <ścieżka>                 # usuń wartość
oc config validate                         # sprawdź poprawność konfiga

# Przykłady:
oc config get agents.defaults.model
oc config set messages.ackReactionScope "all"
oc config set channels.telegram.groupPolicy "open"
```

## Bezpieczeństwo

```bash
oc security audit                          # szybki audyt konfiga
oc security audit --deep                   # z live probes
oc security audit --fix                    # automatyczna naprawa
```

---

## Wysyłanie wiadomości z CLI

```bash
# Wyślij wiadomość do kanału:
oc message send --to "telegram:direct:<USER_ID>" --text "Hej!"

# Broadcast do wielu:
oc message broadcast --to "telegram:*" --text "Wiadomość do wszystkich"
```

## Backup

```bash
oc backup create                           # stwórz backup ~/.openclaw
oc backup verify <archiwum>               # zweryfikuj backup
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
