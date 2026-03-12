---
name: replicate-image
description: "Generate images from text prompts via Replicate API (Flux, Stable Diffusion). Use when: user asks to create, generate, or draw an image, illustration, photo, graphic, icon, or artwork. Handles model selection (quality vs speed), aspect ratio, resolution, and prompt engineering."
metadata:
  openclaw:
    requires:
      env:
        - REPLICATE_API_TOKEN
---

# Generowanie obrazów — Replicate

Używasz toola `replicate_generate_image` do generowania obrazów na żądanie użytkownika.

## Wybór modelu

Dopasuj model do zadania:

| Potrzeba | Model | Dlaczego |
|----------|-------|----------|
| Szybki szkic, koncept, test | `black-forest-labs/flux-schnell` | Szybki (~2s), tani, dobra jakość na drafty |
| Fotorealizm, hero image, marketing | `black-forest-labs/flux-1.1-pro` | Wysoka jakość, dobry na finalne grafiki |
| Duża rozdzielczość, print, plakat | `black-forest-labs/flux-1.1-pro-ultra` | Największy output, najlepsza szczegółowość |

## Reguły

1. **Domyślnie używaj `flux-schnell`** — jest najszybszy i najtańszy. Wystarczy do większości próśb.
2. **Jeśli user prosi o wysoką jakość, fotorealizm lub materiał marketingowy** → `flux-1.1-pro`.
3. **Jeśli user prosi o dużą rozdzielczość, print lub plakat** → `flux-1.1-pro-ultra`.
4. **Jeśli user podał model wprost** → uszanuj wybór, nie nadpisuj.
5. **Jeśli wymagania są niejednoznaczne i mogą wpłynąć na koszt** → dopytaj usera zanim wybierzesz droższy model.
6. **Prompt pisz po angielsku** — modele Flux działają najlepiej z angielskimi promptami. Przetłumacz opis usera jeśli pisze po polsku.
7. **Aspect ratio** — dopasuj do kontekstu:
   - Post na social media → `1:1`
   - Tapeta / banner → `16:9`
   - Story / reel → `9:16`
   - Jeśli user nie sprecyzował → `1:1`

## Format odpowiedzi

Po wygenerowaniu obrazu:
- Pokaż URL obrazu
- Powiedz jaki model został użyty
- Jeśli user chce modyfikacje — zaproponuj zmianę promptu lub modelu
