# Study Progress Setup

## Supabase values

Create a local `.env` file with:

```env
PUBLIC_SUPABASE_URL=https://lsaizjxojkrqkdrirpvx.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_IG_RH8U8Hbb7-5UVtXJvGQ_nzGBdU61
PUBLIC_STUDY_OWNER_EMAIL=baiseliuxing@126.com
```

`PUBLIC_SUPABASE_PUBLISHABLE_KEY` is safe to use in the browser when Row Level
Security is enabled. Do not put Supabase secret keys in this project.

## Supabase user

In Supabase, create one Authentication user with the same email as
`PUBLIC_STUDY_OWNER_EMAIL`. The password is the password you enter on the
`/studyProgress/` page.

## First verification

1. Run `pnpm dev`.
2. Open `/studyProgress/`.
3. Enter the Supabase user's password.
4. Save one article progress value.
5. Refresh the page or open it on another device and confirm the value loads.
