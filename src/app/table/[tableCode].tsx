import { Background } from "@/components/background";
import { SquareButton } from "@/components/squareButton";
import { useTheme } from "@/hooks/use-theme";
import { Table } from "@/models/Table";
import { api } from "@/services/api";
import { BaseStyle } from "@/styles/baseStyle";
import {
   router,
   Stack,
   useLocalSearchParams,
} from "expo-router";
import { useEffect, useState } from "react";
import {
   ActivityIndicator,
   Platform,
   StyleSheet,
   Text,
   View,
} from "react-native";

export default function TableRoom() {
   const theme = useTheme();
   const baseStyle = BaseStyle(theme);

   const { tableCode } = useLocalSearchParams<{
      tableCode: string;
   }>();

   const [table, setTable] = useState<Table | null>(null);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (!tableCode) {
         router.replace("/table/join");
         return;
      }

      getTableData(tableCode)
         .then((table) => {
            setTable(table);
         })
         .catch((error) => {
            console.error("Erro ao buscar mesa:", error);
            router.replace("/table/join");
         })
         .finally(() => {
            setLoading(false);
         });
   }, [tableCode]);

   return (
      <>
         <Stack.Screen
            options={{
               headerShown: !loading,
               headerStyle: baseStyle.headerStyle,
               headerTintColor: baseStyle.headerTintColor.tintColor,
               headerTitleStyle: baseStyle.headerTitleStyle,
               headerTitleAlign: baseStyle.headerTitleAlign.textAlign,
               title: table?.name ?? "",
               headerLeft: () => {
                  return (
                     <View
                        style={{
                           marginLeft: Platform.OS === "web" ? 25 : 0,
                        }}
                     >
                        <SquareButton
                           title="M"
                           onPress={() => console.log("Menu")}
                        />
                     </View>
                  )
               },
               headerRight: () => {
                  return (
                     <View
                        style={{
                           marginRight: Platform.OS === "web" ? 25 : 0,
                        }}
                     >
                        <SquareButton
                           title="?"
                           onPress={() => console.log("QR CODE")}
                        />
                     </View>
                  )
               },
            }}
         />

         {loading ? (
            <View
               style={[
                  baseStyle.app,
                  {
                     flex: 1,
                     alignItems: "center",
                     justifyContent: "center",
                  },
               ]}
            >
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
                  Entrando na mesa...
               </Text>
            </View>
         ) : !table ? (
            null
         ) : (
            <View style={baseStyle.app}>
               <Background type="home" />

               <View style={baseStyle.container}>
                  <View>

                  </View>
                  <View style={styles.bottomMenuContainerStyle}>
                     <View style={styles.bottomMenuLeftContainerStyle}>
                        <SquareButton
                           title="P"
                           onPress={() => console.log("Pedido")}
                        />
                        <SquareButton
                           title="F"
                           onPress={() => console.log("Filtro")}
                        />
                     </View>
                     <SquareButton
                        title="C"
                        onPress={() => console.log("Conta")}
                     />
                  </View>
               </View>
            </View>
         )}
      </>
   );
}

async function getTableData(tableCode: string): Promise<Table> {
   const response = await api.get<Table>(
      `/table/code/${tableCode}`,
      {
         timeout: 3000,
      }
   );

   if (!response.data) {
      throw new Error("Mesa não encontrada");
   }

   return response.data;
}

const styles = StyleSheet.create({

   bottomMenuContainerStyle: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      maxWidth: 400,
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 5
   },

   bottomMenuLeftContainerStyle: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: 10,
   }

});