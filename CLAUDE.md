# Workshop MVP Starter

## Stack
- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS v4
- **Database + Auth**: Supabase (client in `src/lib/supabase.ts`)
- **Deploy**: Vercel (free tier)

## Commands
- `npm run dev` — start dev server on localhost:3000
- `npm run build` — production build
- `vercel --prod` — deploy to production

## Project Structure
```
src/
  app/          — pages and layouts (App Router)
  lib/          — utilities (supabase client is here)
  components/   — reusable UI components (create as needed)
```

## Rules
- Use the Supabase client from `src/lib/supabase.ts` for all database and auth operations
- Use server components by default. Only add `'use client'` when you need interactivity (forms, state, effects)
- Use Tailwind CSS utility classes for all styling. No CSS modules or inline styles
- Keep components small and focused. One component per file
- Put new pages in `src/app/` following Next.js App Router conventions
- Put reusable components in `src/components/`
- Environment variables are already configured — don't modify `.env.local`

## Supabase Quick Reference
```typescript
import { supabase } from '@/lib/supabase'

// Read data
const { data, error } = await supabase.from('table_name').select('*')

// Insert data
const { data, error } = await supabase.from('table_name').insert({ column: 'value' })

// Auth - sign up
const { data, error } = await supabase.auth.signUp({ email, password })

// Auth - sign in
const { data, error } = await supabase.auth.signInWithPassword({ email, password })

// Auth - get current user
const { data: { user } } = await supabase.auth.getUser()

// Auth - sign out
await supabase.auth.signOut()
```
