// use-theme.ts
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();
  const isReady = scheme !== undefined;
  const resolved = scheme === 'dark' ? 'dark' : 'light';

  return { ...Colors[resolved], isReady };
}