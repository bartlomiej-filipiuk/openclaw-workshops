import { Type } from "@sinclair/typebox";
import type { OpenClawPluginAPI } from "openclaw/plugin";

const REPLICATE_API = "https://api.replicate.com/v1";
const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 90; // 3 minuty przy 2s interwale

export default function register(api: OpenClawPluginAPI) {
  api.registerTool({
    name: "replicate_generate_image",
    description:
      "Generuje obraz na podstawie opisu tekstowego (prompt) używając modeli Replicate (Flux, Stable Diffusion i inne).",
    parameters: Type.Object({
      prompt: Type.String({
        description: "Opis obrazu do wygenerowania (po angielsku dla najlepszych wyników)",
      }),
      model: Type.Optional(
        Type.String({
          description:
            'ID modelu Replicate, np. "black-forest-labs/flux-schnell". Jeśli nie podano, skill wybierze model.',
          default: "black-forest-labs/flux-schnell",
        })
      ),
      aspect_ratio: Type.Optional(
        Type.String({
          description: 'Proporcje obrazu, np. "1:1", "16:9", "9:16", "4:3"',
          default: "1:1",
        })
      ),
      output_format: Type.Optional(
        Type.String({
          description: 'Format wyjściowy: "webp", "png", "jpg"',
          default: "webp",
        })
      ),
    }),

    async execute({ prompt, model, aspect_ratio, output_format }, context) {
      // 1. Pobierz token z konfiguracji pluginu
      const apiToken =
        context.pluginConfig?.apiToken || process.env.REPLICATE_API_TOKEN;

      if (!apiToken) {
        return {
          error:
            "Brak tokenu Replicate API. Ustaw REPLICATE_API_TOKEN w zmiennych środowiskowych " +
            "lub skonfiguruj apiToken w ustawieniach pluginu (openclaw.json → plugins.entries.replicate.config.apiToken).",
        };
      }

      const selectedModel = model || "black-forest-labs/flux-schnell";

      // Walidacja formatu modelu (owner/name)
      const parts = String(selectedModel).split("/");
      if (parts.length !== 2 || !parts[0] || !parts[1]) {
        return {
          error: `Nieprawidłowy model: "${selectedModel}". Oczekiwano formatu "owner/name", np. "black-forest-labs/flux-schnell".`,
        };
      }
      const [owner, name] = parts;

      // 2. Utwórz prediction (model-specific endpoint)
      const createResponse = await fetch(
        `${REPLICATE_API}/models/${owner}/${name}/predictions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: {
              prompt,
              aspect_ratio: aspect_ratio || "1:1",
              output_format: output_format || "webp",
            },
          }),
        },
      );

      if (!createResponse.ok) {
        let errorText = await createResponse.text();
        try {
          const parsed = JSON.parse(errorText);
          errorText = parsed.detail || parsed.error || errorText;
        } catch {}
        return {
          error: `Replicate API error (${createResponse.status}): ${errorText}`,
        };
      }

      const prediction = (await createResponse.json()) as {
        id: string;
        status: string;
        output?: string | string[];
        error?: string;
        urls: { get: string };
      };

      // 3. Polling — czekaj na wynik
      let current = prediction;
      let attempts = 0;

      while (
        current.status !== "succeeded" &&
        current.status !== "failed" &&
        current.status !== "canceled" &&
        attempts < MAX_POLL_ATTEMPTS
      ) {
        await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
        attempts++;

        const pollResponse = await fetch(current.urls.get, {
          headers: { Authorization: `Bearer ${apiToken}` },
        });

        if (!pollResponse.ok) {
          return {
            error: `Polling error (${pollResponse.status}): ${await pollResponse.text()}`,
          };
        }

        current = (await pollResponse.json()) as typeof prediction;
      }

      // 4. Obsługa wyniku
      if (current.status === "failed") {
        return {
          error: `Generowanie nie powiodło się: ${current.error || "nieznany błąd"}`,
        };
      }

      if (current.status === "canceled") {
        return { error: "Generowanie zostało anulowane." };
      }

      if (attempts >= MAX_POLL_ATTEMPTS && current.status !== "succeeded") {
        return {
          error: `Timeout — generowanie trwa dłużej niż ${(MAX_POLL_ATTEMPTS * POLL_INTERVAL_MS) / 1000}s. Prediction ID: ${current.id}`,
        };
      }

      // output może być stringiem (URL) lub tablicą URLi
      const outputUrl = Array.isArray(current.output)
        ? current.output[0]
        : current.output;

      return {
        imageUrl: outputUrl,
        model: selectedModel,
        predictionId: current.id,
      };
    },
  });
}
