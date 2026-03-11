# Dashboard OpenClaw

Panel sterowania dostępny pod `http://127.0.0.1:18789/` — uruchom komendą `openclaw dashboard`.

---

## Chat

- **Chat** (`/chat`) — bezpośrednia rozmowa z agentem przez przeglądarkę. Przydatne do szybkiego testowania bez podpinania kanałów.

## Control

- **Overview** (`/overview`) — status gateway: URL WebSocket, token, uptime, health check. Pierwszy widok po uruchomieniu — sprawdź czy wszystko działa.
- **Channels** (`/channels`) — zarządzanie kanałami (WhatsApp, Telegram, Discord i inne). Status połączeń, konfiguracja, QR code do parowania.
- **Instances** (`/instances`) — podłączone urządzenia i klienty aktywne w ostatnich 5 minutach. Sprawdź tu, czy Twoje urządzenie jest widoczne.
- **Sessions** (`/sessions`) — aktywne sesje rozmów z filtrowaniem i historią. Przydatne do debugowania konkretnych konwersacji.
- **Usage** (`/usage`) — zużycie API: koszty, tokeny per model i kanał. Monitoruj budżet i sprawdzaj, który kanał generuje ruch.
- **Cron Jobs** (`/cron`) — zaplanowane zadania cykliczne agenta. Definiuj harmonogramy automatycznych akcji.

## Agent

- **Agents** (`/agents`) — workspace agenta: narzędzia, tożsamość, konfiguracja zachowania. Tu definiujesz kim jest Twój agent.
- **Skills** (`/skills`) — rozszerzenia agenta (włącz/wyłącz, klucze API). Zarządzaj umiejętnościami bez edycji plików.
- **Nodes** (`/nodes`) — sparowane urządzenia i ich uprawnienia do narzędzi. Kontroluj co każde urządzenie może robić.

## Settings

- **Config** (`/config`) — edytor `openclaw.json` w trybie Form lub Raw JSON. Wygodniejszy niż ręczna edycja pliku.
- **Debug** (`/debug`) — snapshoty gateway, logi eventów, ręczne wywołania RPC. Niezbędne przy rozwiązywaniu problemów.
- **Logs** (`/logs`) — logi na żywo z filtrowaniem po poziomie (info, warn, error). Podgląd co agent robi w czasie rzeczywistym.

---

> **Tip:** Aby podłączyć token gateway, użyj `openclaw gateway --token TWÓJ_TOKEN` lub ustaw go w **Config** → sekcja Gateway.
