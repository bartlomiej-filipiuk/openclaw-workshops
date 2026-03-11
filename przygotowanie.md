# Warsztaty OpenClaw - co przygotować przed piątkiem

Cześć!

W piątek stawiamy wspólnie OpenClaw - otwartoźródłowego, osobistego asystenta AI. Żeby nie tracić czasu na instalacje, proszę przygotujcie kilka rzeczy wcześniej.

---

## 1. Docker

To główny wymóg - OpenClaw uruchamiamy w kontenerze Docker.

| System | Jak zainstalować |
|--------|-----------------|
| **macOS** | [Docker Desktop](https://www.docker.com/products/docker-desktop/) |
| **Windows** | [Docker Desktop](https://www.docker.com/products/docker-desktop/) (wymaga WSL2 - patrz sekcja poniżej) |
| **Linux (Ubuntu)** | `sudo apt install -y docker.io docker-compose-v2` |

Sprawdź po instalacji:
```
docker --version          → Docker version 2x.x.x
docker compose version    → Docker Compose version v2.x.x
```

### Windows - konfiguracja WSL2

Docker Desktop na Windowsie wymaga WSL2. Instalacja jest prosta, ale wymaga kilku kroków:

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
6. Teraz zainstaluj Docker Desktop - automatycznie podepnie się pod WSL2.

**Jak wchodzić do Linuxa?**
- W Windows Terminal (zalecany - zainstaluj ze Store) pojawi się zakładka "Ubuntu"
- Lub wpisz `wsl` w PowerShell
- Lub wpisz `ubuntu` w menu Start

**Najczęstsze problemy:**
- *"Virtualization must be enabled"* → Trzeba włączyć wirtualizację (VT-x / AMD-V) w BIOS-ie laptopa. Sposób zależy od producenta - zazwyczaj sekcja "Security" lub "Advanced" w BIOS.
- *Instalacja wisi na 0%* → Spróbuj: `wsl --install --web-download`
- *Windows 10?* → Wymagany build 19041+ (wersja 2004 lub nowsza). Sprawdź: `winver`

**Ważne:** Wszystkie komendy z warsztatów wpisujcie wewnątrz terminala Ubuntu/WSL, nie w PowerShell.

## 2. Git

Potrzebny do sklonowania repo OpenClaw.

```
git --version   → git version 2.x.x
```

Jeśli nie masz: macOS `xcode-select --install`, Linux `sudo apt install git`.

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

- [ ] Docker zainstalowany (`docker --version` + `docker compose version`)
- [ ] Git zainstalowany (`git --version`)
- [ ] Telegram lub Discord na telefonie/lapku
- [ ] Konto OpenRouter (lub inny provider) + doładowane, ew. subskrypcja ChatGPT.
- [ ] Edytor kodu + terminal

**OpenClaw nie instalujcie** - zrobimy to razem na warsztatach.

Do zobaczenia w piątek!
