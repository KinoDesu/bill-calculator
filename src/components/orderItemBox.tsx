import { useTheme } from "@/hooks/use-theme";
import { Order } from "@/models/Order";
import { BaseStyle } from "@/styles/baseStyle";
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
  const theme = useTheme();

  if (!theme.isReady) {
    return null; // não renderiza nada até saber o tema de verdade
  }

  const baseStyle = BaseStyle(theme);

  return (
    <View style={baseStyle.orderBox}>
      <Pressable onPress={onPress}>
        <View style={baseStyle.orderBoxHeader}>
          <View style={baseStyle.orderInfo}>
            <Text style={baseStyle.orderName}
              numberOfLines={1}
              ellipsizeMode="tail">
              {order.name}
            </Text>

            <Text style={baseStyle.orderPrice}>
              {order.quantity} x {order.unitPrice.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </Text>
          </View>
          {!expanded ? (
            <Text style={baseStyle.textStyle}>+</Text>

          ) : (<Text style={baseStyle.textStyle}>-</Text>)
          }
        </View>
      </Pressable>

      {expanded && (
        <View style={baseStyle.orderDetails}>
          {
            order.clients.map((orderClient) => (
              <View key={orderClient.clientId} style={baseStyle.OrderClientContainer}>
                <Text
                  key={orderClient.clientId}
                  style={baseStyle.OrderClientName}
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
