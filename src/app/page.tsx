export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Your MVP starts here.
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          This is your blank canvas. Tell Claude Code what you want to build and
          watch it come to life.
        </p>
        <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-left space-y-3">
          <p className="font-semibold text-sm text-gray-500 uppercase tracking-wide">
            Try asking Claude Code:
          </p>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li>&quot;Build me a todo app with authentication&quot;</li>
            <li>&quot;Create a dashboard that shows data from Supabase&quot;</li>
            <li>&quot;Add a signup/login page using Supabase Auth&quot;</li>
          </ul>
        </div>
        <p className="text-sm text-gray-400">
          Next.js + Tailwind CSS + Supabase &mdash; ready to go.
        </p>
      </div>
    </main>
  );
}
