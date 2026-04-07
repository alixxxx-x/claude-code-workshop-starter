# Claude Code Workshop — Build & Deploy an MVP in 2 Hours

Welcome! In this workshop, you'll use **Claude Code** (an AI coding assistant that lives in your terminal) to build and deploy a real web application from scratch.

No prior AI coding experience needed. If you can type in a terminal, you're good.

## What You're Working With

| Tool | What it does |
|------|-------------|
| **Claude Code** | AI assistant in your terminal — you describe what you want, it writes the code |
| **Next.js** | React framework for building web apps |
| **Tailwind CSS** | Utility-first CSS — style things with class names instead of writing CSS |
| **Supabase** | Your database + user authentication (like Firebase, but open source) |
| **Vercel** | Deploys your app to a live URL with one command |

You don't need to know any of these tools. Claude Code does. Just tell it what you want.

---

## Setup (5 minutes)

### Step 1: Clone this repo

```bash
git clone https://github.com/Betterfit-ca/claude-code-workshop-starter.git
cd claude-code-workshop-starter
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Set up your environment

Copy the example env file and fill in your team's Supabase credentials (provided by your workshop leader):

```bash
cp .env.example .env.local
```

Open `.env.local` and paste in your Supabase URL and key.

### Step 4: Set your API key

Your workshop leader will give you a Claude API key. Set it in your terminal:

```bash
export ANTHROPIC_API_KEY='sk-ant-your-key-here'
```

### Step 5: Verify everything works

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see "Your MVP starts here."

---

## How to Use Claude Code

### Starting it

Open a **new terminal tab** (keep the dev server running in the other one), navigate to the project folder, and type:

```bash
claude
```

That's it. You're now talking to Claude Code.

### Talking to it

Just describe what you want in plain English. Be specific. Here are some examples:

**Good prompts (specific):**
- "Add a signup and login page using Supabase Auth with email and password"
- "Create a dashboard page that shows a list of items from a Supabase table called 'tasks'"
- "Add a form to create new tasks with a title and description"
- "Make the navbar sticky and add a logout button"

**Bad prompts (too vague):**
- "Make it look better"
- "Add some features"
- "Build me an app"

### Key commands

| Command | What it does |
|---------|-------------|
| `/clear` | Clears conversation history. Use between unrelated features to save tokens. |
| `/cost` | Shows how much you've spent so far |
| `Ctrl+C` | Cancel the current operation |
| `exit` | Leave Claude Code |

### The golden rule

**One feature at a time.** Don't ask for everything at once.

Instead of: *"Build me a full task manager with auth, CRUD, and a dashboard"*

Do this:
1. "Add a signup and login page with Supabase Auth"
2. `/clear`
3. "Create a tasks table in the app and a page to list all tasks"
4. `/clear`
5. "Add a form to create new tasks"
6. `/clear`
7. "Add the ability to mark tasks as complete"

This gives you better results and uses fewer tokens.

---

## Building Your MVP — Suggested Flow

You have 2 hours. Here's a plan that works:

### Phase 1: Auth (20 min)
Ask Claude Code to add signup and login pages using Supabase Auth. This gives your app real users.

> "Add a signup page and a login page using Supabase Auth with email and password. After login, redirect to /dashboard. Add a layout with a simple navbar that shows a logout button when logged in."

### Phase 2: Core Feature (40 min)
This is your app's main thing. A task list, a blog, a booking system, a notes app — whatever your team picked.

> "Create a 'tasks' table in Supabase with columns: id (uuid), title (text), description (text), completed (boolean), user_id (uuid), created_at (timestamp). Then build a /dashboard page that lists the current user's tasks and a form to add new ones."

### Phase 3: Make It Useful (30 min)
Add the features that make it feel like a real app.

> "Add the ability to click a task to mark it as complete. Completed tasks should appear with a strikethrough and move to the bottom of the list."

### Phase 4: Make It Pretty (20 min)
> "Improve the design of the dashboard. Make it clean and modern using Tailwind. Add some spacing, better typography, and subtle hover effects on the task cards."

### Phase 5: Deploy (10 min)

```bash
npm run build        # Make sure it builds without errors
npx vercel --prod    # Deploy to the internet
```

Follow the prompts. Your app is now live with a real URL.

---

## Supabase Tips

### Creating a table

You can ask Claude Code to write the SQL, but you'll run it in the Supabase dashboard:

1. Go to your Supabase project dashboard
2. Click **SQL Editor** in the sidebar
3. Paste the SQL that Claude Code generates
4. Click **Run**

### Enabling Row Level Security (RLS)

If Claude Code sets up RLS policies (it probably will), make sure to enable RLS on your table:

1. Go to **Table Editor** in Supabase
2. Click your table
3. Click **RLS** and toggle it on
4. Add the policies Claude Code wrote

---

## Troubleshooting

**"Module not found" errors**
```bash
npm install
```

**Page shows nothing / white screen**
- Check your terminal for errors
- Make sure `.env.local` has the correct Supabase URL and key
- Restart the dev server: `Ctrl+C` then `npm run dev`

**Supabase queries return empty data**
- Did you create the table? Check the Supabase dashboard
- Did you enable RLS? If yes, did you add the right policies?
- Check that `.env.local` has the correct project URL

**Claude Code seems slow or stops**
- You might be hitting rate limits — wait 30 seconds and try again
- Use `/clear` to reduce context size
- Try shorter, more specific prompts

**Build fails before deploy**
- Ask Claude Code: "The build is failing with this error: [paste error]. Fix it."
- It's really good at fixing its own mistakes

---

## What You Can Build — Ideas

Not sure what to build? Here are some MVPs that are very doable in 2 hours:

- **Task Manager** — Create, complete, and delete tasks. Filter by status.
- **Notes App** — Markdown notes with categories/tags.
- **Expense Tracker** — Log expenses, see totals by category.
- **Bookmarks Manager** — Save and organize links with tags.
- **Simple Blog** — Write and publish posts. Public reading page.
- **Habit Tracker** — Track daily habits with streaks.
- **Poll/Voting App** — Create polls, share links, see results live.

Pick one, keep it simple, and ship it.

---

## After the Workshop

This repo is yours. Keep building. Here are some things to explore:

- **Supabase Realtime** — Make your app update live when data changes
- **Supabase Storage** — Add file/image uploads
- **Vercel Domains** — Connect a custom domain to your app
- **Claude Code** — Available at [claude.ai/download](https://claude.ai/download)

---

Built with [Claude Code](https://claude.ai/download) at a [BetterFit](https://betterfit.tech) workshop.
