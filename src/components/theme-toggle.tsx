import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { applyTheme, nextTheme, readThemePref, type ThemePref } from "@/lib/theme";

export function ThemeToggle() {
  const [pref, setPref] = useState<ThemePref | null>(null);

  useEffect(() => {
    const initial = readThemePref();
    setPref(initial);
    applyTheme(initial);
  }, []);

  function toggle() {
    if (!pref) return;
    const n = nextTheme(pref);
    setPref(n);
    applyTheme(n);
  }

  const Icon = pref === "light" ? Sun : Moon;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-9 shrink-0"
      onClick={toggle}
      aria-label={pref === "light" ? "Switch to dark mode" : "Switch to light mode"}
      title={pref === "light" ? "Light · click for dark" : "Dark · click for light"}
    >
      <Icon className="size-4" strokeWidth={1.75} />
    </Button>
  );
}
