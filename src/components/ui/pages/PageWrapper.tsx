import { GaugeCircleIcon } from "lucide-react";
import { FunctionComponent, PropsWithChildren } from "react";

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

export const PageWrapper: FunctionComponent<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <AnimatedBackground />
      <div className="z-10 flex h-full flex-col p-5">{children}</div>
    </>
  );
};
