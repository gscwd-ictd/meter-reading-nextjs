"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@mr/components/ui/Button";
import { Card, CardContent } from "@mr/components/ui/Card";
import { Input } from "@mr/components/ui/Input";
import { Label } from "@mr/components/ui/Label";
// import { useMutation } from "@tanstack/react-query";
// import axios from "axios";
import { GaugeCircleIcon, LockIcon, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { FunctionComponent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password must be at least a character" }),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const LoginCard: FunctionComponent = () => {
  const router = useRouter();
  const { register, handleSubmit } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  // const login = useMutation({
  //   mutationFn: async (body: LoginFormData) => {
  //     const res = await axios.post(
  //       `${process.env.NEXT_PUBLIC_MR}/login`,
  //       { email: body.email, password: body.password },
  //       { headers: { "Content-Type": "application/json" } },
  //     );

  //     return res;
  //   },
  //   onSuccess: () => {
  //     // set the user here
  //   },
  // });

  const onSubmit = (credentials: LoginFormData) => {
    console.log(credentials);
    if (credentials.email === "admin@gscwd.com" && credentials.password === "123") router.push("/dashboard");
  };

  return (
    <Card className="w-full max-w-md rounded-xl bg-white/80 shadow-xl backdrop-blur-md dark:bg-slate-900">
      {/* <Card className="w-full max-w-md rounded-2xl border shadow-xl"></Card> */}
      <CardContent className="space-y-4 p-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          {/* Replace with actual logo */}
          {/* <Image src={metrax_logo.src} alt="Logo" width={80} height={80} className="rounded-full" /> */}
          <GaugeCircleIcon className="text-primary size-18" />
          <h1 className="text-primary text-3xl font-bold">MetraX</h1>
          <div className="text-xs font-bold text-gray-500">
            <i>Measure Transactions</i>
          </div>
          <h2 className="text-base font-semibold text-gray-700 dark:text-gray-400">
            Meter Reading Application
          </h2>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                className="pl-10"
                {...register("email")}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <LockIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="pl-10"
                {...register("password")}
              />
            </div>
          </div>

          <Button className="w-full dark:text-white">Sign In</Button>
        </form>
      </CardContent>
    </Card>
  );
};
