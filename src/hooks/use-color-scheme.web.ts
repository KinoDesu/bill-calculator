// use-color-scheme.web.ts
import { useLayoutEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

// useLayoutEffect não existe durante build estático (sem DOM no Node);
// nesse caso vira um no-op sem problema.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : () => {};

export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useIsomorphicLayoutEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  // undefined = "ainda não sei", em vez de assumir 'light'
  return hasHydrated ? colorScheme : undefined;
}