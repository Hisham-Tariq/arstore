// export interface IRating {
//   id?: string;
//   productId: string;
//   orderId: string;
//   orderProductId: string;
//   userId: string;
//   userName: string;
//   rating: number;
//   comment: string;
//   createdAt: any;
// }
// export interface IRatingWithProduct extends IRating {
//   productName : string;
//
// }

export interface Review {
  userId: string;
  userName: string;
  stars: number;
  comment: string;
  createdAt: any;
  avgRating: number;
  ratings: IRating[];
}

export interface IRating {
  id: string;
  productId: string;
  createdAt: any;
  avgRating: number;
  totalReviews: number;
  reviews: Review[];
}
