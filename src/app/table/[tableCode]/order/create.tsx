import { Background } from "@/components/background";
import ClientSelect from "@/components/ClientSelect";
import { CustomNumberInput } from "@/components/customNumberInput";
import { useTheme } from "@/hooks/use-theme";
import { Table } from "@/models/Table";
import { TableService } from "@/services/tableService";
import { BaseStyle } from "@/styles/baseStyle";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

export default function createOrder() {

    const { tableCode } = useLocalSearchParams<{
        tableCode: string;
    }>();

    const theme = useTheme();
    const baseStyle = BaseStyle(theme);

    const [itemName, setItemName] = useState("");
    const [itemPrice, setItemPrice] = useState("");
    const [itemQuantity, setItemQuantity] = useState(1);
    const [selectedClientIdList, setSelectedClientIdList] = useState([]);
       const [table, setTable] = useState<Table | null>(null);
    
       const [loading, setLoading] = useState({
          status: true,
          message: "",
       });

    useEffect(() => {
          if (table || !tableCode) {
             return;
          }
    
          loadTable();
       }, [table, tableCode]);
    
       async function loadTable() {
          try {
             setLoading({
                status: true,
                message: "Entrando na mesa",
             });
    
             const table = await TableService.getTableDataByCode(tableCode)
    
             setTable(table);
    
          } catch (error) {
             console.error(
                "Falha ao recuperar dados da mesa:",
                error
             );
    
             router.replace("/table/join");
          } finally {
             setLoading({
                status: false,
                message: "",
             });
          }
       }

    return (
        <View style={baseStyle.app}>
            <Background type="home" />
            <View style={baseStyle.container}>
                <View style={baseStyle.inputContainer}>
                    <TextInput
                        style={baseStyle.inputStyle}
                        placeholder="Item"
                        placeholderTextColor={theme.inputPlaceHolder}
                        onChangeText={setItemName}
                    />
                    <TextInput
                        style={baseStyle.inputStyle}
                        placeholder="Valor"
                        placeholderTextColor={theme.inputPlaceHolder}
                        onChangeText={setItemPrice}
                    />
                    <CustomNumberInput
                        label="Quantidade"
                        min={1}
                        max={100}
                        value={itemQuantity}
                        onChange={setItemQuantity}
                    />
                    <ClientSelect
                        tableId={table?.tableId??""}
                        value={selectedClientIdList}
                        onChange={setSelectedClientIdList}
                    />

                    <Text style={baseStyle.textStyle}>create order screen.</Text>
                </View>
            </View>
        </View>
    );
};