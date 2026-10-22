"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

/*
 * Rendered normally, NOT via next/dynamic with ssr:false. The dynamic wrapper
 * used to strip next-themes' inline anti-FOUC script, which guaranteed a
 * light-flash on every load before the dark theme applied.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
