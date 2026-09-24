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
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { KeyboardAwareScrollView, KeyboardToolbar } from "react-native-keyboard-controller";

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

  const [menuNewClientNameInput, setMenuNewClientNameInput] = useState("");
  const [menuNewTableNameInput, setMenuNewTableNameInput] = useState("");
  const [menuNewQuantityInput, setMenuNewQuantityInput] = useState(
    table.clientQuantity
  );
  const [menuCleanOrdersInput, setMenuCleanOrdersInput] = useState("");

  const hasSelectedMenuOption =
    Object.values(menuOptionSelected).some(Boolean);

  useEffect(() => {
    setMenuNewClientNameInput(sessionClientInfo?.name ?? "");
    setMenuNewTableNameInput(table.name);
    setMenuNewQuantityInput(table.clientQuantity);
    setMenuCleanOrdersInput("");
  }, [table, sessionClientInfo]);

  function closeMenuOption() {
    setMenuOptionSelected({
      changeName: false,
      editTable: false,
      cleanOrders: false,
    });
  }

  async function updateClientName() {
    const currentName = sessionClientInfo?.name ?? "";
    const newName = menuNewClientNameInput.trim();

    // Não houve alteração
    if (newName === currentName.trim()) {
      closeMenuOption();
      return;
    }

    // Não permite nome vazio
    if (!newName) {
      return;
    }

    try {
      onLoadingChange({
        status: true,
        message: "Atualizando nome",
      });

      const request: ClientRegisterRequest = {
        clientId: sessionClientId,
        name: newName,
      };

      await ClientService.updateClient(
        request,
        table.tableId ?? ""
      );

      await onRefresh();
      closeMenuOption();
    } catch (error) {
    } finally {
      onLoadingChange({
        status: false,
        message: "",
      });
    }
  }

  async function updateTable() {
    const newTableName = menuNewTableNameInput.trim();
    const currentTableName = table.name.trim();

    const nameChanged = newTableName !== currentTableName;
    const quantityChanged =
      menuNewQuantityInput !== table.clientQuantity;

    // Nenhuma alteração
    if (!nameChanged && !quantityChanged) {
      closeMenuOption();
      return;
    }

    // Não permite nome vazio
    if (!newTableName) {
      return;
    }

    try {
      onLoadingChange({
        status: true,
        message: "Atualizando mesa",
      });

      const request: TableRegisterRequest = {
        tableId: table.tableId ?? "",
        clientQuantity: menuNewQuantityInput,
        tableName: newTableName,
      };

      await TableService.updateTable(request);

      const tableCode = table.code ?? "";

      // Se somente o nome mudou ou a quantidade não diminuiu,
      // apenas atualiza os dados da mesa.
      if (!quantityChanged) {
        await onRefresh();
        closeMenuOption();
        return;
      }

      // Se a quantidade mudou, vai para o cadastro dos novos clientes.
      router.replace({
        pathname: "/table/[tableCode]/clients/create",
        params: {
          tableCode,
        },
      });
    } catch (error) {
    } finally {
      onLoadingChange({
        status: false,
        message: "",
      });
    }
  }

  async function cleanOrders() {
    if (menuCleanOrdersInput.trim() !== "excluir") {
      return;
    }

    try {
      onLoadingChange({
        status: true,
        message: "Excluindo pedidos",
      });

      await OrderService.deleteAllByTableId(table.tableId ?? "");
      await onRefresh();

      closeMenuOption();
      setMenuCleanOrdersInput("");
    } catch (error) {
    } finally {
      onLoadingChange({
        status: false,
        message: "",
      });
    }
  }

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.menuOverlay}>
      <KeyboardAwareScrollView
        bottomOffset={150}
        extraKeyboardSpace={200}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      >
        <View style={styles.menuContainer}>
          <View style={styles.menuHeader}>
            <SquareButton title="X" icon="close" onPress={onClose} />
            <SquareButton title="S" icon="logout" onPress={onLeaveTable} />
          </View>

          {(menuOptionSelected.changeName || !hasSelectedMenuOption) && (
            <View style={styles.menuOptionContainer}>
              <ThemedButton
                title="Alterar seu nome"
                onPress={() =>
                  setMenuOptionSelected({
                    changeName: !menuOptionSelected.changeName,
                    editTable: false,
                    cleanOrders: false,
                  })
                }
              />

              {menuOptionSelected.changeName && (
                <View style={styles.optionContent}>
                  <View
                    style={[
                      baseStyle.style.inputContainer,
                      styles.inputContainer,
                    ]}
                  >
                    <View style={styles.fullWidth}>
                      <Text style={baseStyle.style.headerTitleStyle}>
                        Nome Atual:
                      </Text>

                      <Text style={baseStyle.style.headerTitleStyle}>
                        {sessionClientInfo?.name}
                      </Text>
                    </View>

                    <TextInput
                      style={baseStyle.style.inputStyle}
                      placeholder="Novo nome"
                      placeholderTextColor={
                        baseStyle.theme.inputPlaceHolder
                      }
                      value={menuNewClientNameInput}
                      onChangeText={setMenuNewClientNameInput}
                      maxLength={15}
                    />
                  </View>

                  <ThemedButton
                    title="Salvar"
                    onPress={updateClientName}
                  />
                </View>
              )}
            </View>
          )}

          {(menuOptionSelected.editTable || !hasSelectedMenuOption) && (
            <View style={styles.menuOptionContainer}>
              <ThemedButton
                title="Editar mesa"
                onPress={() =>
                  setMenuOptionSelected({
                    changeName: false,
                    editTable: !menuOptionSelected.editTable,
                    cleanOrders: false,
                  })
                }
              />

              {menuOptionSelected.editTable && (
                <View style={styles.optionContent}>
                  <View
                    style={[
                      baseStyle.style.inputContainer,
                      styles.inputContainer,
                    ]}
                  >
                    <View style={styles.fullWidth}>
                      <Text style={baseStyle.style.headerTitleStyle}>
                        Nome Atual:
                      </Text>

                      <Text style={baseStyle.style.headerTitleStyle}>
                        {table.name}
                      </Text>
                    </View>

                    <TextInput
                      style={baseStyle.style.inputStyle}
                      placeholder="Novo nome"
                      placeholderTextColor={
                        baseStyle.theme.inputPlaceHolder
                      }
                      value={menuNewTableNameInput}
                      onChangeText={setMenuNewTableNameInput}
                      maxLength={15}
                    />

                    <CustomNumberInput
                      label="Clientes"
                      value={menuNewQuantityInput}
                      max={20}
                      min={table.clientQuantity}
                      onChange={setMenuNewQuantityInput}
                    />
                  </View>

                  <ThemedButton
                    title="Salvar"
                    onPress={updateTable}
                  />
                </View>
              )}
            </View>
          )}

          {(menuOptionSelected.cleanOrders || !hasSelectedMenuOption) && (
            <View style={styles.menuOptionContainer}>
              <ThemedButton
                title="Limpar pedidos"
                onPress={() =>
                  setMenuOptionSelected({
                    changeName: false,
                    editTable: false,
                    cleanOrders: !menuOptionSelected.cleanOrders,
                  })
                }
              />

              {menuOptionSelected.cleanOrders && (
                <View style={styles.optionContent}>
                  <View
                    style={[
                      baseStyle.style.inputContainer,
                      styles.inputContainer,
                    ]}
                  >
                    <View style={styles.fullWidth}>
                      <Text style={baseStyle.style.headerTitleStyle}>
                        Tem certeza?
                      </Text>

                      <Text style={baseStyle.style.headerTitleStyle}>
                        "excluir" para confirmar
                      </Text>
                    </View>

                    <TextInput
                      style={baseStyle.style.inputStyle}
                      placeholder='"excluir"'
                      placeholderTextColor={
                        baseStyle.theme.inputPlaceHolder
                      }
                      value={menuCleanOrdersInput}
                      onChangeText={setMenuCleanOrdersInput}
                      maxLength={15}
                    />
                  </View>

                  <ThemedButton
                    title="Confirmar"
                    onPress={cleanOrders}
                  />
                </View>
              )}
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
      <KeyboardToolbar opacity="00" />
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