import { Background } from "@/components/background";
import { ThemedButton } from "@/components/button";
import ClientSelect from "@/components/ClientSelect";
import { useTable } from "@/contexts/TableContext";
import { useTheme } from "@/hooks/use-theme";
import { ClientRegisterRequest } from "@/models/ClientRegisterRequest";
import { ClientService } from "@/services/clientService";
import { TableService } from "@/services/tableService";
import { BaseStyle } from "@/styles/baseStyle";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";

export default function profile() {
   const { tableCode } = useLocalSearchParams<{
      tableCode: string;
   }>();

   const theme = useTheme();

  if (!theme.isReady) {
    return null; // não renderiza nada até saber o tema de verdade
  }

  const baseStyle = BaseStyle(theme);

   const [clientName, setClientName] = useState("");
   const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

   const { table, setTable } = useTable();

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

         const loadedTable =
            await TableService.getTableDataByCode(tableCode);

         setTable(loadedTable);
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

               <View style={{ width: "100%" }}>
                  <Text style={baseStyle.numberInputLabel}>
                     Altere seu nome:
                  </Text>
                  <TextInput
                     style={baseStyle.inputStyle}
                     placeholder="Seu nome"
                     placeholderTextColor={theme.inputPlaceHolder}
                     value={clientName}
                     onChangeText={setClientName}
                  />
               </View>

               {table?.tableId && (
                  <View style={{ width: "100%" }}>
                     <Text style={baseStyle.numberInputLabel}>
                        Selecione um cliente:
                     </Text>
                     <ClientSelect
                        tableId={table.tableId}
                        value={selectedClientId}
                        onChange={setSelectedClientId}
                     />
                  </View>
               )}

            </View>

            <ThemedButton
               title="Sentar-se à mesa"
               onPress={() => {

                  const request: ClientRegisterRequest = {
                     clientId: selectedClientId,
                     name: clientName.trim(),
                  };

                  ClientService.updateClient(request, table?.tableId!);
               }}
            />
         </View>
      </View>
   );
}