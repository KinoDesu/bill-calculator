import { useEffect, useState } from "react";

export function useColorScheme() {
    const [colorScheme, setColorScheme] = useState<"light" | "dark" | undefined>(
        undefined
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia(
            "(prefers-color-scheme: dark)"
        );

        const updateColorScheme = () => {
            setColorScheme(mediaQuery.matches ? "dark" : "light");
        };

        // Descobre o tema depois da montagem
        updateColorScheme();

        // Escuta mudanças futuras
        mediaQuery.addEventListener("change", updateColorScheme);

        return () => {
            mediaQuery.removeEventListener("change", updateColorScheme);
        };
    }, []);

    return colorScheme;
}