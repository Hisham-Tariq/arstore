export interface IStockHistory{
  id?: string;
  consumerPrice: number;
  retailerPrice: number;
  previousQuantity: number;
  totalQuantity: number;
  date : string;
}

export interface IStock extends IStockHistory{
  color: string,
  product: string,
  soldQuantity: number,
  discountPrice: number,
}
