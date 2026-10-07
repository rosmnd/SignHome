export type ThemePref = "light" | "dark";

export const THEME_KEY = "signhome.theme";

export const THEME_BOOT = `(function(){try{var k=${JSON.stringify(THEME_KEY)};var t=localStorage.getItem(k)||"dark";if(t!=="light"&&t!=="dark")t="dark";var e=document.documentElement;e.setAttribute("data-theme",t);e.style.colorScheme=t;}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;

export function readThemePref(): ThemePref {
  try {
    const v = localStorage.getItem(THEME_KEY);
    if (v === "light" || v === "dark") return v;
    if (v === "system" && typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
    }
  } catch {
    /* ignore */
  }
  return "dark";
}

export function applyTheme(pref: ThemePref): ThemePref {
  const el = document.documentElement;
  el.dataset.theme = pref;
  el.style.colorScheme = pref;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", pref === "light" ? "#f3efe6" : "#09090b");
  try {
    localStorage.setItem(THEME_KEY, pref);
  } catch {
    /* ignore */
  }
  return pref;
}

export function nextTheme(pref: ThemePref): ThemePref {
  return pref === "dark" ? "light" : "dark";
}
