import { Type } from "@sinclair/typebox";
import type { OpenClawPluginAPI } from "openclaw/plugin";

const REPLICATE_API = "https://api.replicate.com/v1";
const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 90; // 3 minutes at 2s interval

export default function register(api: OpenClawPluginAPI) {
  api.registerTool({
    name: "replicate_generate_image",
    description:
      "Generate an image from a text prompt using Replicate models (Flux, Stable Diffusion, etc.).",
    parameters: Type.Object({
      prompt: Type.String({
        description: "Text description of the image to generate (English works best)",
      }),
      model: Type.Optional(
        Type.String({
          description:
            'Replicate model ID, e.g. "black-forest-labs/flux-schnell". If omitted, the skill selects the model.',
          default: "black-forest-labs/flux-schnell",
        })
      ),
      aspect_ratio: Type.Optional(
        Type.String({
          description: 'Image aspect ratio, e.g. "1:1", "16:9", "9:16", "4:3"',
          default: "1:1",
        })
      ),
      output_format: Type.Optional(
        Type.String({
          description: 'Output format: "webp", "png", "jpg"',
          default: "webp",
        })
      ),
    }),

    async execute({ prompt, model, aspect_ratio, output_format }, context) {
      // 1. Get API token from plugin config or environment
      const apiToken =
        context.pluginConfig?.apiToken || process.env.REPLICATE_API_TOKEN;

      if (!apiToken) {
        return {
          error:
            "Missing Replicate API token. Set REPLICATE_API_TOKEN environment variable " +
            "or configure apiToken in plugin settings (openclaw.json → plugins.entries.replicate.config.apiToken).",
        };
      }

      const selectedModel = model || "black-forest-labs/flux-schnell";

      // Validate model format (owner/name)
      const parts = String(selectedModel).split("/");
      if (parts.length !== 2 || !parts[0] || !parts[1]) {
        return {
          error: `Invalid model: "${selectedModel}". Expected format "owner/name", e.g. "black-forest-labs/flux-schnell".`,
        };
      }
      const [owner, name] = parts;

      // 2. Create prediction (model-specific endpoint)
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

      // 3. Poll for result
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

      // 4. Handle result
      if (current.status === "failed") {
        return {
          error: `Generation failed: ${current.error || "unknown error"}`,
        };
      }

      if (current.status === "canceled") {
        return { error: "Generation was canceled." };
      }

      if (attempts >= MAX_POLL_ATTEMPTS && current.status !== "succeeded") {
        return {
          error: `Timeout — generation took longer than ${(MAX_POLL_ATTEMPTS * POLL_INTERVAL_MS) / 1000}s. Prediction ID: ${current.id}`,
        };
      }

      // output can be a string (URL) or an array of URLs
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
