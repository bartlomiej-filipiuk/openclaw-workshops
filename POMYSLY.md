# Pomysły na projekty

Wybierz jeden i leć. Każdy ma wskazówki jak zacząć.

---

## Osobisty coach / motywator

Agent, który Cię wspiera, motywuje i przypomina o celach.

**Jak zacząć:**

1. Edytuj `Identity.md` — nadaj mu rolę coacha, np.:
   ```
   Jestem Twoim osobistym coachem. Pomagam Ci utrzymać focus,
   motywuję gdy brakuje energii, rozliczam z celów.
   ```
2. Edytuj `Soul.md` — dodaj zasady, np. "Bądź bezpośredni, nie słodzij"
3. Edytuj `User.md` — napisz nad czym pracujesz, jakie masz cele
4. Dodaj poranny cron job z motywacją:
   ```bash
   openclaw cron add --name "poranna-motywacja" \
     --schedule "0 7 * * *" \
     --prompt "Wyślij mi krótką poranną motywację nawiązującą do moich celów"
   ```

**Poziom:** łatwy

---

## Asystent do pracy

Agent, który pomaga w codziennych zadaniach — podsumowania, drafty, burze mózgów.

**Jak zacząć:**

1. Edytuj `User.md` — opisz czym się zajmujesz, jaki masz kontekst pracy
2. Edytuj `Identity.md` — nadaj rolę, np. "Jesteś moim asystentem w pracy. Pomagasz pisać maile, podsumowywać notatki, przygotowywać się do spotkań."
3. Przetestuj na Telegramie:
   - "Pomóż mi napisać maila do klienta o opóźnieniu projektu"
   - "Podsumuj te notatki ze spotkania: [wklej notatki]"
   - "Przygotuj agendę na spotkanie o X"

**Poziom:** łatwy

---

## Researcher tematów

Agent, który wyszukuje i podsumowuje informacje z internetu.

**Jak zacząć:**

1. Włącz wyszukiwanie — potrzebujesz klucza Brave Search API:
   - Zarejestruj się na https://brave.com/search/api/ (darmowy tier: 2000 zapytań/mies.)
   - Zainstaluj skill:
     ```bash
     clawhub install brave-search
     ```
   - Podaj klucz API gdy zapyta
2. Przetestuj:
   - "Zbadaj mi temat: [cokolwiek Cię interesuje]"
   - "Znajdź najnowsze informacje o X i podsumuj w 5 punktach"
   - "Porównaj X vs Y — plusy i minusy"

**Poziom:** średni (wymaga klucza Brave API)

---

## Asystent kodowania / PR reviewer

Agent, który pomaga z kodem — review pull requestów, wyjaśnianie błędów, sugestie.

**Jak zacząć:**

1. Edytuj `Identity.md` — nadaj rolę code reviewera
2. Edytuj `User.md` — opisz swój stack technologiczny, konwencje
3. Przetestuj na Telegramie:
   - Wklej kawałek kodu i zapytaj "co tu jest nie tak?"
   - "Zrób review tego kodu: [wklej]"
   - Wyślij link do PR na GitHubie i poproś o review
4. Opcjonalnie zainstaluj dodatkowe skille:
   ```bash
   clawhub search code    # zobacz dostępne skille
   ```

**Poziom:** średni

---

## Nie wiesz co wybrać?

Zacznij od **asystenta do pracy** — jest najprostszy i od razu przydatny. Zawsze możesz zmienić kierunek edytując pliki w `~/.openclaw/workspace/`.
