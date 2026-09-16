import { BaseStyle } from "@/styles/baseStyle";
import { ReactNode, createContext, useContext } from "react";

type BaseStyleContextType = {
    theme: ReturnType<typeof BaseStyle.theme>;
    style: ReturnType<typeof BaseStyle.style>;
};

const StyleContext = createContext<BaseStyleContextType | null>(null);

export function StyleProvider({
    value,
    children,
}: {
    value: BaseStyleContextType;
    children: ReactNode;
}) {
    return (
        <StyleContext.Provider value={value}>
            {children}
        </StyleContext.Provider>
    );
}

export function useBaseStyle() {
    const context = useContext(StyleContext);

    if (!context) {
        throw new Error(
            "useBaseStyle deve ser usado dentro de um StyleProvider"
        );
    }

    return context;
}