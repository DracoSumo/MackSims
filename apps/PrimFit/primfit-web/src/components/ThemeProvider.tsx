"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  PACKS,
  applyThemeToDocument,
  equipTheme,
  loadThemeState,
  themeCopy,
  unlockPack,
  type ThemeCopy,
  type ThemeId,
  type ThemePack,
  type ThemeReceipt,
} from "@/lib/themes";

type ThemeContextValue = {
  theme: ThemeId;
  owned: ThemeId[];
  receipts: ThemeReceipt[];
  copy: ThemeCopy;
  packs: ThemePack[];
  ready: boolean;
  buy: (id: ThemeId) => ThemeReceipt | null;
  equip: (id: ThemeId) => boolean;
  restore: () => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "sleek",
  owned: ["sleek"],
  receipts: [],
  copy: themeCopy("sleek"),
  packs: PACKS,
  ready: false,
  buy: () => null,
  equip: () => false,
  restore: () => undefined,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeId>("sleek");
  const [owned, setOwned] = useState<ThemeId[]>(["sleek"]);
  const [receipts, setReceipts] = useState<ThemeReceipt[]>([]);
  const [ready, setReady] = useState(false);

  const hydrate = useCallback(() => {
    const next = loadThemeState();
    setTheme(next.theme);
    setOwned(next.owned);
    setReceipts(next.receipts);
    setReady(true);
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      owned,
      receipts,
      copy: themeCopy(theme),
      packs: PACKS,
      ready,
      buy: (id) => {
        const receipt = unlockPack(id);
        hydrate();
        return receipt;
      },
      equip: (id) => {
        const ok = equipTheme(id);
        if (ok) {
          applyThemeToDocument(id);
          setTheme(id);
        }
        return ok;
      },
      restore: () => hydrate(),
    }),
    [theme, owned, receipts, ready, hydrate],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
