import { useTheme } from "@/hooks/use-theme";
import { StyleSheet } from "react-native";

export const BaseStyle = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
    app: {
        flex: 1,
        margin: 0,
        padding: 0,
        position: "relative",
        backgroundColor: theme.background,
    },
    svg: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
    },
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 100,
        paddingHorizontal: 5,
    },
    titleStyle: {
        color: theme.title,
        fontSize: 64,
        fontWeight: 900,
        textAlign: "center",
    },
    headerStyle: {
        color: theme.primary,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.title,
        textAlign: "center",
    },
    headerTextStyle: {
        color: theme.primary,
        fontSize: 24,
        fontWeight: "bold",
    },
    textStyle: {
        color: theme.primary,
    },
    //   button
    buttonContainer: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 25,
        gap: 10,
    },
    buttonStyle: {
        width: 350,
        height: 50,
        backgroundColor: '#443C68',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: theme.primary,
        fontSize: 28,
        fontWeight: '800',
    },
    buttonPressed: {
        opacity: 0.8,
    }
    //   end button
});