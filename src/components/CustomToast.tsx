import ErrorEnum from "@/constants/errorEnum";
import { useBaseStyle } from "@/contexts/StyleContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";

export const CustomToast = ({ text1, text2 }: any) => {
    const baseStyle = useBaseStyle();

    let icon = <MaterialIcons />;
    let backgroundColor = "";
    let border = "";

    switch (text1) {
        case ErrorEnum.WARNING.description:
            icon = <MaterialIcons name="warning" size={24} color={baseStyle.theme.warningIcon} />
            backgroundColor = baseStyle.theme.warningBg
            border = baseStyle.theme.warningBorder
            break;

        case ErrorEnum.ERROR.description:
            icon = <MaterialIcons name="error" size={24} color={baseStyle.theme.errorIcon} />
            backgroundColor = baseStyle.theme.errorBg
            border = baseStyle.theme.errorBorder
            break;

        case ErrorEnum.FATAL.description:
            icon = <MaterialIcons name="dangerous" size={24} color={baseStyle.theme.fatalIcon} />
            backgroundColor = baseStyle.theme.fatalBg
            border = baseStyle.theme.fatalBorder

            break;

        case ErrorEnum.INFO.description:
            icon = <MaterialIcons name="info" size={24} color={baseStyle.theme.infoIcon} />
            backgroundColor = baseStyle.theme.infoBg
            border = baseStyle.theme.infoBorder

            break;

        case ErrorEnum.SUCCESS.description:
            icon = <MaterialIcons name="check-circle" size={24} color={baseStyle.theme.successIcon} />
            backgroundColor = baseStyle.theme.successBg
            border = baseStyle.theme.successBorder

            break;

        default:
            break;
    }


    return (
        <View
            style={{
                width: "90%",
                padding: 14,
                borderRadius: 12,
                backgroundColor: backgroundColor,
                borderWidth: 2,
                borderColor: border,
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 25
            }}
        >
            <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                {icon}
            </View>
            <View>
                <Text style={{ fontWeight: "bold", color: baseStyle.theme.primary }}>
                    {text1}
                </Text>
                {text2 && (
                    <Text style={{ color: baseStyle.theme.primary, marginTop: 4 }}>
                        {text2}
                    </Text>
                )}
            </View>
        </View>
    );
};

export function showError(
    text1: string = "Erro",
    text2: string = "Não foi possível realizar a operação."
) {
    Toast.show({
        type: "error",
        text1,
        text2,
    });
}

export function showSuccess(
    text2: string = "Sucesso!"
) {
    Toast.show({
        type: ErrorEnum.SUCCESS.toastType,
        text1: ErrorEnum.SUCCESS.description,
        text2,
    });
}

export function showToast(
    type: string = "error",
    text1: string = "Erro",
    text2: string = "Não foi possível realizar a operação."
) {
    Toast.show({
        type,
        text1,
        text2,
    });
}