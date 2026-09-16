import { Background } from "@/components/background";
import { OrderItemBox } from "@/components/orderItemBox";
import { SquareButton } from "@/components/squareButton";
import { useBaseStyle } from "@/contexts/StyleContext";
import { Order } from "@/models/Order";
import { Table } from "@/models/Table";
import { OrderService } from "@/services/orderService";
import { TableService } from "@/services/tableService";
import {
   router,
   Stack,
   useLocalSearchParams,
} from "expo-router";
import { useEffect, useState } from "react";
import {
   ActivityIndicator,
   Platform,
   ScrollView,
   StyleSheet,
   Text,
   View,
} from "react-native";

export default function TableRoom() {
   const { tableCode } = useLocalSearchParams<{
      tableCode: string;
   }>();

   const baseStyle = useBaseStyle();

   const [table, setTable] = useState<Table | null>(null);
   const [orderList, setOrderList] = useState<Order[]>([]);

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

         OrderService.getOrdersByTableId(table.tableId!)
            .then((orderList) => {
               setOrderList(orderList);
               setLoading({
                  status: false,
                  message: "",
               });
            }).catch((error) => {
               console.error("Falha ao buscar pedidos: " + error);
            }).finally(() => {
               setLoading({
                  status: false,
                  message: "",
               });
            })

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

   const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

   return (
      <>
         <Stack.Screen
            options={{
               headerShown: !loading.status,
               headerStyle: baseStyle.style.headerStyle,
               headerTintColor: baseStyle.style.headerTintColor.tintColor,
               headerTitleStyle: baseStyle.style.headerTitleStyle,
               headerTitleAlign: baseStyle.style.headerTitleAlign.textAlign,
               title: table?.name ?? "",

               headerLeft: () => (
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
               ),

               headerRight: () => (
                  <View
                     style={{
                        marginRight: Platform.OS === "web" ? 25 : 0,
                     }}
                  >
                     <SquareButton
                        title="?"
                        href={{
                           pathname: "/table/[tableCode]/invite",
                           params: {
                              tableCode,
                           },
                        }}
                     />
                  </View>
               ),
            }}
         />

         {loading.status ? (
            <View
               style={[
                  baseStyle.style.app,
                  styles.loadingContainer,
               ]}
            >
               <ActivityIndicator
                  size="large"
                  color={baseStyle.theme.primary}
               />

               <Text
                  style={[
                     baseStyle.style.textStyle,
                     {
                        marginTop: 16,
                     },
                  ]}
               >
                  {loading.message}
               </Text>
            </View>
         ) : !table ? null : (
            <View style={baseStyle.style.app}>
               <Background type="home" />
               <View style={baseStyle.style.container}>
                  <ScrollView style={{
                     width: "100%",
                     paddingHorizontal: 15,
                     flex: 1,
                     ...(Platform.OS === "web" && {
                        scrollbarWidth: "thin",
                        scrollbarColor: `${baseStyle.theme.primary} transparent`,
                     })
                  }} contentContainerStyle={{
                     alignItems: "center",
                     flexGrow: 1,
                  }}>
                     <View style={[baseStyle.style.orderBoxContainer, { height: "100%", alignItems: "center", justifyContent: "center" }]}>
                        {orderList.length === 0 ? (
                           <Text style={[baseStyle.style.headerTitleStyle]}>
                              Nenhum pedido registrado.
                           </Text>
                        ) : (
                           orderList.map((order) => (

                              <OrderItemBox
                                 key={order.orderId}
                                 order={order}
                                 expanded={expandedOrderId === order.orderId}
                                 onPress={() => {
                                    setExpandedOrderId(
                                       expandedOrderId === order.orderId
                                          ? null
                                          : order.orderId
                                    );
                                 }}
                              />
                           ))
                        )}
                     </View>
                  </ScrollView>

                  <View style={styles.bottomMenuContainerStyle}>
                     <View style={styles.bottomMenuLeftContainerStyle}>
                        <SquareButton
                           title="P"
                           onPress={() => {
                              router.replace({
                                 pathname: "/table/[tableCode]/order/create",
                                 params: {
                                    tableCode,
                                 },
                              });
                           }}
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

const styles = StyleSheet.create({
   loadingContainer: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
   },

   bottomMenuContainerStyle: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      maxWidth: 400,
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 5,
      marginTop: 10,
   },

   bottomMenuLeftContainerStyle: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      gap: 10,
   },
});