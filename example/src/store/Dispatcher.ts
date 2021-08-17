import type { StoreType } from '.';
import { DATA, Product } from '../constants';
import AtInternet from '@westdeutscherrundfunkkoeln/react-native-at-internet';

export default class Dispatcher {
  public Cart: Cart;

  constructor(store: StoreType) {
    this.Cart = new Cart(store);
  }
}

class Cart {
  constructor(private store: StoreType) {}

  public addProduct(product: Product) {
    const { products: cart_products, id: cart_id } = this.store.getState().cart;
    const products = [...cart_products];
    products.push(product.id);
    const uProducts = products.filter(
      (product_id, index, self) => self.indexOf(product_id) === index
    );

    this.store.dispatch({
      type: 'CART_ADD',
      payload: { product },
    });

    (async () => {
      await AtInternet.SalesInsights.Products.add(
        { id: cart_id },
        {
          id: product.id,
          $: product.title,
          pricetaxincluded: product.price,
          stock: product.stock > 0,
        }
      );
      await AtInternet.SalesInsights.Cart.update({
        id: cart_id,
        currency: 'EUR',
        quantity: products.length,
        nbdistinctproduct: uProducts.length,
        turnovertaxincluded: products.reduce((prev, product_id) => {
          const cart_product = getProductById(product_id);
          if (cart_product) prev += cart_product.price;
          return prev;
        }, 0),
      });
    })();
  }

  public removeProduct(product: Product) {
    const { products: cart_products, id: cart_id } = this.store.getState().cart;
    const products = [...cart_products];
    const index = products.indexOf(product.id);
    if (index > -1) {
      products.splice(index, 1);
    }
    const uProducts = products.filter(
      (product_id, i, self) => self.indexOf(product_id) === i
    );

    this.store.dispatch({
      type: 'CART_REMOVE',
      payload: { product },
    });

    (async () => {
      AtInternet.SalesInsights.Products.add(
        { id: cart_id },
        {
          id: product.id,
          $: product.title,
          pricetaxincluded: product.price,
          stock: product.stock > 0,
        }
      );
      AtInternet.SalesInsights.Cart.update({
        id: cart_id,
        currency: 'EUR',
        quantity: products.length,
        nbdistinctproduct: uProducts.length,
        turnovertaxincluded: products.reduce((prev, product_id) => {
          const cart_product = getProductById(product_id);
          if (cart_product) prev += cart_product.price;
          return prev;
        }, 0),
      });
    })();
  }
}

const getProductById = (product_id: string) => {
  return DATA.filter((product) => product.id === product_id)[0] || null;
};
