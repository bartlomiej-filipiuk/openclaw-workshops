# OpenClaw - Przewodnik warsztatowy

Przewodnik krok po kroku do postawienia własnego asystenta AI na warsztatach.

---

## 1. Instalacja

### Wariant A: npm (rekomendowany na warsztaty)

Wymagania: Node.js 22+

```bash
npm install -g openclaw@latest
```

Sprawdź:
```bash
openclaw --version
```

### Wariant B: Docker

Wymagania: Docker Desktop (lub Docker Engine + Docker Compose)

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
./docker-setup.sh
```

Skrypt `docker-setup.sh` automatycznie:
- zbuduje obraz Docker (kilka minut za pierwszym razem)
- utworzy katalogi konfiguracji (`~/.openclaw/`)
- wygeneruje token gateway
- uruchomi kreator onboardingu (te same kroki co w Wariancie A)
- wystartuje gateway w kontenerze

Po zakończeniu sprawdź czy działa:
```bash
curl http://127.0.0.1:18789/healthz
# Oczekiwany wynik: {"ok":true,"status":"live"}
```

Dashboard: otwórz http://127.0.0.1:18789/ w przeglądarce.

#### Ściągawka komend Docker

W wariancie Docker **nie** używasz bezpośrednio komendy `openclaw`. Zamiast tego wszystko idzie przez `docker compose`:

```bash
# Musisz być w katalogu openclaw (gdzie jest docker-compose.yml)
cd openclaw

# Status gateway i kanałów
docker compose run --rm openclaw-cli status
docker compose run --rm openclaw-cli channels status --probe

# Restart gateway
docker compose restart openclaw-gateway

# Logi (na żywo)
docker compose logs -f openclaw-gateway

# Dodanie kanału (np. Telegram)
docker compose run --rm openclaw-cli channels add --channel telegram --token <TOKEN>

# Parowanie (po /start w Telegramie)
docker compose run --rm openclaw-cli pairing approve telegram <KOD>

# Zmiana modelu
docker compose run --rm openclaw-cli models set openrouter/anthropic/claude-sonnet-4

# Diagnostyka
docker compose run --rm openclaw-cli doctor

# Zatrzymanie gateway
docker compose down

# Ponowne uruchomienie
docker compose up -d openclaw-gateway
```

#### Aktualizacja (Docker)

```bash
cd openclaw
git pull
./docker-setup.sh   # przebuduje obraz i zrestartuje
```

---

## 2. Onboarding

**npm:**
```bash
openclaw onboard --install-daemon
```

**Docker:** onboarding uruchamia się automatycznie podczas `./docker-setup.sh`.

Kreator przeprowadzi Cię przez konfigurację. Poniżej opis każdego kroku.

### Krok 1: Ostrzeżenie bezpieczeństwa

Na starcie zobaczysz rekomendacje bezpieczeństwa. Oto co oznaczają i co warto wybrać:

**Rekomendowany baseline:**
- **Pairing + allowlisty + mention gating** - każdy nowy rozmówca musi się sparować kodem, w grupach bot reaguje tylko na wzmianki. Zostawiamy domyślne - to bezpieczne ustawienie.
- **Sandbox + minimalne uprawnienia narzędzi** - agent ma ograniczony dostęp do systemu. Na warsztatach możemy zostawić sandbox wyłączony (domyślne), bo pracujemy lokalnie.
- **Izolacja sesji DM** (`session.dmScope: per-channel-peer`) - każda rozmowa z innym nadawcą to osobna sesja. Domyślne, nie trzeba zmieniać.
- **Sekrety poza zasięgiem agenta** - klucze API trzymaj w zmiennych środowiskowych lub SecretRef, nie w plikach workspace.
- **Najsilniejszy model dla bota z narzędziami** - lepszy model = mniej błędnych wywołań narzędzi.

**Co regularnie uruchamiać:**
```bash
openclaw security audit --deep    # sprawdza konfigurację
openclaw security audit --fix     # naprawia znalezione problemy
```

Na warsztatach: **akceptujemy ostrzeżenie i idziemy dalej.** Domyślne ustawienia są bezpieczne dla użytku osobistego.

### Krok 2: Wybór providera i modelu

Kreator zapyta o provider modeli AI. Opcje:

**Opcja A: OpenAI (przez logowanie / OAuth)**
- Wybierz "OpenAI" → metoda uwierzytelnienia "Login"
- Zaloguj się przez przeglądarkę - uzyskasz token z subskrypcji (Plus/Pro/Team)
- Nie potrzebujesz osobnego klucza API - korzystasz z istniejącej subskrypcji
- Model: np. `gpt-5.4-codex`

**Opcja B: OpenRouter (klucz API)**
- Wybierz "OpenRouter" → wklej klucz API
- Model: np. `anthropic/claude-sonnet-4` lub `google/gemini-2.5-flash`

**Opcja C: Anthropic (klucz API)**
- Wybierz "Anthropic" → wklej klucz API
- Model: np. `claude-sonnet-4`

### Krok 3: Kanał komunikacji - Telegram

Kreator przeprowadzi Cię przez dodanie kanału. Dla Telegrama:

1. Otwórz Telegram, napisz do **@BotFather**
2. Wyślij `/newbot`
3. Podaj nazwę wyświetlaną (np. "Mój Asystent")
4. Podaj username bota (musi kończyć się na `_bot`, np. `moj_asystent_bot`)
5. Skopiuj token API który dostaniesz od BotFathera
6. Wklej token w kreatorze onboardingu

Po zakończeniu onboardingu, napisz `/start` do swojego bota i zatwierdź parowanie:
```bash
# npm:
openclaw pairing approve telegram <KOD>

# Docker:
docker compose run --rm openclaw-cli pairing approve telegram <KOD>
```

### Krok 4: Web Search (opcjonalnie)

Kreator zapyta o dostawcę wyszukiwania. Opcje:
- **Brave Search** (rekomendowany) - klucz API z https://brave.com/search/api/
- Perplexity, Gemini, Grok, Kimi - alternatywy
- Można pominąć i dodać później

### Krok 5: Skills

Kreator zaproponuje instalację skills (rozszerzeń). Możesz zainstalować wybrane lub pominąć - skills można dodawać później przez `clawhub install <nazwa>`.

### Krok 6: Daemon + Health check

Kreator zainstaluje daemon (autostart) i sprawdzi czy gateway działa.
- macOS: LaunchAgent (startuje przy logowaniu)
- Linux: systemd user unit

Po zakończeniu: `openclaw dashboard` otworzy panel w przeglądarce na http://127.0.0.1:18789/

---

## 3. Konfiguracja modelu AI

OpenClaw potrzebuje klucza API do modelu językowego.

### OpenRouter (rekomendowany)

1. Zarejestruj się na https://openrouter.ai
2. Doładuj konto (min. ~$5)
3. Skopiuj klucz API
4. Podczas onboardingu wybierz OpenRouter jako provider i wklej klucz

Zmienna środowiskowa: `OPENROUTER_API_KEY`

### Anthropic (Claude)

Zmienna: `ANTHROPIC_API_KEY`

### OpenAI / Codex

Zmienna: `OPENAI_API_KEY`

Jeśli masz subskrypcję ChatGPT (Plus/Pro/Team), możesz wygenerować klucz API do Codex i połączyć się przez OAuth.

### Konfiguracja modelu z CLI

```bash
openclaw models set openrouter/anthropic/claude-sonnet-4
openclaw models fallbacks add openrouter/google/gemini-2.5-flash
```

---

## 4. Integracja z komunikatorem

### Telegram

1. Otwórz Telegram, napisz do **@BotFather**
2. Wyślij `/newbot`
3. Podaj nazwę i username (musi kończyć się na `_bot`)
4. Skopiuj token API
5. W terminalu:
   ```bash
   openclaw channels add
   # Wybierz: Telegram (Bot API)
   # Wklej token
   ```
6. Zrestartuj gateway: `openclaw restart`
7. Napisz `/start` do swojego bota na Telegramie
8. Zatwierdź parowanie:
   ```bash
   openclaw pairing approve telegram <KOD>
   ```

### Discord

1. Wejdź na https://discord.com/developers/applications
2. Utwórz nową aplikację → Bot → skopiuj token
3. Dodaj bota na swój serwer (OAuth2 → URL Generator → bot scope)
4. W terminalu:
   ```bash
   openclaw channels add
   # Wybierz: Discord
   # Wklej token bota
   ```
5. Zrestartuj gateway i zatwierdź parowanie jak wyżej

---

## 5. Personalizacja agenta

OpenClaw używa plików markdown do definiowania osobowości. Znajdziesz je w `~/.openclaw/workspace/`:

| Plik | Co robi |
|------|---------|
| **Soul.md** | Podstawowe wartości i granice zachowania |
| **Identity.md** | Imię, rola, emoji, avatar agenta |
| **User.md** | Info o Tobie - preferencje, kontekst |
| **Memory.md** | Pamięć długoterminowa (auto-aktualizowana) |
| **Agents.md** | Instrukcje operacyjne |
| **Tools.md** | Dokumentacja narzędzi |
| **Heartbeat.md** | Harmonogram proaktywnych akcji |
| **Bootstrap.md** | Instrukcje pierwszego uruchomienia |

Edytuj je w VS Code lub przez dashboard (`openclaw dashboard`).

---

## 6. Przydatne komendy

### npm

| Komenda | Opis |
|---------|------|
| `openclaw status` | Status usługi i połączeń |
| `openclaw doctor` | Diagnostyka problemów |
| `openclaw dashboard` | Panel sterowania w przeglądarce |
| `openclaw security audit --deep` | Audyt bezpieczeństwa |
| `openclaw channels list` | Lista kanałów |
| `openclaw models list` | Lista modeli |
| `openclaw restart` | Restart gateway |
| `openclaw logs` | Podgląd logów |

### Docker

| Komenda | Opis |
|---------|------|
| `docker compose run --rm openclaw-cli status` | Status usługi i połączeń |
| `docker compose run --rm openclaw-cli doctor` | Diagnostyka problemów |
| `open http://127.0.0.1:18789/` | Panel sterowania w przeglądarce |
| `docker compose run --rm openclaw-cli channels list` | Lista kanałów |
| `docker compose run --rm openclaw-cli models list` | Lista modeli |
| `docker compose restart openclaw-gateway` | Restart gateway |
| `docker compose logs -f openclaw-gateway` | Podgląd logów |
| `docker compose down` | Zatrzymanie gateway |
| `docker compose up -d openclaw-gateway` | Uruchomienie gateway |

---

## 7. Bezpieczeństwo

- Gateway domyślnie nasłuchuje na **loopback** (127.0.0.1) - nie jest wystawiony na sieć
- Autoryzacja tokenem (losowy 48-znakowy hex)
- **Pairing** na kanałach - każde nowe urządzenie wymaga zatwierdzenia kodem
- Sesje izolowane per kanał + nadawca
- Jeśli potrzebujesz zdalnego dostępu: użyj SSH tunnel lub Tailscale, **nie wystawiaj gateway na internet**

```bash
# SSH tunnel (dostęp do panelu z laptopa)
ssh -N -L 18789:127.0.0.1:18789 user@serwer
# Potem otwórz: http://127.0.0.1:18789
```

---

## 8. Troubleshooting

### npm
```bash
openclaw doctor
openclaw logs
openclaw restart
openclaw onboard --reset    # reset konfiguracji (od nowa)
```

### Docker
```bash
docker compose run --rm openclaw-cli doctor
docker compose logs -f openclaw-gateway
docker compose restart openclaw-gateway
docker compose down && ./docker-setup.sh   # reset (od nowa)
```

---

## 9. Czyszczenie (po warsztatach)

### npm
```bash
openclaw gateway uninstall    # usuwa daemon (LaunchAgent / systemd)
rm -rf ~/.openclaw             # usuwa konfigurację i dane
npm uninstall -g openclaw      # usuwa CLI
```

### Docker
```bash
cd openclaw
docker compose down            # zatrzymuje kontenery
docker rmi openclaw:local      # usuwa obraz Docker
rm -rf ~/.openclaw             # usuwa konfigurację i dane
```
