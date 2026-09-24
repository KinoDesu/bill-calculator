export type TableRegisterRequest = {
  tableId?:string,
  tableName: string;
  clientQuantity: number;
  redirectUrl?: string;
};