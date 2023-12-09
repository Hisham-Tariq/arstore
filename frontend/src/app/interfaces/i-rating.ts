export interface IRating {
  id?: string;
  productId: string;
  orderId: string;
  orderProductId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: any;
}
export interface IRatingWithProduct extends IRating {
  productName : string;

}
