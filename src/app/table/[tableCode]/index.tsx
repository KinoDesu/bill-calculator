import { Background } from "@/components/background";
import { ThemedButton } from "@/components/button";
import { CustomNumberInput } from "@/components/customNumberInput";
import { OrderItemBox } from "@/components/orderItemBox";
import { SquareButton } from "@/components/squareButton";
import { useBaseStyle } from "@/contexts/StyleContext";
import { useTable } from "@/contexts/TableContext";
import { Client } from "@/models/Client";
import { ClientRegisterRequest } from "@/models/ClientRegisterRequest";
import { Order } from "@/models/Order";
import { TableRegisterRequest } from "@/models/TableRegisterRequest";
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
   Platform,
   ScrollView,
   StyleSheet,
   Text,
   TextInput,
   View,
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

   const [loading, setLoading] = useState({
      status: false,
      message: "",
   });

   const [menuOptionSelected, setMenuOptionSelected] = useState({
      changeName: false,
      editTable: false,
      cleanOrders: false,
   });

   const [filter, setFilter] = useState(false);
   const [menuVisible, setMenuVisible] = useState(true);
   const [menuNewNameInput, setMenuNewNameInput] = useState("");
   const [menuNewQuantityInput, setMenuNewQuantityInput] = useState(table?.clientQuantity!);

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

         setMenuNewNameInput("");
         setMenuNewQuantityInput(table.clientQuantity);

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
                           onPress={() => setFilter((filter) => !filter)}
                        />
                     </View>

                     <SquareButton
                        title="C"
                        onPress={() => console.log("Conta")}
                     />
                  </View>

               </View>
               {menuVisible && (
                  <View style={styles.menuOverlay}>
                     <View style={styles.menuContainer}>
                        <View style={styles.menuHeader}>
                           <SquareButton
                              title="X"
                              onPress={() => setMenuVisible((menuVisible) => !menuVisible)}
                           />
                           <SquareButton
                              title="S"
                              onPress={() => handleLeaveTable()}
                           />
                        </View>
                        <View style={styles.menuOptionContainer}>
                           <ThemedButton
                              title="Alterar seu nome"
                              onPress={() => {
                                 setMenuOptionSelected({
                                    changeName: !menuOptionSelected.changeName,
                                    editTable: false,
                                    cleanOrders: false,
                                 })
                              }}
                           />
                           {menuOptionSelected.changeName ? (
                              <View style={baseStyle.style.inputContainer}>
                                 <Text style={baseStyle.style.headerTitleStyle}>{sessionClientInfo?.name}</Text>
                                 <TextInput
                                    style={baseStyle.style.inputStyle}
                                    placeholder={`Novo nome`}
                                    placeholderTextColor={baseStyle.theme.inputPlaceHolder}
                                    value={menuNewNameInput}
                                    onChangeText={(value) => {
                                       setMenuNewNameInput((value));
                                    }}
                                 />
                                 <ThemedButton
                                    title="Salvar"
                                    onPress={async () => {
                                       setLoading({
                                          status: true,
                                          message: "Atualizando nome"
                                       })
                                       const request: ClientRegisterRequest = {
                                          clientId: sessionClientId,
                                          name: menuNewNameInput
                                       };

                                       await ClientService.updateClient(
                                          request,
                                          table?.tableId ?? ""
                                       );

                                       await loadTable();

                                       setMenuOptionSelected({
                                          changeName: false,
                                          editTable: false,
                                          cleanOrders: false,
                                       })
                                       setLoading({
                                          status: false,
                                          message: ""
                                       })
                                    }}
                                 />
                              </View>
                           ) : null
                           }
                        </View>
                        <View style={styles.menuOptionContainer}>
                           <ThemedButton
                              title="Editar mesa"
                              onPress={() => {
                                 setMenuOptionSelected({
                                    changeName: false,
                                    editTable: !menuOptionSelected.editTable,
                                    cleanOrders: false,
                                 })
                              }}
                           />
                           {menuOptionSelected.editTable ? (
                              <View style={baseStyle.style.inputContainer}>
                                 <Text style={baseStyle.style.headerTitleStyle}>{table.name}</Text>
                                 <TextInput
                                    style={baseStyle.style.inputStyle}
                                    placeholder={`Novo nome`}
                                    placeholderTextColor={baseStyle.theme.inputPlaceHolder}
                                    value={menuNewNameInput}
                                    onChangeText={(value) => {
                                       setMenuNewNameInput((value));
                                    }}
                                 />
                                 <CustomNumberInput
                                    label="Clientes"
                                    value={menuNewQuantityInput}
                                    max={20}
                                    min={table.clientQuantity}
                                    onChange={setMenuNewQuantityInput} />
                                 <ThemedButton
                                    title="Salvar"
                                    onPress={async () => {
                                       setLoading({
                                          status: true,
                                          message: "Atualizando mesa"
                                       })
                                       const request: TableRegisterRequest = {
                                          tableId: table.tableId!,
                                          clientQuantity: menuNewQuantityInput,
                                          tableName: menuNewNameInput,
                                       };

                                       await TableService.updateTable(
                                          request
                                       );

                                       await loadTable();

                                       setMenuOptionSelected({
                                          changeName: false,
                                          editTable: false,
                                          cleanOrders: false,
                                       })
                                       setLoading({
                                          status: false,
                                          message: ""
                                       })
                                    }}
                                 />
                              </View>
                           ) : null
                           }
                        </View>
                        <View style={styles.menuOptionContainer}>
                           <ThemedButton
                              title="Limpar pedidos"
                              onPress={() => {
                                 setMenuOptionSelected({
                                    changeName: false,
                                    editTable: false,
                                    cleanOrders: !menuOptionSelected.cleanOrders,
                                 })
                              }}
                           />
                           {menuOptionSelected.cleanOrders ? (
                              <View style={baseStyle.style.inputContainer}>
                                 <Text style={baseStyle.style.headerTitleStyle}>"excluir" para confirmar</Text>
                                 <TextInput
                                    style={baseStyle.style.inputStyle}
                                    placeholder={`"excluir"`}
                                    placeholderTextColor={baseStyle.theme.inputPlaceHolder}
                                    value={menuNewNameInput}
                                    onChangeText={(value) => {
                                       setMenuNewNameInput((value));
                                    }}
                                 />
                                 <ThemedButton
                                    title="Confirmar"
                                    onPress={async () => {

                                       if("excluir"!==menuNewNameInput){
                                          return
                                       }

                                       setLoading({
                                          status: true,
                                          message: "Excluindo pedidos"
                                       })
                                       await OrderService.deleteAllByTableId(
                                          table?.tableId ?? ""
                                       );

                                       await loadTable();

                                       setMenuOptionSelected({
                                          changeName: false,
                                          editTable: false,
                                          cleanOrders: false,
                                       })
                                       setLoading({
                                          status: false,
                                          message: ""
                                       })
                                    }}
                                 />
                              </View>
                           ) : null
                           }
                        </View>
                     </View>
                  </View>
               )}
            </View>



         )}
      </>
   );
}


const styles = StyleSheet.create({

   menuOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,

      backgroundColor: "rgba(0, 0, 0, 0.5)",

      alignItems: "center",
      justifyContent: "center",

      zIndex: 9999,
      elevation: 9999,
   },

   menuHeader: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      textAlign: "center"
   },

   menuContainer: {
      width: 350,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#18122b",
      padding: 10,
      gap: 15,

      borderWidth: 1,
      borderColor: "#ffffff",
      borderRadius: 10,
   },

   menuOptionContainer: {
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
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