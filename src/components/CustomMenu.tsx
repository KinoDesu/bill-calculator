import { ThemedButton } from "@/components/button";
import { CustomNumberInput } from "@/components/customNumberInput";
import { SquareButton } from "@/components/squareButton";
import { useBaseStyle } from "@/contexts/StyleContext";
import { Client } from "@/models/Client";
import { ClientRegisterRequest } from "@/models/ClientRegisterRequest";
import { Table } from "@/models/Table";
import { TableRegisterRequest } from "@/models/TableRegisterRequest";
import { ClientService } from "@/services/clientService";
import { OrderService } from "@/services/orderService";
import { TableService } from "@/services/tableService";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export type MenuLoadingState = {
  status: boolean;
  message: string;
};

type CustomMenuProps = {
  visible: boolean;
  table: Table;
  sessionClientId: string;
  sessionClientInfo?: Client;
  onClose: () => void;
  onLeaveTable: () => void;
  onRefresh: () => Promise<void>;
  onLoadingChange: (loading: MenuLoadingState) => void;
};

export function CustomMenu({
  visible,
  table,
  sessionClientId,
  sessionClientInfo,
  onClose,
  onLeaveTable,
  onRefresh,
  onLoadingChange,
}: CustomMenuProps) {
  const baseStyle = useBaseStyle();
  const [menuOptionSelected, setMenuOptionSelected] = useState({
    changeName: false,
    editTable: false,
    cleanOrders: false,
  });
  const [menuNewNameInput, setMenuNewNameInput] = useState("");
  const [menuNewQuantityInput, setMenuNewQuantityInput] = useState(table.clientQuantity);
  const hasSelectedMenuOption = Object.values(menuOptionSelected).some(Boolean);

  useEffect(() => {
    setMenuNewNameInput("");
    setMenuNewQuantityInput(table.clientQuantity);
  }, [table]);

  function closeMenuOption() {
    setMenuOptionSelected({
      changeName: false,
      editTable: false,
      cleanOrders: false,
    });
  }

  async function updateClientName() {
    onLoadingChange({ status: true, message: "Atualizando nome" });
    const request: ClientRegisterRequest = {
      clientId: sessionClientId,
      name: menuNewNameInput,
    };
    await ClientService.updateClient(request, table.tableId ?? "");
    await onRefresh();
    closeMenuOption();
    onLoadingChange({ status: false, message: "" });
  }

  async function updateTable() {
    onLoadingChange({ status: true, message: "Atualizando mesa" });
    const request: TableRegisterRequest = {
      tableId: table.tableId ?? "",
      clientQuantity: menuNewQuantityInput,
      tableName: menuNewNameInput,
    };
    await TableService.updateTable(request);
    await onRefresh();
    closeMenuOption();
    onLoadingChange({ status: false, message: "" });
  }

  async function cleanOrders() {
    if (menuNewNameInput !== "excluir") {
      return;
    }
    onLoadingChange({ status: true, message: "Excluindo pedidos" });
    await OrderService.deleteAllByTableId(table.tableId ?? "");
    await onRefresh();
    closeMenuOption();
    onLoadingChange({ status: false, message: "" });
  }

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.menuOverlay}>
      <View style={styles.menuContainer}>
        <View style={styles.menuHeader}>
          <SquareButton title="X" onPress={onClose} />
          <SquareButton title="S" onPress={onLeaveTable} />
        </View>

        {(menuOptionSelected.changeName || !hasSelectedMenuOption) && (
          <View style={styles.menuOptionContainer}>
            <ThemedButton
              title="Alterar seu nome"
              onPress={() => setMenuOptionSelected({
                changeName: !menuOptionSelected.changeName,
                editTable: false,
                cleanOrders: false,
              })}
            />
            {menuOptionSelected.changeName && (
              <View style={styles.optionContent}>
                <View style={[baseStyle.style.inputContainer, styles.inputContainer]}>
                  <View style={styles.fullWidth}>
                    <Text style={baseStyle.style.headerTitleStyle}>Nome Atual:</Text>
                    <Text style={baseStyle.style.headerTitleStyle}>{sessionClientInfo?.name}</Text>
                  </View>
                  <TextInput
                    style={baseStyle.style.inputStyle}
                    placeholder="Novo nome"
                    placeholderTextColor={baseStyle.theme.inputPlaceHolder}
                    value={menuNewNameInput}
                    onChangeText={setMenuNewNameInput}
                  />
                </View>
                <ThemedButton title="Salvar" onPress={updateClientName} />
              </View>
            )}
          </View>
        )}

        {(menuOptionSelected.editTable || !hasSelectedMenuOption) && (
          <View style={styles.menuOptionContainer}>
            <ThemedButton
              title="Editar mesa"
              onPress={() => setMenuOptionSelected({
                changeName: false,
                editTable: !menuOptionSelected.editTable,
                cleanOrders: false,
              })}
            />
            {menuOptionSelected.editTable && (
              <View style={styles.optionContent}>
                <View style={[baseStyle.style.inputContainer, styles.inputContainer]}>
                  <View style={styles.fullWidth}>
                    <Text style={baseStyle.style.headerTitleStyle}>Nome Atual:</Text>
                    <Text style={baseStyle.style.headerTitleStyle}>{table.name}</Text>
                  </View>
                  <TextInput
                    style={baseStyle.style.inputStyle}
                    placeholder="Novo nome"
                    placeholderTextColor={baseStyle.theme.inputPlaceHolder}
                    value={menuNewNameInput}
                    onChangeText={setMenuNewNameInput}
                  />
                  <CustomNumberInput
                    label="Clientes"
                    value={menuNewQuantityInput}
                    max={20}
                    min={table.clientQuantity}
                    onChange={setMenuNewQuantityInput}
                  />
                </View>
                <ThemedButton title="Salvar" onPress={updateTable} />
              </View>
            )}
          </View>
        )}

        {(menuOptionSelected.cleanOrders || !hasSelectedMenuOption) && (
          <View style={styles.menuOptionContainer}>
            <ThemedButton
              title="Limpar pedidos"
              onPress={() => setMenuOptionSelected({
                changeName: false,
                editTable: false,
                cleanOrders: !menuOptionSelected.cleanOrders,
              })}
            />
            {menuOptionSelected.cleanOrders && (
              <View style={styles.optionContent}>
                <View style={[baseStyle.style.inputContainer, styles.inputContainer]}>
                  <View style={styles.fullWidth}>
                    <Text style={baseStyle.style.headerTitleStyle}>Tem certeza?</Text>
                    <Text style={baseStyle.style.headerTitleStyle}>"excluir" para confirmar</Text>
                  </View>
                  <TextInput
                    style={baseStyle.style.inputStyle}
                    placeholder={'"excluir"'}
                    placeholderTextColor={baseStyle.theme.inputPlaceHolder}
                    value={menuNewNameInput}
                    onChangeText={setMenuNewNameInput}
                  />
                </View>
                <ThemedButton title="Confirmar" onPress={cleanOrders} />
              </View>
            )}
          </View>
        )}
      </View>
    </View>
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
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
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
    alignItems: "center",
  },
  optionContent: {
    width: "100%",
    gap: 15,
  },
  inputContainer: {
    paddingVertical: 15,
  },
  fullWidth: {
    width: "100%",
  },
});