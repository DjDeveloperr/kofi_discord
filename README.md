# kofi_discord

Simple web server to forward Ko-fi webhook events to Discord Webhooks.

Note: not meant for publicily logging Ko-fi events. If you want to do that,
you might want to consider forking to hide some info.

## Deploy

[Deploy to Deno Deploy!](https://dash.deno.com/new?url=https://raw.githubusercontent.com/DjDeveloperr/kofi_discord/main/mod.ts&env=DISCORD_WEBHOOK,KOFI_TOKEN)

## Environment Variables

- `DISCORD_WEBHOOK`: Your Discord Webhook URL.
- `KOFI_TOKEN`: Ko-fi Verification Token. Used to verify event is sent by Ko-fi.
- `DEBUG`: (Optional) set to `1` to allow Ko-fi test webhook.

## License

[Apache-2.0 License](./LICENSE)

Copyright 2021 @ DjDeveloperr
