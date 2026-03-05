import { LoginCard } from "@mr/components/features/auth/LoginCard";

export default function LoginPage() {
  return (
    <div className="relative flex h-screen w-full duration-300">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[size:60px_60px] opacity-10 dark:opacity-5" />

      {/* Responsive grid */}
      <div className="relative grid w-full grid-cols-1 lg:grid-cols-3">
        {/* Hero text - visible on all screens, positioned differently based on screen size */}
        <div className="flex flex-col items-center justify-start px-6 pt-12 text-center lg:col-start-1 lg:items-start lg:justify-center lg:px-12 lg:text-left">
          <h1 className="w-full space-y-1 text-xs sm:w-full sm:text-base md:w-full md:text-xl lg:w-70 lg:text-6xl">
            <div className="font-bold">Meter</div>
            <div className="font-bold">Reading</div>
            <div className="text-primary font-bold">
              Application<span className="text-black dark:text-white">.</span>
            </div>
          </h1>
        </div>

        {/* Login Card - takes different column positions based on screen size */}
        <div className="flex items-center justify-center p-4 lg:col-start-3 lg:p-0">
          <LoginCard />
        </div>
      </div>
    </div>
  );
}
