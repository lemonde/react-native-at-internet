import * as React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-elements';
import AtInternet from '@westdeutscherrundfunkkoeln/react-native-at-internet';
import { useSelector } from 'react-redux';
import { DATA } from '../../constants';
import type { RootState } from '../../store';
import { useFocusEffect } from '@react-navigation/core';

const getProductById = (product_id: string) => {
  return DATA.filter((product) => product.id === product_id)[0] || null;
};

const getPrice = (products: string[]) =>
  products.reduce((accumulator, product_id) => {
    const product = getProductById(product_id);
    if (product) accumulator += product.price;
    return accumulator;
  }, 0);

const useTotalPrice = () => {
  const products = useSelector<RootState, string[]>((s) => s.cart.products);

  React.useEffect(() => {
    setPrice(getPrice(products));
  }, [products]);

  const [price, setPrice] = React.useState(getPrice(products));
  return price;
};

export default function Payment() {
  const [isPaying, setPaying] = React.useState(true);
  const totalPrice = useTotalPrice();
  const cart_id = useSelector<RootState, string>((s) => s.cart.id);
  const products = useSelector<RootState, string[]>((s) => s.cart.products);
  const uniqueProducts = useSelector<RootState, string[]>((s) =>
    s.cart.products.filter(
      (product_id, index, self) => self.indexOf(product_id) === index
    )
  );

  useFocusEffect(
    React.useCallback(() => {
      AtInternet.screen({ name: 'Payment', chapter1: 'Cart' });

      setTimeout(() => {
        setPaying(false);
        AtInternet.SalesInsights.Transaction.confirmation(
          {
            id: cart_id,
            currency: 'EUR',
            quantity: products.length,
            nbdistinctproduct: uniqueProducts.length,
            turnovertaxincluded: totalPrice,
          },
          {
            delivery: 'my transporter',
          },
          {
            mode: 'my payment mode',
          },
          {
            id: `r-${Math.random() * 100}`,
          },
          products.map((product_id) => {
            const product = getProductById(product_id);
            return {
              id: product.id,
              $: product.title,
              pricetaxincluded: product.price,
              stock: product.stock > 0,
            };
          })
        );
      }, 5000);

      return () => {
        setPaying(true);
      };
    }, [])
  );

  if (isPaying)
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="black" />
        <Text>Proceeding</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ flexDirection: 'row', justifyContent: 'center', margin: 20 }}
      >
        <Text h4>Payment validated</Text>
      </View>
      <View
        style={{ flexDirection: 'row', justifyContent: 'center', margin: 20 }}
      >
        <Text>Following delivery</Text>
      </View>
    </View>
  );
}
