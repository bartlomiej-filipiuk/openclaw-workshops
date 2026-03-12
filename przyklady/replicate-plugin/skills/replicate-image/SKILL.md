---
name: replicate-image
description: "Generate images from text prompts via Replicate API (Flux, Stable Diffusion). Use when: user asks to create, generate, or draw an image, illustration, photo, graphic, icon, or artwork. Handles model selection (quality vs speed), aspect ratio, resolution, and prompt engineering."
metadata:
  openclaw:
    requires:
      env:
        - REPLICATE_API_TOKEN
---

# Image Generation — Replicate

Use the `replicate_generate_image` tool to generate images on user request.

## Model Selection

Match the model to the task:

| Need | Model | Why |
|------|-------|-----|
| Quick sketch, concept, test | `black-forest-labs/flux-schnell` | Fast (~2s), cheap, good quality for drafts |
| Photorealism, hero image, marketing | `black-forest-labs/flux-1.1-pro` | High quality, good for final graphics |
| High resolution, print, poster | `black-forest-labs/flux-1.1-pro-ultra` | Largest output, best detail |

## Rules

1. **Default to `flux-schnell`** — fastest and cheapest. Sufficient for most requests.
2. **If user asks for high quality, photorealism, or marketing material** → `flux-1.1-pro`.
3. **If user asks for high resolution, print, or poster** → `flux-1.1-pro-ultra`.
4. **If user specified a model explicitly** → respect their choice, do not override.
5. **If requirements are ambiguous and may affect cost** → ask the user before choosing a more expensive model.
6. **Write prompts in English** — Flux models work best with English prompts. Translate the user's description if they write in another language.
7. **Aspect ratio** — match to context:
   - Social media post → `1:1`
   - Wallpaper / banner → `16:9`
   - Story / reel → `9:16`
   - If user didn't specify → `1:1`

## Response Format

After generating an image:
- Show the image URL
- State which model was used
- If the user wants modifications — suggest changing the prompt or model
