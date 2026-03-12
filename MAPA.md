# MAPA — od zera do działającego bota

Chronologiczny przewodnik. Każdy krok: co zrobić, jak sprawdzić, gdzie szczegóły.

---

## 1. Przygotowanie

Zainstaluj Docker, Git, Telegram + załóż konto u dostawcy modeli AI.

**Checkpoint:** `docker --version` i `docker compose version` zwracają wersje.

→ Szczegóły: [przygotowanie.md](przygotowanie.md)

---

## 2. Wybierz ścieżkę

| Ścieżka | Dla kogo | Komenda startowa |
|----------|----------|------------------|
| **Docker** (rekomendowany) | Wszyscy na warsztatach | `./docker-setup.sh` |
| **npm** | Jeśli masz Node.js 22+ i wolisz bez Dockera | `npm install -g openclaw@latest` |

Poniższe kroki zakładają **Docker**. Wariant npm: [SETUP.md sekcja 1](SETUP.md#1-instalacja).

---

## 3. Instalacja

```bash
git clone https://github.com/openclaw/openclaw.git ~/openclaw
cd ~/openclaw
./docker-setup.sh
```

Skrypt zbuduje obraz i uruchomi kreator onboardingu (kroki 4–8).

→ Szczegóły: [SETUP.md sekcja 1](SETUP.md#1-instalacja)

---

## 4. Onboarding — zgoda bezpieczeństwa

Kreator wyświetli ostrzeżenie o bezpieczeństwie. Na warsztatach: **akceptuj i idź dalej** — domyślne ustawienia są bezpieczne.

**Checkpoint:** kreator przechodzi do pytania o provider AI.

→ Szczegóły: [SETUP.md krok 1](SETUP.md#krok-1-ostrzeżenie-bezpieczeństwa)

---

## 5. Provider AI

Wybierz dostawcę modelu i podaj klucz API:
- **OpenRouter** — jedno konto, wiele modeli (rekomendowany)
- **OpenAI** — jeśli masz subskrypcję ChatGPT, logowanie przez OAuth
- **Anthropic** — klucz API do Claude

**Checkpoint:** kreator przechodzi do pytania o kanał komunikacji.

→ Szczegóły: [SETUP.md krok 2](SETUP.md#krok-2-wybór-providera-i-modelu)

---

## 6. Telegram bot

1. Otwórz Telegram → napisz do **@BotFather** → `/newbot`
2. Podaj nazwę i username (musi kończyć się na `_bot`)
3. Skopiuj token API i wklej w kreatorze

**Checkpoint:** kreator potwierdza dodanie kanału Telegram.

→ Szczegóły: [SETUP.md krok 3](SETUP.md#krok-3-kanał-komunikacji---telegram)

---

## 7. Web Search (opcjonalnie)

Kreator zapyta o dostawcę wyszukiwania. Możesz pominąć — dodasz później.

→ Szczegóły: [SETUP.md krok 4](SETUP.md#krok-4-web-search-opcjonalnie)

---

## 8. Skills (opcjonalnie)

Kreator zaproponuje instalację rozszerzeń. Możesz pominąć — dodasz później przez `clawhub install <nazwa>`.

→ Szczegóły: [SETUP.md krok 5](SETUP.md#krok-5-skills)

---

## 9. Health check

```bash
curl http://127.0.0.1:18789/healthz
# Oczekiwany wynik: {"ok":true,"status":"live"}
```

Dashboard: otwórz http://127.0.0.1:18789/ w przeglądarce.

**Checkpoint:** health check zwraca `{"ok":true}`, dashboard się otwiera.

→ Szczegóły: [SETUP.md krok 6](SETUP.md#krok-6-daemon--health-check) | [DASHBOARD.md](DASHBOARD.md)

---

## 10. Parowanie Telegram

1. Otwórz Telegram → znajdź swojego bota → wyślij `/start`
2. Bot odpowie kodem parowania
3. Zatwierdź:

```bash
cd ~/openclaw
docker compose run --rm openclaw-cli pairing approve telegram <KOD>
```

**Checkpoint:** komenda zwraca potwierdzenie parowania.

→ Szczegóły: [SETUP.md sekcja 4](SETUP.md#4-integracja-z-komunikatorem)

---

## 11. Test

Napisz cokolwiek do bota na Telegramie. Odpowiada? **Lecimy dalej.**

Jeśli nie odpowiada:
```bash
cd ~/openclaw
docker compose run --rm openclaw-cli doctor
docker compose logs --tail=20 openclaw-gateway
```

→ Pomoc: [CHEATSHEET.md](CHEATSHEET.md)

---

## 12. Personalizacja

Edytuj pliki w `~/.openclaw/workspace/` lub przez dashboard:

| Plik | Co zmienić |
|------|-----------|
| `Identity.md` | Imię, rola, charakter |
| `Soul.md` | Wartości, granice, ton |
| `User.md` | Info o Tobie |

**Checkpoint:** napisz do bota — odpowiada zgodnie z nową tożsamością.

→ Szczegóły: [SETUP.md sekcja 5](SETUP.md#5-personalizacja-agenta)

---

## 13. Co dalej?

Wybierz projekt i leć → [POMYSLY.md](POMYSLY.md)

---

## Przydatne linki

| Potrzebuję... | Gdzie |
|---------------|-------|
| Wszystkie komendy | [CHEATSHEET.md](CHEATSHEET.md) |
| Opis panelu dashboard | [DASHBOARD.md](DASHBOARD.md) |
| Agent AI zamiast ręcznej konfiguracji | [DOCKER-STARTER.md](DOCKER-STARTER.md) |
| Docker zaawansowany (mapowanie katalogów, narzędzia) | [SETUP.md sekcja 9](SETUP.md#9-docker-zaawansowany--narzędzia-z-hosta-i-mapowanie-katalogów) |
| Czyszczenie po warsztatach | [SETUP.md sekcja 10](SETUP.md#10-czyszczenie-po-warsztatach) |
