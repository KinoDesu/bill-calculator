import { useTheme } from "@/hooks/use-theme";
import { StyleSheet } from "react-native";

export const BaseStyle = (theme: ReturnType<typeof useTheme>) => StyleSheet.create({
    app: {
        flex: 1,
        margin: 0,
        padding: 0,
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
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 5,
        marginVertical: 25,
    },
    appTitleStyle: {
        color: theme.title,
        fontSize: 64,
        fontWeight: 900,
        textAlign: "center",
        marginTop: 100,
    },
    // header
    headerStyle: {
        backgroundColor: theme.title,
    },
    headerTintColor: {
        tintColor: theme.primary,
    },
    headerTitleAlign: {
        textAlign: "center",
    },
    headerTitleStyle: {
        color: theme.primary,
        fontSize: 24,
        fontWeight: "900",
    },
    // end header
    textStyle: {
        color: theme.primary,
    },
    //   button
    buttonContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    buttonStyle: {
        width: "100%",
        maxWidth: 350,
        height: 50, // Defina a altura diretamente em vez de usar maxHeight/height: 100%
        backgroundColor: '#443C68',
        borderRadius: 10,
        justifyContent: "center", // Centraliza o texto verticalmente
        alignItems: "center",
        userSelect: "none", // Evita seleção de texto
    },
    buttonText: {
        color: theme.primary,
        fontSize: 24,
        fontWeight: '800',
        textAlign: "center",
    },
    buttonPressed: {
        opacity: 0.8,
    },

    squareButtonStyle: {
        width: 50,
        height: 50,

        backgroundColor: "#443C68",
        borderRadius: 8,

        alignItems: "center",
        justifyContent: "center",
    },

    squareButtonTextStyle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "800",
    },
    //   end button

    // text input
    inputContainer: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
        maxWidth: 350,
    },
    inputStyle: {
        width: "100%",
        height: 50,
        backgroundColor: theme.background,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,

        borderWidth: 1,
        borderColor: theme.inputBorder,

        color: theme.primary,
        fontSize: 24,
        fontWeight: "700",
    },
    // end text input

    // number input
    numberInputContainer: {
        width: "100%",
        maxWidth: 350,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "left",
    },

    numberInputLabel: {
        color: theme.primary,
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 8,
        alignSelf: "flex-start",
    },

    numberInputControls: {
        flexDirection: "row",
        alignItems: "center",
        textAlign: "center",
        gap: 8,
        userSelect: "none", // Evita seleção de texto
    },

    numberInput: {
        width: 100,
        height: 50,

        borderWidth: 1,
        borderColor: "#FFFFFF",
        borderRadius: 8,

        backgroundColor: "#000000",

        color: "#FFFFFF",
        fontSize: 24,
        fontWeight: "800",
        textAlign: "center",
    },
    // end number input

    //Qr code
    qrCode: {
        width: 250,
        height: 250,
    },
    qrCodeContainer: {
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    scanArea: {
        width: 250,
        height: 250,

        borderWidth: 2,
        borderColor: theme.inputBorder,
        backgroundColor: theme.secondaryBackground,

        overflow: "hidden",
        borderRadius: 10,
    },
    camera: {
        width: "100%",
        height: "100%",
    },
    permissionContainer: {
        width: 250,
        height: 250,

        borderWidth: 2,
        borderColor: theme.inputBorder,
        borderRadius: 10,

        backgroundColor: theme.secondaryBackground,

        alignItems: "center",
        justifyContent: "center",

        padding: 20,
    },

    permissionText: {
        color: theme.primary,
        fontSize: 18,
        fontWeight: "700",
        textAlign: "center",

        marginBottom: 20,
    },

    permissionButton: {
        color: theme.primary,
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
    },
    //end Qrcode

    // order
    orderBoxContainer: {
        width: "100%",
        justifyContent: "flex-start",
        gap: 15,
    },

    orderBox: {
        backgroundColor: theme.button,
        borderWidth: 1,
        borderColor: theme.inputBorder,
        borderRadius: 10,
    },

    orderBoxHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        padding: 10,
    },

    orderInfo: {
        flex: 1,
        minWidth: 0,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 5,
    },

    orderDetails: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        width: "100%",
        padding: 10,
        borderTopWidth: 1,
        gap: 8,
        backgroundColor: theme.secondaryBackground,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
    },

    orderName: {
        width: "100%",
        color: theme.primary,
        fontSize: 24,
        fontWeight: "600",
    },

    orderPrice: {
        color: theme.primary,
        fontSize: 12,
        fontWeight: 600,
    },

    OrderClientContainer: {
        backgroundColor: theme.button,
        padding: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: theme.inputBorder,
    },

    OrderClientName: {
        color: theme.primary,
        fontSize: 12,
        fontWeight: 600,
    },

    clientInputContainer: {
        width: "100%",
        maxWidth: 350,
        flexDirection: "row",
        alignItems: "center",
        textAlign: "center",
        userSelect: "none",
        gap: 5,
    },
    clientInput: {
        width:"100%",
        maxWidth: 295,
        height: 50,
        backgroundColor: theme.background,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 10,

        borderWidth: 1,
        borderColor: theme.inputBorder,

        color: theme.primary,
        fontSize: 24,
        fontWeight: "700",
    },
    clientInputButtonStyle: {
        width: 50,
        height: 50,

        backgroundColor: "#443C68",
        borderRadius: 8,

        alignItems: "center",
        justifyContent: "center",
    },

    clientInputButtonTextStyle: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "800",
    },

    clientInputListContainer: {
        maxHeight: 250,
        width: "100%",
        maxWidth: 350,
        backgroundColor:
            theme.secondaryBackground,
        borderWidth: 1,
        borderColor: theme.inputBorder,
        borderRadius: 10,
        marginTop: 5,
    }
});