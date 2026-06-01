# Study Progress Schema

This folder documents where the Supabase table references for `studyProgress`
live.

The real database lives in Supabase. The executable SQL setup script is:

```txt
docs/studyProgress/supabase-schema.sql
```

The Prisma-like schema reference (for reading only) is outside `src` so
Astro/Vite will not try to bundle it:

```txt
docs/studyProgress/schema.prisma
```

We are not actually using Prisma in this project.
