import { LoginCard } from "@mr/components/features/auth/LoginCard";

export default function LoginPage() {
  return (
    <div className="dark:from-bg-slate-950 relative flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-blue-100/20 dark:from-slate-950 dark:to-blue-600">
      <LoginCard />
    </div>
  );
}
