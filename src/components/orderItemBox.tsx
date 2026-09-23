import { useBaseStyle } from "@/contexts/StyleContext";
import { useTable } from "@/contexts/TableContext";
import { Order } from "@/models/Order";
import { router } from "expo-router";
import { Alert, Pressable, Text, View } from "react-native";
import { SquareButton } from "./squareButton";

interface OrderItemBoxProps {
  order: Order;
  clientId?: string;
  expanded: boolean;
  onPress: () => void;
  onDelete: (orderId: string) => void;
}

export function OrderItemBox({
  order,
  clientId,
  expanded,
  onPress,
  onDelete,
}: OrderItemBoxProps) {

  const baseStyle = useBaseStyle();
  const { table } = useTable();

  const handleEdit = () => {
    if (!table?.code) {
      return;
    }

    router.push({
      pathname: "/table/[tableCode]/order/edit",
      params: {
        tableCode: table.code,
        orderId: order.orderId,
      },
    });
  };

  const handleDelete = () => {
    Alert.alert(
      "Excluir pedido",
      `Tem certeza que deseja excluir "${order.name}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => onDelete(order.orderId),
        },
      ]
    );
  };

  return (
    <View style={baseStyle.style.orderBox}>
      <Pressable onPress={onPress}>
        <View style={baseStyle.style.orderBoxHeader}>
          <View style={baseStyle.style.orderInfo}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={baseStyle.style.orderName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {order.name}
              </Text>

              <Text
                style={[
                  baseStyle.style.orderName,
                  { textAlign: "right" },
                ]}
              >
                {(order.unitPrice * order.quantity).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
            </View>

            <Text style={baseStyle.style.orderPrice}>
              {order.quantity} x{" "}
              {order.unitPrice.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}{" "}
              | {order.clients.length} ☺{" "}
              {(
                (order.unitPrice * order.quantity) /
                order.clients.length
              ).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </View>

          <View style={{ width: 30 }}>
            {!expanded ? (
              <Text
                style={[
                  baseStyle.style.textStyle,
                  {
                    textAlign: "center",
                    userSelect: "none",
                  },
                ]}
              >
                +
              </Text>
            ) : (
              <Text
                style={[
                  baseStyle.style.textStyle,
                  { textAlign: "center" },
                ]}
              >
                -
              </Text>
            )}
          </View>
        </View>
      </Pressable>

      {expanded && (
        <View
          style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: baseStyle.theme.secondaryBackground,
            borderBottomRightRadius: 10,
            borderBottomLeftRadius: 10,
            padding: 10,
            borderTopWidth: 1,
            gap: 10,
          }}
        >
          <View style={baseStyle.style.orderDetails}>
            {order.clients.map((orderClient) => (
              <View
                key={orderClient.clientId}
                style={[
                  baseStyle.style.OrderClientContainer,
                  {
                    backgroundColor:
                      baseStyle.style.OrderClientContainer.backgroundColor + 20,
                  },
                  orderClient.clientId === clientId && {
                    backgroundColor:
                      baseStyle.style.OrderClientContainer.backgroundColor,
                  },
                ]}
              >
                <Text style={baseStyle.style.OrderClientName}>
                  {orderClient.clientId === clientId
                    ? `☺ ${orderClient.clientName}`
                    : orderClient.clientName}
                </Text>
              </View>
            ))}
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 15,
            }}
          >
            <SquareButton
              title="E"
              onPress={handleEdit}
            />

            <SquareButton
              title="D"
              onPress={handleDelete}
            />
          </View>
        </View>
      )}
    </View>
  );
}