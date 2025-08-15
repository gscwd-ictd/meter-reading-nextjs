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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md rounded-xl bg-white/90 shadow-xl backdrop-blur-md dark:bg-slate-900/90">
      <CardContent className="space-y-6 p-8">
        {/* Header Section */}
        <div className="flex flex-col items-center space-y-3 text-center">
          <div className="bg-primary/10 rounded-full p-4">
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
                className="pl-10"
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
                className="pl-10"
                disabled={isLoading}
                {...register("password")}
              />
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={isLoading}>
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
          Don't have an account?{" "}
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
  );
};
