export const Styles = {
  primary: {
    background: "border bg-primary dark:bg-gray-900",
    titleClassName: "text-white",
    icon: "dark:text-primary text-white size-8 sm:size-6 md:size-6 lg:size-8",
    description: "dark:text-primary text-white text-4xl font-bold text-gray-800",
    text: "text-sm dark:text-white text-white",
  },
  light: {
    background: "border bg-slate-300 dark:bg-gray-900",
    titleClassName: "text-slate-800 dark:text-white",
    icon: "dark:text-primary text-white size-8 sm:size-6 md:size-6 lg:size-8",
    description: "dark:text-primary text-slate-800 text-4xl font-bold text-gray-800",
    text: "text-sm dark:text-white text-slate-700",
  },
  dark: {
    background: "border bg-gray-600 dark:bg-gray-900",
    titleClassName: "text-white dark:text-white",
    icon: "dark:text-primary text-white size-8 sm:size-6 md:size-6 lg:size-8",
    description: "dark:text-primary text-slate-400 text-4xl font-bold text-gray-800",
    text: "text-sm dark:text-white text-slate-300",
  },
  // NEW STYLES BELOW
  success: {
    background: "border bg-green-500 dark:bg-green-900",
    titleClassName: "text-white dark:text-green-100",
    icon: "text-white dark:text-green-300 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-white text-4xl font-bold",
    text: "text-sm text-green-100 dark:text-green-200",
  },
  warning: {
    background: "border bg-amber-500 dark:bg-amber-900",
    titleClassName: "text-white dark:text-amber-100",
    icon: "text-white dark:text-amber-300 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-white text-4xl font-bold",
    text: "text-sm text-amber-100 dark:text-amber-200",
  },
  danger: {
    background: "border bg-red-500 dark:bg-red-900",
    titleClassName: "text-white dark:text-red-100",
    icon: "text-white dark:text-red-300 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-white text-4xl font-bold",
    text: "text-sm text-red-100 dark:text-red-200",
  },
  info: {
    background: "border bg-blue-500 dark:bg-blue-900",
    titleClassName: "text-white dark:text-blue-100",
    icon: "text-white dark:text-blue-300 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-white text-4xl font-bold",
    text: "text-sm text-blue-100 dark:text-blue-200",
  },
  gradientBlue: {
    background: "border bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-900 dark:to-cyan-900",
    titleClassName: "text-white dark:text-blue-100",
    icon: "text-white size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-white text-4xl font-bold",
    text: "text-sm text-blue-50 dark:text-blue-200",
  },
  gradientPurple: {
    background: "border bg-gradient-to-r from-purple-500 to-pink-500 dark:from-purple-900 dark:to-pink-900",
    titleClassName: "text-white dark:text-purple-100",
    icon: "text-white size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-white text-4xl font-bold",
    text: "text-sm text-purple-50 dark:text-purple-200",
  },
  gradientOcean: {
    background:
      "border bg-gradient-to-r from-blue-600 via-teal-500 to-cyan-500 dark:from-blue-900 dark:via-teal-800 dark:to-cyan-800",
    titleClassName: "text-white dark:text-blue-100",
    icon: "text-white size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-white text-4xl font-bold drop-shadow-sm",
    text: "text-sm text-blue-50 dark:text-blue-200",
  },

  gradientSunset: {
    background:
      "border bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 dark:from-orange-800 dark:via-red-800 dark:to-pink-800",
    titleClassName: "text-white dark:text-orange-100",
    icon: "text-white size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-white text-4xl font-bold drop-shadow-sm",
    text: "text-sm text-orange-50 dark:text-orange-200",
  },

  gradientForest: {
    background:
      "border bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 dark:from-emerald-800 dark:via-green-800 dark:to-lime-800",
    titleClassName: "text-white dark:text-emerald-100",
    icon: "text-white size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-white text-4xl font-bold drop-shadow-sm",
    text: "text-sm text-emerald-50 dark:text-emerald-200",
  },

  gradientRoyal: {
    background:
      "border bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 dark:from-purple-900 dark:via-indigo-800 dark:to-blue-800",
    titleClassName: "text-white dark:text-purple-100",
    icon: "text-white size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-white text-4xl font-bold drop-shadow-sm",
    text: "text-sm text-purple-50 dark:text-purple-200",
  },

  gradientNeon: {
    background:
      "border bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 dark:from-pink-700 dark:via-purple-700 dark:to-blue-700",
    titleClassName: "text-white dark:text-pink-100",
    icon: "text-white size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-white text-4xl font-bold drop-shadow-sm",
    text: "text-sm text-pink-50 dark:text-pink-200",
  },

  gradientGold: {
    background:
      "border bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 dark:from-yellow-700 dark:via-amber-700 dark:to-orange-700",
    titleClassName: "text-gray-800 dark:text-yellow-100",
    icon: "text-gray-800 dark:text-yellow-200 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-gray-800 dark:text-yellow-200 text-4xl font-bold drop-shadow-sm",
    text: "text-sm text-gray-800 dark:text-yellow-300",
  },
  elegant: {
    background: "border bg-white dark:bg-gray-800 shadow-lg",
    titleClassName: "text-gray-800 dark:text-gray-200",
    icon: "text-gray-700 dark:text-gray-300 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-gray-900 dark:text-white text-4xl font-bold",
    text: "text-sm text-gray-600 dark:text-gray-400",
  },
  glass: {
    background: "border border-white/20 bg-white/10 dark:bg-gray-900/50 backdrop-blur-sm",
    titleClassName: "text-gray-800 dark:text-white",
    icon: "text-gray-700 dark:text-gray-300 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-gray-900 dark:text-white text-4xl font-bold",
    text: "text-sm text-gray-700 dark:text-gray-300",
  },
  glassBlue: {
    background: "border border-blue-200/30 bg-blue-500/10 dark:bg-blue-900/20 backdrop-blur-md",
    titleClassName: "text-blue-800 dark:text-blue-300",
    icon: "text-blue-600 dark:text-blue-400 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-blue-900 dark:text-blue-200 text-4xl font-bold",
    text: "text-sm text-blue-700 dark:text-blue-300",
  },

  glassPurple: {
    background: "border border-purple-200/30 bg-purple-500/10 dark:bg-purple-900/20 backdrop-blur-md",
    titleClassName: "text-purple-800 dark:text-purple-300",
    icon: "text-purple-600 dark:text-purple-400 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-purple-900 dark:text-purple-200 text-4xl font-bold",
    text: "text-sm text-purple-700 dark:text-purple-300",
  },

  glassGreen: {
    background: "border border-green-200/30 bg-green-500/10 dark:bg-green-900/20 backdrop-blur-md",
    titleClassName: "text-green-800 dark:text-green-300",
    icon: "text-green-600 dark:text-green-400 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-green-900 dark:text-green-200 text-4xl font-bold",
    text: "text-sm text-green-700 dark:text-green-300",
  },
  minimalist: {
    background: "border border-gray-200 dark:border-gray-700 bg-transparent",
    titleClassName: "text-gray-600 dark:text-gray-400 font-medium",
    icon: "text-gray-500 dark:text-gray-500 size-7 sm:size-5 md:size-5 lg:size-7",
    description: "text-gray-900 dark:text-white text-3xl font-semibold",
    text: "text-sm text-gray-500 dark:text-gray-400",
  },
  // Status cards with icons
  revenue: {
    background: "border bg-emerald-50 dark:bg-emerald-900/20",
    titleClassName: "text-emerald-800 dark:text-emerald-300",
    icon: "text-emerald-600 dark:text-emerald-400 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-emerald-900 dark:text-emerald-200 text-4xl font-bold",
    text: "text-sm text-emerald-700 dark:text-emerald-300",
  },
  users: {
    background: "border bg-indigo-50 dark:bg-indigo-900/20",
    titleClassName: "text-indigo-800 dark:text-indigo-300",
    icon: "text-indigo-600 dark:text-indigo-400 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-indigo-900 dark:text-indigo-200 text-4xl font-bold",
    text: "text-sm text-indigo-700 dark:text-indigo-300",
  },
  performance: {
    background: "border bg-amber-50 dark:bg-amber-900/20",
    titleClassName: "text-amber-800 dark:text-amber-300",
    icon: "text-amber-600 dark:text-amber-400 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-amber-900 dark:text-amber-200 text-4xl font-bold",
    text: "text-sm text-amber-700 dark:text-amber-300",
  },
  darkGradient: {
    background:
      "border bg-gradient-to-r from-gray-800 via-gray-900 to-black dark:from-gray-900 dark:via-black dark:to-gray-900",
    titleClassName: "text-gray-300 dark:text-gray-200",
    icon: "text-gray-400 dark:text-gray-300 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-white dark:text-white text-4xl font-bold",
    text: "text-sm text-gray-400 dark:text-gray-300",
  },

  darkElegant: {
    background: "border border-gray-700 bg-gray-800 dark:bg-gray-900 shadow-xl",
    titleClassName: "text-gray-300 dark:text-gray-200",
    icon: "text-gray-400 dark:text-gray-300 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-white dark:text-white text-4xl font-bold",
    text: "text-sm text-gray-400 dark:text-gray-300",
  },

  // COLORED SHADOWS (Modern look)
  shadowBlue: {
    background: "border bg-white dark:bg-gray-800 shadow-lg shadow-blue-100 dark:shadow-blue-900/30",
    titleClassName: "text-blue-700 dark:text-blue-300",
    icon: "text-blue-600 dark:text-blue-400 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-gray-900 dark:text-white text-4xl font-bold",
    text: "text-sm text-gray-600 dark:text-gray-300",
  },

  shadowGreen: {
    background: "border bg-white dark:bg-gray-800 shadow-lg shadow-green-100 dark:shadow-green-900/30",
    titleClassName: "text-green-700 dark:text-green-300",
    icon: "text-green-600 dark:text-green-400 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-gray-900 dark:text-white text-4xl font-bold",
    text: "text-sm text-gray-600 dark:text-gray-300",
  },

  shadowRed: {
    background: "border bg-white dark:bg-gray-800 shadow-lg shadow-red-100 dark:shadow-red-900/30",
    titleClassName: "text-red-700 dark:text-red-300",
    icon: "text-red-600 dark:text-red-400 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-gray-900 dark:text-white text-4xl font-bold",
    text: "text-sm text-gray-600 dark:text-gray-300",
  },

  // MINIMALIST COLORED BORDERS
  borderedBlue: {
    background: "border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-900",
    titleClassName: "text-blue-800 dark:text-blue-300",
    icon: "text-blue-600 dark:text-blue-400 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-gray-900 dark:text-white text-4xl font-bold",
    text: "text-sm text-gray-600 dark:text-gray-300",
  },

  borderedGreen: {
    background: "border-2 border-green-200 dark:border-green-800 bg-white dark:bg-gray-900",
    titleClassName: "text-green-800 dark:text-green-300",
    icon: "text-green-600 dark:text-green-400 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-gray-900 dark:text-white text-4xl font-bold",
    text: "text-sm text-gray-600 dark:text-gray-300",
  },

  borderedPurple: {
    background: "border-2 border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-900",
    titleClassName: "text-purple-800 dark:text-purple-300",
    icon: "text-purple-600 dark:text-purple-400 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-gray-900 dark:text-white text-4xl font-bold",
    text: "text-sm text-gray-600 dark:text-gray-300",
  },

  // SEMANTIC DASHBOARD CARDS
  sales: {
    background: "border bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/30 dark:to-blue-900/30",
    titleClassName: "text-cyan-800 dark:text-cyan-300",
    icon: "text-cyan-600 dark:text-cyan-400 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-cyan-900 dark:text-cyan-200 text-4xl font-bold",
    text: "text-sm text-cyan-700 dark:text-cyan-300",
  },

  conversion: {
    background:
      "border bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/30 dark:to-purple-900/30",
    titleClassName: "text-violet-800 dark:text-violet-300",
    icon: "text-violet-600 dark:text-violet-400 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-violet-900 dark:text-violet-200 text-4xl font-bold",
    text: "text-sm text-violet-700 dark:text-violet-300",
  },

  engagement: {
    background: "border bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/30",
    titleClassName: "text-rose-800 dark:text-rose-300",
    icon: "text-rose-600 dark:text-rose-400 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-rose-900 dark:text-rose-200 text-4xl font-bold",
    text: "text-sm text-rose-700 dark:text-rose-300",
  },

  // SPECIAL EFFECTS
  glowingBlue: {
    background:
      "border border-blue-500/20 bg-gradient-to-r from-blue-500/10 via-blue-400/10 to-cyan-500/10 dark:from-blue-900/30 dark:via-blue-800/30 dark:to-cyan-900/30 shadow-lg shadow-blue-500/20",
    titleClassName: "text-blue-800 dark:text-blue-300",
    icon: "text-blue-600 dark:text-blue-400 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-blue-900 dark:text-blue-200 text-4xl font-bold",
    text: "text-sm text-blue-700 dark:text-blue-300",
  },

  glowingGreen: {
    background:
      "border border-emerald-500/20 bg-gradient-to-r from-emerald-500/10 via-green-400/10 to-lime-500/10 dark:from-emerald-900/30 dark:via-green-800/30 dark:to-lime-900/30 shadow-lg shadow-emerald-500/20",
    titleClassName: "text-emerald-800 dark:text-emerald-300",
    icon: "text-emerald-600 dark:text-emerald-400 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-emerald-900 dark:text-emerald-200 text-4xl font-bold",
    text: "text-sm text-emerald-700 dark:text-emerald-300",
  },

  // ULTRA MINIMALIST
  outline: {
    background: "border border-gray-300 dark:border-gray-700 bg-transparent",
    titleClassName: "text-gray-700 dark:text-gray-300",
    icon: "text-gray-600 dark:text-gray-400 size-7 sm:size-5 md:size-5 lg:size-7",
    description: "text-gray-900 dark:text-white text-3xl font-bold",
    text: "text-sm text-gray-500 dark:text-gray-400",
  },

  // RETRO/VIBRANT
  vibrant: {
    background:
      "border bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 dark:from-red-600 dark:via-orange-600 dark:to-yellow-600",
    titleClassName: "text-gray-900 dark:text-gray-900",
    icon: "text-gray-900 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-gray-900 text-4xl font-bold",
    text: "text-sm text-gray-800 dark:text-gray-800",
  },

  // MONOCHROME
  monochrome: {
    background:
      "border bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600",
    titleClassName: "text-gray-700 dark:text-gray-300",
    icon: "text-gray-600 dark:text-gray-400 size-8 sm:size-6 md:size-6 lg:size-8",
    description: "text-gray-900 dark:text-white text-4xl font-bold",
    text: "text-sm text-gray-700 dark:text-gray-300",
  },
};
