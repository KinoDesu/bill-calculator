import { OrderClient } from "@/models/OrderClient";
import { Table } from "@/models/Table";
import { createContext, useContext, useState } from "react";

type TableContextData = {
   table: Table | null;
   setTable: (table: Table) => void;
   orderClientList: OrderClient[];
   setOrderClientList: (clientList: OrderClient[]) => void;
};

const TableContext = createContext<TableContextData | undefined>(
   undefined
);

export function TableProvider({
   children,
}: {
   children: React.ReactNode;
}) {
   const [table, setTable] = useState<Table | null>(null);
   const [orderClientList, setOrderClientList] = useState<OrderClient[]>([]);

   return (
      <TableContext.Provider
         value={{
            table,
            setTable,
            orderClientList,
            setOrderClientList,
         }}
      >
         {children}
      </TableContext.Provider>
   );
}

export function useTable() {
   const context = useContext(TableContext);

   if (!context) {
      throw new Error(
         "useTable deve ser utilizado dentro de TableProvider"
      );
   }

   return context;
}