import { useTheme } from "@/hooks/use-theme";
import { BaseStyle } from "@/styles/baseStyle";
import Svg, { Path } from "react-native-svg";

type BackgroundProps = {
    type: "home" | "createTable" | "joinTable";
};

export function Background({ type }: BackgroundProps) {

    const theme = useTheme();
    const baseStyle = BaseStyle(theme);

    return (
        <Svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={baseStyle.svg}
        >
            {type === "home" && <HomeBackground />}
            {type === "createTable" && <CreateTableBackground />}
            {type === "joinTable" && <JoinTableBackground />}
        </Svg>
    );
}

function HomeBackground() {
    return (
        <>
            <Path
                d="
                M -14.87,42.65
                C -14.87,42.65 22.82,51.78 45.38,31.99
                C 67.95,12.2 106.15,13.27 122.05,12.91
                C 137.95,12.56 138.46,-1.42 138.46,-1.42
                L 34.36,-2.13
                L -20.51,-0.83
                L -14.87,42.65
                M -11.54,95.5
                C -11.54,95.5 12.31,78.08 43.08,83.89
                C 73.85,89.69 86.41,67.89 86.41,67.89
                C 86.41,67.89 120,44.43 134.1,69.79
                C 148.21,95.14 136.15,106.4 136.15,106.4
                L 11.54,108.06
                L -11.54,95.5
            "
                fill="#18122B"
            />
        </>
    );
}

function CreateTableBackground() {
    return (
        <>
            <Path
                d="
                M -11.28,-1.9
                C -11.28,-1.9 -37.69,13.63 45.13,26.42
                C 127.95,39.22 105.13,65.76 105.13,65.76
                L 121.54,74.88
                L 104.62,-4.86
                L -11.28,-1.9
                M -6.92,61.85
                C -6.92,61.85 24.36,60.19 33.33,79.03
                C 42.31,97.87 107.95,91 107.95,91
                L 104.1,102.61
                L -6.67,102.61
                L -6.92,61.85
            "
                fill="#18122B"
            />
        </>
    );
}

function JoinTableBackground() {
    return (
        <>
            <Path
                d="
          M 0 400
          C 100 350, 200 370, 350 300
          V 600
          H 0
          Z
        "
                fill="#18122B"
            />
        </>
    );
}