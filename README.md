# Warsztaty OpenClaw

Osobisty asystent AI, którego postawisz w 30 minut. Podłączysz go do Telegrama, nadasz mu charakter i nauczysz nowych rzeczy.

> **[MAPA.md](MAPA.md)** — chronologiczny przewodnik od zera do działającego bota (zacznij tutaj)

## Zanim zaczniesz

> [przygotowanie.md](przygotowanie.md) — co zainstalować przed warsztatami (Docker, Telegram, klucz API)

---

## Krok 1: Instalacja

```bash
git clone https://github.com/openclaw/openclaw.git
cd openclaw
./docker-setup.sh
```

Skrypt zbuduje obraz Docker i przeprowadzi Cię przez konfigurację modelu AI i kanałów.

Szczegóły: [SETUP.md](SETUP.md) | Prompt dla agenta AI: [DOCKER-STARTER.md](DOCKER-STARTER.md)

## Krok 2: Telegram bot

1. Otwórz Telegram → napisz do **@BotFather** → `/newbot`
2. Podaj nazwę i username (musi kończyć się na `_bot`)
3. Skopiuj token API i wklej w kreatorze onboardingu
4. Napisz `/start` do swojego bota na Telegramie
5. Zatwierdź parowanie:

```bash
cd openclaw
docker compose run --rm openclaw-cli pairing approve telegram <KOD>
```

## Krok 3: Gadasz z botem

Napisz cokolwiek do bota na Telegramie. Odpowiada? Lecimy dalej.

## Krok 4: Personalizacja

Edytuj pliki w `~/.openclaw/workspace/` albo przez dashboard: http://127.0.0.1:18789/

| Plik | Co zmienić |
|------|-----------|
| **Identity.md** | Imię, rola, emoji, charakter |
| **Soul.md** | Wartości, granice, ton rozmowy |
| **User.md** | Info o Tobie — preferencje, kontekst |

Szczegóły: [SETUP.md sekcja 5](SETUP.md#5-personalizacja-agenta)

## Krok 5: Twój projekt

Wybierz co chcesz zrobić z agentem → [POMYSLY.md](POMYSLY.md)

---

## Pomoc

```bash
cd openclaw
docker compose run --rm openclaw-cli doctor          # diagnostyka
docker compose logs -f openclaw-gateway               # logi na żywo
docker compose restart openclaw-gateway                # restart
```

Dashboard: http://127.0.0.1:18789/ | Opis panelu: [DASHBOARD.md](DASHBOARD.md) | Wszystkie komendy: [CHEATSHEET.md](CHEATSHEET.md)

## Czyszczenie (po warsztatach)

```bash
cd openclaw
docker compose down            # zatrzymuje kontenery
docker rmi openclaw:local      # usuwa obraz Docker
rm -rf ~/.openclaw             # usuwa konfigurację i dane
```
