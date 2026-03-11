# Prowadzenie warsztatów — notatki dla prowadzącego

---

## Format

Self-service z checkpointami. Uczestnicy idą w swoim tempie wg README. Ty pokazujesz swój ekran jako "live reference" i chodzisz pomagając.

## Timeline (~90 min)

| Czas | Faza | Co robisz | Checkpoint |
|------|------|-----------|------------|
| 0-5 | **Wstęp** | Krótko: co to OpenClaw, po co, co dziś zrobimy. Pokaż link do repo. "Otwórzcie README i lecicie od Kroku 1." | Repo otwarte |
| 5-25 | **Instalacja + onboard** | Na ekranie: swój onboard (albo już gotowy dashboard). Chodź i pomagaj. | `openclaw doctor` zielony |
| 25-40 | **Telegram bot** | Na ekranie: BotFather flow. Zwróć uwagę na parowanie — tu ludzie się gubią. | Bot odpowiada na "cześć" |
| 40-55 | **Personalizacja** | Na ekranie: pokaż swoje Identity.md/Soul.md. "Zróbcie z tego kogo chcecie." | Bot ma imię i charakter |
| 55-80 | **Wolna jazda** | Na ekranie: Twój use case. Wskaż POMYSLY.md. Pomagaj indywidualnie. | Każdy coś robi |
| 80-90 | **Zamknięcie** | Rundka: kto co zrobił? Co ciekawego? Pytania? Linki na potem. | — |

## Co mówić na starcie (5 min)

- "OpenClaw to osobisty asystent AI, open source, stawiamy go na swoim komputerze"
- "Podłączamy go do Telegrama — będziecie gadać z nim z telefonu"
- "Nadacie mu imię, charakter, nauczycie go o sobie"
- "Potem każdy wybierze co chce z nim robić — coach, asystent, researcher..."
- "Wszystko jest w repo — otwórzcie link i lecicie od Kroku 1, ja chodzę i pomagam"

## Typowe problemy i rozwiązania

| Problem | Rozwiązanie |
|---------|------------|
| `node --version` nie działa | Nie zainstalował prereq-ów. Na macOS: `brew install node@22`. Na Linuxie: `nvm install 22`. Na Windows bez WSL — ciężko, niech patrzy na Twoim ekranie. |
| Onboard wisi na wyborze modelu | Prawdopodobnie brak klucza API. Niech sprawdzi czy doładował OpenRouter. |
| Bot nie odpowiada na Telegramie | 1) `openclaw doctor` — czy gateway działa? 2) `openclaw restart` 3) Czy wkleił poprawny token BotFathera? 4) Czy zatwierdził parowanie? |
| Parowanie — nie widzi kodu | `openclaw pairing list` — kod powinien tam być. Jeśli nie: `openclaw logs` i szukaj "pairing". |
| "Nie wiem co wpisać w Identity.md" | Pokaż swój przykład. Zaproponuj: "Napisz 3 zdania kim ma być Twój bot." |
| Ktoś skończył wszystko w 30 min | Niech pomoże sąsiadowi albo zagłębi się w skille: `clawhub search` |

## Twój use case (do przygotowania)

Wybierz temat na swój live demo — coś co pokażesz na ekranie w fazie wolnej jazdy. Propozycje:
- Osobisty coach z cron jobem porannym
- Asystent kodowania robiący review PR z Twojego repo
- Researcher — "zbadaj mi temat X" z Brave Search

Przygotuj to wcześniej żeby na warsztatach po prostu pokazać flow, nie debugować konfigurację.

## Checklist przed warsztatami

- [ ] Repo publiczne na GitHubie, link gotowy
- [ ] Własny OpenClaw postawiony i przetestowany
- [ ] Własny use case przygotowany (Identity.md, Soul.md, skille)
- [ ] Telegram bot działa
- [ ] `przygotowanie.md` wysłany uczestnikom (min. 3 dni wcześniej)
- [ ] Sprawdzone: SETUP.md działa od zera na czystym systemie

## Po warsztatach

- Zostaw repo publiczne — uczestnicy wrócą do materiałów
- Rozważ dodanie sekcji "Co dalej?" z linkami do docs OpenClaw
