import { useTheme } from "@/hooks/use-theme";
import { StyleSheet } from "react-native";

const style = (
    theme: ReturnType<typeof useTheme>
) =>
    StyleSheet.create({
        /*
         * ---------------------------------------------------------
         * APP
         * ---------------------------------------------------------
         */

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
            width: "100%",
            height: "100%",
        },

        /*
         * IMPORTANTE:
         *
         * Não usamos flex: 1 aqui.
         * Esse container está dentro de um ScrollView.
         */

        scrollContainer: {
            width: "95%",
            alignSelf: "center",
            flexDirection: "column",
            alignItems: "center",
            paddingVertical: 5,
            marginVertical: 25,
            gap: 15,
        },

        container: {
            width: "95%",
            alignSelf: "center",
            flex: 1,
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            paddingVertical: 5,
            marginVertical: 25,
            gap: 15,
        },


        /*
         * ---------------------------------------------------------
         * BILLING
         * ---------------------------------------------------------
         */

        billingScroll: {
            flex: 1,
            width: "100%",
        },

        billingScrollContent: {
            width: "100%",
            alignItems: "center",
            paddingVertical: 15,
            paddingHorizontal: 10,
        },

        billingContent: {
            width: "100%",
            maxWidth: 350,
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 20,
        },

        billingRow: {
            width: "100%",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 30,
        },

        billingValue: {
            alignItems: "center",
            justifyContent: "center",
            minWidth: 120,
        },

        billingSection: {
            width: "100%",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 10,
        },

        /*
         * ---------------------------------------------------------
         * TITLE / TEXT
         * ---------------------------------------------------------
         */

        appTitleStyle: {
            color: theme.title,
            fontSize: 64,
            fontWeight: "900",
            textAlign: "center",
            marginTop: 100,
        },

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
            alignSelf: "center",
            textAlign: "center",
            overflow: "hidden",
            color: theme.primary,
            fontSize: 24,
            fontWeight: "900",
        },

        textStyle: {
            color: theme.primary,
        },

        /*
         * ---------------------------------------------------------
         * BUTTON
         * ---------------------------------------------------------
         */

        buttonContainer: {
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
        },

        buttonStyle: {
            width: "100%",
            maxWidth: 350,
            minHeight: 50,
            backgroundColor: theme.button,
            borderRadius: 10,
            justifyContent: "center",
            alignItems: "center",
            userSelect: "none",
        },

        buttonText: {
            color: theme.primary,
            fontSize: 24,
            fontWeight: "800",
            textAlign: "center",
        },

        buttonPressed: {
            opacity: 0.8,
        },

        squareButtonStyle: {
            width: 50,
            height: 50,
            backgroundColor: theme.button,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
        },

        squareButtonTextStyle: {
            color: theme.primary,
            fontSize: 20,
            fontWeight: "800",
        },

        /*
         * ---------------------------------------------------------
         * TEXT INPUT
         * ---------------------------------------------------------
         */

        inputContainer: {
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            maxWidth: 350,
        },

        inputStyle: {
            width: 250,
            maxWidth: 320,
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

        /*
         * ---------------------------------------------------------
         * NUMBER INPUT
         * ---------------------------------------------------------
         */

        numberInputContainer: {
            maxWidth: 350,
            justifyContent: "center",
            alignItems: "center",
        },

        numberInputLabel: {
            color: theme.primary,
            fontSize: 24,
            fontWeight: "700",
            marginBottom: 8,
            textAlign: "center",
        },

        numberInputControls: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            userSelect: "none",
        },

        numberInput: {
            width: 80,
            height: 50,
            borderWidth: 1,
            borderColor: theme.inputBorder,
            borderRadius: 8,
            backgroundColor: theme.background,
            color: theme.primary,
            fontSize: 24,
            fontWeight: "800",
            textAlign: "center",
        },

        /*
         * ---------------------------------------------------------
         * QR CODE
         * ---------------------------------------------------------
         */

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
            backgroundColor:
                theme.secondaryBackground,
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
            backgroundColor:
                theme.secondaryBackground,
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            gap: 15
        },

        permissionText: {
            color: theme.primary,
            fontSize: 18,
            fontWeight: "700",
            textAlign: "center",
        },

        permissionButton: {
            color: theme.primary,
            fontSize: 16,
            fontWeight: "700",
            textAlign: "center",
        },

        /*
         * ---------------------------------------------------------
         * ORDER
         * ---------------------------------------------------------
         */

        orderBoxContainer: {
            width: "100%",
            justifyContent: "flex-start",
            gap: 15,
        },

        orderBox: {
            width: "100%",
            maxWidth: 350,
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
            paddingVertical: 10,
            paddingLeft: 10,
            gap: 5
        },

        orderInfo: {
            flex: 1,
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 5,
            textAlign: "center",
        },

        orderDetails: {
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 8,
            backgroundColor:
                theme.secondaryBackground,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
        },

        orderName: {
            color: theme.primary,
            fontSize: 24,
            fontWeight: "600",
        },

        orderPrice: {
            display: "flex",
            flexDirection: "row",
            color: theme.primary,
            fontSize: 12,
            fontWeight: "600",
            alignItems: "center",
        },

        OrderClientContainer: {
            width: "auto",
            backgroundColor: theme.button,
            padding: 5,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: theme.inputBorder,
        },

        OrderClientName: {
            color: theme.primary,
            fontSize: 12,
            fontWeight: "600",
        },

        /*
         * ---------------------------------------------------------
         * CLIENT SELECT
         * ---------------------------------------------------------
         */

        clientSelectContainer: {
            width: "100%",
            maxWidth: 300,
            zIndex: 10,
            position: "relative",
            display: "flex",
            flexDirection: "row",
            gap: 5,
            justifyContent: "center"
        },

        clientInputListContainer: {
            position: "absolute",
            top: 55,
            left: 0,
            right: 0,

            maxHeight: 250,

            backgroundColor: theme.secondaryBackground,
            borderWidth: 1,
            borderColor: theme.inputBorder,
            borderRadius: 10,

            overflow: "hidden",
            zIndex: 1000,
            elevation: 1000,
        },

        selectedClientsContainer: {
            maxWidth: 350,

            flexDirection: "row",
            flexWrap: "wrap",

            alignItems: "flex-start",
            justifyContent: "center",

            gap: 15,
        },

        selectedClientContainer: {
            minHeight: 40,
            width: 150,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",

            paddingLeft: 5,

            backgroundColor: theme.secondaryBackground,

            borderWidth: 1,
            borderColor: theme.inputBorder,
            borderRadius: 10,
        },

        selectedClientName: {
            color: theme.primary,
            fontSize: 12,
            fontWeight: "600",

            paddingHorizontal: 5,
        },

        removeClientButton: {
            width: 40,
            height: "100%",
            minHeight: 40,

            borderLeftWidth: 1,
            borderColor: theme.inputBorder,

            borderBottomRightRadius: 10,
            borderTopRightRadius: 10,

            backgroundColor: theme.button,

            alignItems: "center",
            justifyContent: "center",
        },

        removeClientText: {
            color: theme.primary,
            fontSize: 22,
            fontWeight: "bold",
        },

        clientInput: {
            flex: 1,
            height: 50,
            width: "100%",
            backgroundColor: theme.background,
            borderRadius: 10,
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
            backgroundColor: theme.button,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
        },

        clientInputButtonTextStyle: {
            color: theme.primary,
            fontSize: 20,
            fontWeight: "800",
        },


        clientOption: {
            paddingVertical: 14,
            paddingHorizontal: 16,
        },

        clientEmptyList: {
            padding: 16,
            alignItems: "center",
            justifyContent: "center",
        },

        /*
         * ---------------------------------------------------------
         * SELECTED CLIENTS
         * ---------------------------------------------------------
         *
         * Não existe ScrollView aqui.
         *
         * A lista cresce naturalmente.
         * Quem faz o scroll é o ScrollView da Billing.
         */

        selectedClientsSection: {
            width: "100%",
            alignItems: "center",
            justifyContent: "flex-start",
            gap: 15,
        },

        removeClientButtonText: {
            color: theme.primary,
            fontSize: 28,
            fontWeight: "600",
        },

        /*
         * ---------------------------------------------------------
         * LOADING
         * ---------------------------------------------------------
         */

        loadingOverlay: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,

            backgroundColor:
                "rgba(0, 0, 0, 0.5)",

            alignItems: "center",
            justifyContent: "center",

            zIndex: 9999,
            elevation: 9999,
        },

        loadingContainer: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.background,
        },

        loadingText: {
            color: theme.primary,
            fontSize: 18,
            fontWeight: "700",
            textAlign: "center",
            marginTop: 16,
        },

        /*
         * ---------------------------------------------------------
         * MODAL
         * ---------------------------------------------------------
         */

        modalOverlay: {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,

            backgroundColor:
                "rgba(0, 0, 0, 0.6)",

            alignItems: "center",
            justifyContent: "center",

            padding: 20,

            zIndex: 10000,
            elevation: 10000,
        },

        modalContainer: {
            width: "100%",
            maxWidth: 350,

            backgroundColor:
                theme.secondaryBackground,

            borderWidth: 2,
            borderColor: theme.inputBorder,
            borderRadius: 10,

            padding: 15,

            alignItems: "center",
            justifyContent: "center",

            gap: 20,
        },

        modalTitle: {
            color: theme.primary,
            fontSize: 28,
            fontWeight: "800",
            textAlign: "center",
        },

        modalContent: {
            width: "100%",

            backgroundColor: theme.button,

            borderWidth: 1,
            borderColor: theme.inputBorder,
            borderRadius: 10,

            padding: 15,

            gap: 8,
        },

        modalItemName: {
            color: theme.primary,
            fontSize: 24,
            fontWeight: "800",
            textAlign: "center",
            marginBottom: 5,
        },

        modalInfo: {
            color: theme.primary,
            fontSize: 18,
            fontWeight: "600",
        },

        baseContainerScroll: {
            width: "100%",
        },

        billPriceText: {
            color: theme.title,
            fontSize: 24,
            fontWeight: 700
        }
    });

export const BaseStyle = {
    theme: useTheme,
    style,
};