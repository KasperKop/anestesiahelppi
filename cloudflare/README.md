# Cloudflare chat service

Workers Builds settings for the initial deployment:

- Repository: `KasperKop/anestesiahelppi`
- Production branch: `feat/cloudflare-chat`
- Root directory: `cloudflare`
- Build command: `npm ci`
- Deploy command: `npm run deploy`
- Builds for non-production branches: disabled

After saving the Git connection and branch settings, a new commit pushed to the production branch triggers a build. Check the branch shown on the new build before troubleshooting its root directory.

The `/health` endpoint must return `{"status":"ok","chatEnabled":false}` for the initial inactive deployment. `Hello world` means the default Worker is still deployed.

Keep `CHAT_ENABLED=false` until the reviewed corpus and live evaluation are ready. Add `GROQ_API_KEY` only as a Worker runtime secret, never as source code or a public frontend variable.

See [deployment instructions](../docs/cloudflare-deployment.md) for activation and verification.
