import { LoginCard } from "@mr/components/features/auth/LoginCard";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100/30 p-4 transition-colors duration-300 sm:p-6 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/20">
      {/* Optional: Subtle grid texture */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:60px_60px] opacity-10 dark:opacity-5" />

      <LoginCard />
    </div>
  );
}
