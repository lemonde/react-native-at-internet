export type Product = {
  id: string;
  title: string;
  price: number;
  stock: number;
  image: string;
  currency: string;
};

export const DATA: Product[] = [
  {
    id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
    title: 'My Awesome Pencil',
    price: 3.99,
    stock: 244,
    currency: 'EUR',
    image:
      'https://images.unsplash.com/photo-1544724759-e2e242adb0db?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3459&q=80',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    title: 'My Awesome Furniture',
    price: 249.99,
    stock: 3,
    currency: 'EUR',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  },
  {
    id: '58694a0f-3da1-471f-bd96-145571e29d72',
    title: 'My Awesome Mug',
    price: 5.99,
    stock: 0,
    currency: 'EUR',
    image:
      'https://images.unsplash.com/photo-1512441294539-d74b41132524?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  },
];
