"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mr/components/ui/Button";
import { Card, CardContent } from "@mr/components/ui/Card";
import { Input } from "@mr/components/ui/Input";
import { Label } from "@mr/components/ui/Label";
import { GaugeCircleIcon, LockIcon, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { FunctionComponent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

export const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Animated Water Flow Component
const WaterFlow: FunctionComponent = () => {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-75 dark:opacity-50">
      {/* First water wave */}
      <svg
        className="animate-flow-slow absolute bottom-0 w-full"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0,50 C200,100 400,0 600,50 C800,100 1000,0 1200,50 L1200,100 L0,100 Z"
          className="fill-primary/30"
        />
      </svg>

      {/* Second water wave */}
      <svg
        className="animate-flow-medium absolute bottom-0 w-full"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0,30 C300,80 500,20 700,60 C900,100 1100,40 1200,70 L1200,100 L0,100 Z"
          className="fill-primary/20"
        />
      </svg>

      {/* Third water wave */}
      <svg
        className="animate-flow-slower absolute bottom-0 w-full"
        viewBox="0 0 1200 100"
        preserveAspectRatio="none"
      >
        <path
          d="M0,70 C250,40 450,90 650,60 C850,30 950,80 1200,50 L1200,100 L0,100 Z"
          className="fill-primary/15"
        />
      </svg>
    </div>
  );
};

// Animated Background Component
const AnimatedBackground: FunctionComponent = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900">
      {/* Water Flow */}
      <WaterFlow />

      {/* Floating Circles */}
      <div className="absolute top-1/4 left-1/4 size-64 animate-pulse rounded-full bg-blue-200/20 blur-3xl dark:bg-blue-400/10"></div>
      <div
        className="absolute right-1/4 bottom-1/3 size-96 animate-pulse rounded-full bg-indigo-200/20 blur-3xl dark:bg-indigo-400/10"
        style={{ animationDelay: "1s" }}
      ></div>
      <div
        className="absolute top-1/2 right-1/3 size-80 animate-pulse rounded-full bg-sky-200/15 blur-3xl dark:bg-sky-400/10"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-100 dark:opacity-5"
        style={{
          backgroundImage: `linear-gradient(#00000010 1px, transparent 1px),
                            linear-gradient(90deg, #00000010 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      ></div>

      {/* Animated Meter Dials */}
      <div className="text-primary absolute top-10 right-10 opacity-100 dark:opacity-10">
        <div className="animate-spin" style={{ animationDuration: "20s" }}>
          <GaugeCircleIcon className="size-40" />
        </div>
      </div>
      <div className="text-primary absolute bottom-10 left-10 opacity-100 dark:opacity-10">
        <div className="animate-spin" style={{ animationDuration: "30s", animationDirection: "reverse" }}>
          <GaugeCircleIcon className="size-32" />
        </div>
      </div>
    </div>
  );
};

export const LoginCard: FunctionComponent = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (credentials: LoginFormData) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (credentials.email === "admin@gscwd.com" && credentials.password === "123") {
        toast.success("Login successful!");
        router.push("/dashboard");
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("An error occurred during login");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <AnimatedBackground />
      <Card className="w-full max-w-md rounded-xl border border-white/20 bg-white/80 shadow-xl backdrop-blur-md dark:border-slate-700/30 dark:bg-slate-900/80">
        <CardContent className="relative space-y-6 p-8">
          {/* Header Section */}
          <div className="flex flex-col items-center space-y-3 text-center">
            <div className="bg-primary/10 rounded-full p-4 backdrop-blur-sm">
              <GaugeCircleIcon className="text-primary size-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">MetraX</h1>
            <p className="text-muted-foreground text-sm">Meter Reading Application</p>
          </div>

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  className="border-white/30 bg-white/50 pl-10 backdrop-blur-sm dark:border-slate-600/30 dark:bg-slate-800/50"
                  disabled={isLoading}
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button
                  type="button"
                  className="text-primary text-sm font-medium hover:underline"
                  onClick={() => router.push("/forgot-password")}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <LockIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="border-white/30 bg-white/50 pl-10 backdrop-blur-sm dark:border-slate-600/30 dark:bg-slate-800/50"
                  disabled={isLoading}
                  {...register("password")}
                />
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full backdrop-blur-sm" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Footer Links */}
          <div className="text-muted-foreground text-center text-sm">
            Don&apos;t have an account?{" "}
            <button
              type="button"
              className="text-primary font-medium hover:underline"
              onClick={() => router.push("/register")}
            >
              Contact admin
            </button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
