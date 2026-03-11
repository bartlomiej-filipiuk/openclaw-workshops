# Warsztaty OpenClaw

Osobisty asystent AI, którego postawisz w 30 minut. Podłączysz go do Telegrama, nadasz mu charakter i nauczysz nowych rzeczy.

## Zanim zaczniesz

→ [przygotowanie.md](przygotowanie.md) — co zainstalować przed warsztatami (Node.js 22+, Telegram, klucz API)

---

## Krok 1: Instalacja

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
```

Kreator przeprowadzi Cię przez konfigurację modelu AI i kanałów.

Szczegóły i wariant Docker: [SETUP.md](SETUP.md)

## Krok 2: Telegram bot

1. Otwórz Telegram → napisz do **@BotFather** → `/newbot`
2. Podaj nazwę i username (musi kończyć się na `_bot`)
3. Skopiuj token API i wklej w kreatorze onboardingu
4. Napisz `/start` do swojego bota na Telegramie
5. Zatwierdź parowanie:

```bash
openclaw pairing approve telegram <KOD>
```

## Krok 3: Gadasz z botem

Napisz cokolwiek do bota na Telegramie. Odpowiada? Lecimy dalej.

## Krok 4: Personalizacja

Edytuj pliki w `~/.openclaw/workspace/` albo przez dashboard:

```bash
openclaw dashboard
```

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
openclaw doctor     # diagnostyka
openclaw logs       # logi na żywo
openclaw restart    # restart gateway
openclaw dashboard  # panel sterowania w przeglądarce
```

Opis panelu sterowania: [DASHBOARD.md](DASHBOARD.md)

## Czyszczenie (po warsztatach)

Jeśli chcesz usunąć OpenClaw:

```bash
openclaw gateway uninstall    # usuwa daemon
rm -rf ~/.openclaw             # usuwa konfigurację i dane
npm uninstall -g openclaw      # usuwa CLI
```
