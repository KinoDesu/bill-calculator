import { useBaseStyle } from "@/contexts/StyleContext";
import { Order } from "@/models/Order";
import { Pressable, Text, View } from "react-native";

interface OrderItemBoxProps {
  order: Order;
  expanded: boolean;
  onPress: () => void;
}

export function OrderItemBox({
  order,
  expanded,
  onPress,
}: OrderItemBoxProps) {

  const baseStyle = useBaseStyle();

  return (
    <View style={baseStyle.style.orderBox}>
      <Pressable onPress={onPress}>
        <View style={baseStyle.style.orderBoxHeader}>
          <View style={baseStyle.style.orderInfo}>
            <View style={[{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between"
            }]}>
              <Text style={baseStyle.style.orderName}
                numberOfLines={1}
                ellipsizeMode="tail">
                {order.name}
              </Text>
              <Text style={[baseStyle.style.orderName, {textAlign: "right" }]}>
                {(order.unitPrice * order.quantity).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
            </View>

            <Text style={baseStyle.style.orderPrice}>
              {order.quantity} x {order.unitPrice.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })} | {order.clients.length} ☺ {" "}
              {((order.unitPrice * order.quantity) / order.clients.length).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>

          </View>
          <View style={{ width: 30 }}>
            {!expanded ? (
              <Text style={[[baseStyle.style.textStyle, { textAlign: "center", userSelect: "none" }]]}>+</Text>

            ) : (<Text style={[[baseStyle.style.textStyle, { textAlign: "center" }]]}>-</Text>)
            }
          </View>
        </View>
      </Pressable>

      {expanded && (
        <View style={baseStyle.style.orderDetails}>
          {
            order.clients.map((orderClient) => (
              <View key={orderClient.clientId} style={baseStyle.style.OrderClientContainer}>
                <Text
                  key={orderClient.clientId}
                  style={baseStyle.style.OrderClientName}
                >
                  {orderClient.clientName}
                </Text>
              </View>
            ))}
        </View>
      )}
    </View>
  );
}
