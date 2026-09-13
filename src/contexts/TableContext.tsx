import { Table } from "@/models/Table";
import { createContext, useContext, useState } from "react";

type TableContextData = {
   table: Table | null;
   setTable: (table: Table) => void;
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

   return (
      <TableContext.Provider
         value={{
            table,
            setTable,
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