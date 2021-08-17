import { useFocusEffect, useNavigation } from '@react-navigation/core';
import AtInternet from '@westdeutscherrundfunkkoeln/react-native-at-internet';
import * as React from 'react';
import { View } from 'react-native';
import { Avatar, Button, ListItem, Text } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { DATA } from '../../constants';
import type { RootState } from '../../store';

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

export default function Checkout() {
  const navigation = useNavigation();
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
      AtInternet.screen({ name: 'Checkout', chapter1: 'Cart' });
    }, [])
  );

  React.useEffect(() => {
    AtInternet.SalesInsights.Cart.payment(
      {
        id: cart_id,
        currency: 'EUR',
        quantity: products.length,
        nbdistinctproduct: uniqueProducts.length,
        turnovertaxincluded: totalPrice,
      },
      {
        delivery: 'my transporter',
      }
    );
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{ flexDirection: 'row', justifyContent: 'center', margin: 20 }}
      >
        <Text h4>Review your checkout</Text>
      </View>

      <View>
        {uniqueProducts.map((product_id) => {
          const product = getProductById(product_id);
          if (!product) return <></>;
          const qty = products.filter((id) => id === product_id).length;
          return (
            <ListItem key={product_id} bottomDivider>
              <Avatar source={{ uri: product.image }} />
              <ListItem.Content>
                <ListItem.Title>{product.title}</ListItem.Title>
                <ListItem.Subtitle>Quantity: {qty}</ListItem.Subtitle>
                <ListItem.Subtitle>
                  Unit price: {product.price} EUR
                </ListItem.Subtitle>
              </ListItem.Content>
              <View>
                <Text>Price</Text>
                <Text>{product.price * qty} EUR</Text>
              </View>
            </ListItem>
          );
        })}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: 20,
          }}
        >
          <Text h4>Total</Text>
          <Text>{totalPrice} EUR</Text>
        </View>
        <Button
          title="Validate"
          style={{ margin: 20 }}
          onPress={() => {
            AtInternet.SalesInsights.Cart.awaitingPayments(
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
            navigation.navigate('Payment');
          }}
        />
      </View>
    </View>
  );
}
