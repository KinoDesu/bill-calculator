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
            <Text style={baseStyle.style.orderName}
              numberOfLines={1}
              ellipsizeMode="tail">
              {order.name}
            </Text>

            <Text style={baseStyle.style.orderPrice}>
              {order.quantity} x {order.unitPrice.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </View>
          {!expanded ? (
            <Text style={baseStyle.style.textStyle}>+</Text>

          ) : (<Text style={baseStyle.style.textStyle}>-</Text>)
          }
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
