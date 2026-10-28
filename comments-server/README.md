# Vizune Reviews comments server (Remark42 on Fly.io)

Visitors comment with just a name. You log in with GitHub to moderate.
Expected cost: about $2.35/month at most (256 MB machine + 1 GB storage),
less when the machine sleeps.

## 1. Create a Fly.io account

Sign up at https://fly.io and add a card (needed after the short free trial).

Install the Fly command-line tool on Windows (PowerShell):

    pwsh -Command "iwr https://fly.io/install.ps1 -useb | iex"

Then log in:

    fly auth login

## 2. Create the app and its storage

From this `comments-server` folder:

    fly apps create vizune-comments
    fly volumes create remark42_data --region lhr --size 1

If the app name is taken, pick another and update `app` and `REMARK_URL`
in fly.toml.

## 3. Create a GitHub login for yourself (admin only)

On GitHub: Settings → Developer settings → OAuth Apps → New OAuth App.

- Homepage URL: `https://vizune-comments.fly.dev`
- Authorization callback URL: `https://vizune-comments.fly.dev/auth/github/callback`

Copy the Client ID and generate a Client Secret.

## 4. Add the secrets

Replace the placeholders. SECRET can be any long random string.

    fly secrets set SECRET="a-long-random-string" AUTH_GITHUB_CID="your-client-id" AUTH_GITHUB_CSEC="your-client-secret"

## 5. Deploy

    fly deploy

Check it's alive: open https://vizune-comments.fly.dev/web/ in a browser.

## 6. Make yourself the admin

1. On a review page, log in to the comments with GitHub.
2. Click your name in the comments widget and copy your user ID
   (it looks like `github_1a2b3c...`).
3. Run:

       fly secrets set ADMIN_SHARED_ID="github_1a2b3c..."

   This redeploys automatically. You can now delete comments and block users.

## 7. Connect the site

In the site's `.env` (and wherever you build for Nekoweb):

    PUBLIC_REMARK42_HOST=https://vizune-comments.fly.dev
    PUBLIC_SITE_URL=https://vizune.nekoweb.org

Rebuild and upload the site. The "coming soon" message is replaced by comments.

## Backups

Remark42 saves a daily backup on the server (last 7 days). To download your
own copy at any time:

    fly ssh sftp shell
    get /srv/var/backup/<latest file>

## Optional: use comments.vizune.net

    fly certs add comments.vizune.net

Add the DNS record Fly shows you, then change `REMARK_URL` in fly.toml,
the GitHub OAuth URLs, and `PUBLIC_REMARK42_HOST` to the new address.
