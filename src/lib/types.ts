export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  allergens: string[];
  is_available: boolean;
};

export type Category = {
  id: string;
  name: string;
  products: Product[];
};
