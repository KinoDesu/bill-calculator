import { Background } from "@/components/background";
import { ThemedButton } from "@/components/button";
import { CustomNumberInput } from "@/components/customNumberInput";
import { environment } from "@/config/environment";
import { useTheme } from "@/hooks/use-theme";
import { ClientRegisterRequest } from "@/models/ClientRegisterRequest";
import { Table } from "@/models/Table";
import { TableRegisterRequest } from "@/models/TableRegisterRequest";
import { ClientService } from "@/services/clientService";
import { TableService } from "@/services/tableService";
import { BaseStyle } from "@/styles/baseStyle";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Text, TextInput, View } from "react-native";

export default function createTable() {
   const theme = useTheme();
   const baseStyle = BaseStyle(theme);

   const [clientQuantity, setClientQuantity] = useState(2);
   const [tableName, setTableName] = useState("");
   const [clientName, setClientName] = useState("");
   const [table, setTable] = useState<Table | null>(null);
   const [loading, setLoading] = useState(false);

   return (
      <View style={baseStyle.app}>
         <Background type="createTable" />
         <View style={baseStyle.container}>
            <View style={baseStyle.inputContainer}>
               <TextInput style={baseStyle.inputStyle} placeholder="Seu nome" placeholderTextColor={theme.inputPlaceHolder} onChangeText={(newValue) => { setClientName(newValue) }} />
               <TextInput style={baseStyle.inputStyle} placeholder="Nome da mesa" placeholderTextColor={theme.inputPlaceHolder} onChangeText={(newValue) => { setTableName(newValue) }} />
               <CustomNumberInput
                  label="Pessoas na mesa"
                  value={clientQuantity}
                  onChange={setClientQuantity}
                  min={2}
                  max={20}
               />

               {

                  loading ? (
                     <View>
                        <ActivityIndicator
                           size="large"
                           color={theme.primary}
                        />

                        <Text
                           style={[
                              baseStyle.textStyle,
                              {
                                 marginTop: 16,
                              },
                           ]}
                        >
                           Criando mesa...
                        </Text>
                     </View>
                  ) : null

               }

               <View style={baseStyle.buttonContainer}>
               </View>
            </View>
            <ThemedButton
               title="Registrar clientes"
               onPress={() => {

                  setLoading(true);
                  
                  const request: TableRegisterRequest = {
                     tableName: tableName,
                     clientQuantity: clientQuantity,
                     redirectUrl: environment.appDeepLink
                  }

                  TableService.registerTable(request)
                     .then((table) => {
                        setTable(table);

                        const request: ClientRegisterRequest = {
                           name: clientName.trim(),
                           bot: false,
                           clientId: null,
                        };

                        ClientService.registerClient(request, table.tableId!)
                           .then(() => {
                              setLoading(false);
                              router.replace({
                                 pathname: "/table/[tableCode]/clients/create",
                                 params: {
                                    tableCode: table.code!
                                 },
                              });
                           })
                           .catch((error) => {
                              console.error("Falha ao criar cliente: " + error);
                           });
                     })
                     .catch((error) => {
                        console.error("Falha ao criar mesa: " + error);
                     })
                     .finally(() => {
                        setLoading(false);
                     });;

               }}
            />
         </View>
      </View>
   );
};