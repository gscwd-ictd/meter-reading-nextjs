"use client";
import { Button } from "@mr/components/ui/Button";
import { Card, CardContent } from "@mr/components/ui/Card";
import { Input } from "@mr/components/ui/Input";
import { Label } from "@mr/components/ui/Label";
import { GaugeCircleIcon, LockIcon, Mail } from "lucide-react";
import { FunctionComponent } from "react";

export const LoginCard: FunctionComponent = () => {
  return (
    <Card className="w-full max-w-md rounded-2xl border shadow-xl">
      <CardContent className="space-y-4 p-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          {/* Replace with actual logo */}
          {/* <Image src="/logo.png" alt="Logo" width={80} height={80} className="rounded-full" /> */}
          <GaugeCircleIcon className="text-primary size-18" />
          <h1 className="text-primary text-3xl font-bold">MetraX</h1>
          <h2 className="text-base font-semibold text-gray-700">Meter Reading Application</h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input id="email" type="email" placeholder="Enter your email" className="pl-10" />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <LockIcon className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
              <Input id="password" type="password" placeholder="Enter your password" className="pl-10" />
            </div>
          </div>

          <Button className="w-full">Sign In</Button>
        </div>
      </CardContent>
    </Card>
  );
};
