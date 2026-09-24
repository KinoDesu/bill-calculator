import { Background } from "@/components/background";
import { CustomMenu } from "@/components/CustomMenu";
import { OrderItemBox } from "@/components/orderItemBox";
import { SquareButton } from "@/components/squareButton";
import { useBaseStyle } from "@/contexts/StyleContext";
import { useTable } from "@/contexts/TableContext";
import { Client } from "@/models/Client";
import { Order } from "@/models/Order";
import { ClientService } from "@/services/clientService";
import { OrderService } from "@/services/orderService";
import { TableService } from "@/services/tableService";
import { TableSessionService } from "@/services/tableSessionService";
import {
   router,
   Stack,
   useFocusEffect,
   useLocalSearchParams,
} from "expo-router";
import { useCallback, useState } from "react";
import {
   ActivityIndicator,
   Alert,
   Modal,
   Platform,
   ScrollView,
   StyleSheet,
   Text,
   View
} from "react-native";

export default function TableRoom() {
   const { tableCode } = useLocalSearchParams<{
      tableCode: string;
   }>();

   const baseStyle = useBaseStyle();

   const { table, setTable } = useTable();
   const [orderList, setOrderList] = useState<Order[]>([]);
   const [sessionClientId, setSessionClientId] = useState("");
   const [sessionClientInfo, setSessionClientInfo] = useState<Client>();
   const [showModal, setShowModal] = useState(false);

   const [loading, setLoading] = useState({
      status: false,
      message: "",
   });

   const [filter, setFilter] = useState(false);
   const [menuVisible, setMenuVisible] = useState(false);
   const displayedOrderList = filter
      ? orderList.filter((order) =>
         order.clients.some(
            (client) => client.clientId === sessionClientId
         )
      )
      : orderList;

   useFocusEffect(
      useCallback(() => {
         loadTable();


      }, [tableCode])
   );

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

         const session = await TableSessionService.get();
         if (!session || !session.clientId) {
            router.replace({
               pathname: "/table/[tableCode]/clients/join",
               params: {
                  tableCode: tableCode,
               },
            });
         } else {
            setSessionClientId(session.clientId);
            setSessionClientInfo(await getSessionClientInfo(session.clientId));
         }

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

   function handleLeaveTable(): void {
      router.replace({
         pathname: "/",
      });
   }

   const handleDeleteOrder = async (orderId: string) => {
      try {
         await OrderService.deleteById(orderId);

         setOrderList((currentOrders) =>
            currentOrders.filter((order) => order.orderId !== orderId)
         );
      } catch (error) {
         Alert.alert("Erro", "Não foi possível excluir o pedido.");
      } finally {
         setShowModal(false);
      }
   };

   function getSessionClientInfo(clientId: string): Promise<Client> {
      const client = ClientService.getClientById(clientId);
      return client.then((response) => response);
   }

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
                        icon="menu"
                        onPress={() => setMenuVisible((menuVisible) => !menuVisible)}
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
                        icon="qr-code-2"
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
                  baseStyle.style.loadingContainer,
               ]}
            >
               <ActivityIndicator
                  size="large"
                  color={baseStyle.theme.primary}
               />

               <Text style={baseStyle.style.textStyle}>
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
                        {displayedOrderList.length === 0 ? (
                           <Text style={[baseStyle.style.headerTitleStyle]}>
                              Nenhum pedido registrado.
                           </Text>
                        ) : (
                           displayedOrderList.map((order) => (

                              <OrderItemBox
                                 key={order.orderId}
                                 order={order}
                                 clientId={sessionClientId}
                                 expanded={expandedOrderId === order.orderId}
                                 onPress={() => {
                                    setExpandedOrderId(
                                       expandedOrderId === order.orderId
                                          ? null
                                          : order.orderId
                                    );
                                 }}
                                 onDelete={() => { setShowModal(true); }}
                                 onCancel={() => { setShowModal(false) }}
                              />
                           ))
                        )}
                     </View>
                  </ScrollView>

                  <View style={styles.bottomMenuContainerStyle}>
                     <View style={styles.bottomMenuLeftContainerStyle}>
                        <SquareButton
                           title="P"
                           icon="add-shopping-cart"
                           onPress={() => {
                              router.push({
                                 pathname: "/table/[tableCode]/order/create",
                                 params: {
                                    tableCode,
                                 },
                              });
                           }}
                        />

                        <SquareButton
                           title="F"
                           icon={filter ? "filter-alt-off" : "filter-alt"}
                           onPress={() => setFilter((filter) => !filter)}
                        />
                     </View>

                     <SquareButton
                        title="C"
                        icon="payments"
                        onPress={() => {
                           router.push({
                              pathname: "/table/[tableCode]/billing",
                              params: {
                                 tableCode,
                              },
                           });
                        }}
                     />
                  </View>

               </View>
               <CustomMenu
                  visible={menuVisible}
                  table={table}
                  sessionClientId={sessionClientId}
                  sessionClientInfo={sessionClientInfo}
                  onClose={() => setMenuVisible(false)}
                  onLeaveTable={handleLeaveTable}
                  onRefresh={loadTable}
                  onLoadingChange={setLoading}
               />

               <Modal
                  visible={showModal}
                  transparent
                  animationType="fade"
                  onRequestClose={() => { return }}
               >
                  <View
                     style={{
                        flex: 1,
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: 24,
                     }}
                  >
                     <View
                        style={{
                           width: "100%",
                           maxWidth: 350,
                           backgroundColor: baseStyle.theme.button,
                           borderRadius: 20,
                           padding: 24,
                           borderWidth: 1,
                           borderColor: baseStyle.theme.inputBorder
                        }}
                     >
                        <Text
                           style={[
                              baseStyle.style.headerTitleStyle,
                              {
                                 marginBottom: 12,
                              },
                           ]}
                        >
                           Tem certeza?
                        </Text>

                        <View style={{ display: "flex", flexDirection: "row", gap: 5, justifyContent: "space-between" }}>
                           <SquareButton
                              title="X"
                              icon="cancel"
                              onPress={() => { setShowModal(false); }}
                           />
                           <SquareButton
                              title="O"
                              icon="check-circle"
                              onPress={async () => handleDeleteOrder(expandedOrderId ?? "")}
                           />
                        </View>
                     </View>
                  </View>
               </Modal>
            </View>
         )}
      </>
   );
}


const styles = StyleSheet.create({
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