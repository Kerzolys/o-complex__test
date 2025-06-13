export type TOrder = {
  phone: string;
  cart: TProductOrder[];
};

export type TProductOrder = {
  id: number;
  quantity: number;
};

export type TReview = {
  id: number;
  text: string;
};

export type TProduct = {
  id: number;
  image_url: string;
  title: string;
  description: string;
  price: number;
};
