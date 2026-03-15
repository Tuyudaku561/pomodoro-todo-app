import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b bg-white px-6 py-4 shadow-sm dark:border-zinc-800 dark:bg-black">
      <nav className="mx-auto flex max-w-4xl items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600 dark:text-blue-400">
          Pomodoro App
        </Link>
        <div className="flex gap-6">
          <Link
            href="/timer"
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-blue-400"
          >
            Timer
          </Link>
          <Link
            href="/task"
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-blue-600 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-blue-400"
          >
            Tasks
          </Link>
        </div>
      </nav>
    </header>
  );
}
