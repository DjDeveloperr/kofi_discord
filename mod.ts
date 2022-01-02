import { serve } from "https://deno.land/std@0.119.0/http/server.ts";

const DISCORD_WEBHOOK = Deno.env.get("DISCORD_WEBHOOK");
if (DISCORD_WEBHOOK === undefined) {
  throw new Error(
    "You need to set DISCORD_WEBHOOK environment variable to Webhook URL.",
  );
}

const KOFI_TOKEN = Deno.env.get("KOFI_TOKEN");
if (KOFI_TOKEN === undefined) {
  throw new Error(
    "You need to set the KOFI_TOKEN environment variable to your Ko-fi webhook verification token.",
  );
}

async function callWebhook(data: Record<string, any>) {
  await fetch(DISCORD_WEBHOOK!, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(Object.assign({
      username: "Ko-fi",
      // Ko-fi Discord Bot avatar URL
      avatar_url:
        "https://cdn.discordapp.com/avatars/836232765942923305/1f6fbc8561728c4de6f0f68a2a943dd6.png",
    }, data)),
  });
}

type KofiEventType = "Donation" | "Subscription" | "Commission" | "Shop Order";

interface KofiShopItem {
  direct_link_code: string;
}

interface KofiEvent {
  timestamp: string;
  type: KofiEventType;
  is_public: boolean;
  from_name: string;
  message: string;
  amount: string;
  url: string;
  email: string;
  currency: string;
  is_subscription_payment: boolean;
  is_first_subscription_payment: boolean;
  kofi_transaction_id: string;
  verification_token: string;
  shop_items: KofiShopItem[] | null;
  tier_name: string | null;
}

console.log("Listening on http://localhost:8000");
serve(async (req) => {
  const { pathname: path } = new URL(req.url);

  switch (path) {
    case "/": {
      return new Response("https://github.com/DjDeveloperr/kofi_discord");
    }

    case "/webhook": {
      try {
        const form = await req.formData();
        const data: KofiEvent = JSON.parse(form.get("data")!.toString());

        if (data.verification_token !== KOFI_TOKEN) {
          console.log(
            `[INFO] Someone made unauthorized request! ${
              JSON.stringify(data, null, 2)
            }`,
          );
          return new Response("Unauthorized");
        }

        await callWebhook({
          content: JSON.stringify(data),
        });

        console.log("[INFO] Delivered hook!");
        return new Response("Delivered!");
      } catch (e) {
        return new Response("400 Bad Request", { status: 400 });
      }
    }

    default: {
      return new Response("404 Not Found", { status: 404 });
    }
  }
});
