# Warsztaty OpenClaw - co przygotować przed piątkiem

Cześć!

W piątek stawiamy wspólnie OpenClaw - otwartoźródłowego, osobistego asystenta AI. Żeby nie tracić czasu na instalacje, proszę przygotujcie kilka rzeczy wcześniej.

---

## 1. Node.js (wersja 22 lub nowsza)

To jedyny twardy wymóg - OpenClaw instaluje się przez npm.

| System | Jak zainstalować |
|--------|-----------------|
| **macOS** | `brew install node@22` lub przez [nvm](https://github.com/nvm-sh/nvm) |
| **Linux (Ubuntu)** | `nvm install 22` lub [NodeSource](https://deb.nodesource.com/setup_22.x) |
| **Windows** | WSL2 + Ubuntu (potem jak Linux) - patrz sekcja poniżej |

### Windows - konfiguracja WSL2

WSL2 daje pełne środowisko Linux wewnątrz Windowsa. Instalacja jest prosta, ale wymaga kilku kroków:

1. Otwórz **PowerShell jako Administrator** (prawy klik → "Uruchom jako administrator")
2. Wpisz:
   ```powershell
   wsl --install
   ```
3. **Zrestartuj komputer** (wymagane!)
4. Po restarcie automatycznie otworzy się okno Ubuntu - ustaw nazwę użytkownika i hasło
5. Sprawdź, czy działa:
   ```powershell
   wsl --list --verbose
   ```
   Powinno pokazać Ubuntu z wersją 2.

**Jak wchodzić do Linuxa?**
- W Windows Terminal (zalecany - zainstaluj ze Store) pojawi się zakładka "Ubuntu"
- Lub wpisz `wsl` w PowerShell
- Lub wpisz `ubuntu` w menu Start

**Najczęstsze problemy:**
- *"Virtualization must be enabled"* → Trzeba włączyć wirtualizację (VT-x / AMD-V) w BIOS-ie laptopa. Sposób zależy od producenta - zazwyczaj sekcja "Security" lub "Advanced" w BIOS.
- *Instalacja wisi na 0%* → Spróbuj: `wsl --install --web-download`
- *Windows 10?* → Wymagany build 19041+ (wersja 2004 lub nowsza). Sprawdź: `winver`

**Ważne:** Wszystkie komendy z warsztatów (node, npm, openclaw) wpisujcie wewnątrz terminala Ubuntu/WSL, nie w PowerShell.

Sprawdź po instalacji Node.js:
```
node --version   → v22.x.x lub wyżej
```

## 2. Docker (opcjonalnie)

Pokażemy też wariant z Dockerem - jeśli chcesz go wypróbować:
- **macOS / Windows** - [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- **Linux** - `sudo apt install -y docker.io docker-compose-v2`

Nie jest wymagany - wariant npm wystarczy.

## 3. Komunikator: Telegram lub Discord

Podłączymy asystenta do komunikatora - będziecie mogli z nim gadać z telefonu.

- **Telegram** (rekomendowany) - zainstaluj aplikację + załóż konto, jeśli nie masz
- **Discord** - jeśli wolisz Discorda, to też się da, konfiguracja jest równie prosta

Wystarczy jeden z nich.

## 4. Konto u dostawcy modeli AI

OpenClaw potrzebuje klucza API do modelu językowego. Najprostsze opcje:

- **OpenRouter** (https://openrouter.ai) - jedno konto, dostęp do wielu modeli. Doładuj min. ~$5
- **Subskrypcja ChatGPT** - jeśli masz płatny plan (Plus/Pro/Team), możesz wygenerować klucz API do Codex i użyć go w OpenClaw bez dodatkowych kosztów
- Alternatywnie: klucz API **Anthropic** (Claude) lub **OpenAI**

## 5. Edytor kodu + terminal

- VS Code lub dowolny inny
- Terminal systemowy wystarczy

## 6. Bonus: agent AI pod ręką

Nie wymagany, ale bardzo przydatny na warsztatach do konfiguracji i debugowania - np. Claude Code, Codex, Cursor, Windsurf itp.

---

## Checklista

Odhaczyj przed piątkiem:

- [ ] Node.js >= 22 zainstalowany (`node --version`)
- [ ] Docker zainstalowany (opcjonalnie)
- [ ] Telegram lub Discord na telefonie/lapku
- [ ] Konto OpenRouter (lub inny provider) + doładowane, ew. subskrypcja ChatGPT.
- [ ] Edytor kodu + terminal

**OpenClaw nie instalujcie** - zrobimy to razem na warsztatach.

Do zobaczenia w piątek!
