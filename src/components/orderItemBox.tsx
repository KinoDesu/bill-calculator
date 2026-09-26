import { useBaseStyle } from "@/contexts/StyleContext";
import { useTable } from "@/contexts/TableContext";
import { Order } from "@/models/Order";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { SquareButton } from "./squareButton";

interface OrderItemBoxProps {
  order: Order;
  clientId?: string;
  expanded: boolean;
  onPress: () => void;
  onDelete: (orderId: string) => void;
  onCancel: () => void;
}

export function OrderItemBox({
  order,
  clientId,
  expanded,
  onPress,
  onDelete,
  onCancel,
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
    onDelete(order.orderId);
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

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={baseStyle.style.orderPrice}>
                {order.quantity} x{" "}
                {order.unitPrice.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}{" "}
                | {order.clients.length}
              </Text>

              <MaterialIcons
                name="group"
                size={18}
                color={baseStyle.theme.primary}
                style={{ marginLeft: 3, marginRight: 3 }}
              />

              <Text style={baseStyle.style.orderPrice}>
                {(
                  (order.unitPrice * order.quantity) /
                  order.clients.length
                ).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
            </View>
          </View>

          <View style={{ width: 36, alignItems: "center", justifyContent: "center" }}>
            <MaterialIcons name={expanded ? "arrow-drop-up" : "arrow-drop-down"} size={36} color={baseStyle.theme.primary} />
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
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {orderClient.clientId === clientId && (
                    <MaterialIcons
                      name="star"
                      size={16}
                      color={baseStyle.theme.primary}
                      style={{ marginRight: 4 }}
                    />
                  )}

                  <Text style={baseStyle.style.OrderClientName}>
                    {orderClient.clientName}
                  </Text>
                </View>
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
              style={{ maxWidth: 30, maxHeight: 30 }}
              title="E"
              icon="edit"
              iconSize={24}
              onPress={handleEdit}
            />

            <SquareButton
              style={{ maxWidth: 30, maxHeight: 30 }}
              title="D"
              icon="delete"
              iconSize={24}
              onPress={handleDelete}
            />
          </View>
        </View>
      )}
    </View>
  );
}