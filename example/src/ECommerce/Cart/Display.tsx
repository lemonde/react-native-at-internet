import * as React from 'react';
import { View } from 'react-native';
import { useStore, useSelector } from 'react-redux';
import type { RootState, RootActions } from '../../store';
import { ListItem, Avatar, Button, Text } from 'react-native-elements';
import { DATA } from '../../constants';
import Dispatcher from '../../store/Dispatcher';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/core';
import AtInternet from '@westdeutscherrundfunkkoeln/react-native-at-internet';

const getProductById = (product_id: string) => {
  return DATA.filter((product) => product.id === product_id)[0] || null;
};

export default function Display() {
  const store = useStore<RootState, RootActions>();
  const dispatcher = new Dispatcher(store);
  const products = useSelector<RootState, string[]>((s) => s.cart.products);
  const uniqueProducts = useSelector<RootState, string[]>((s) =>
    s.cart.products.filter(
      (product_id, index, self) => self.indexOf(product_id) === index
    )
  );
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      AtInternet.screen({ name: 'Cart', chapter1: 'Cart' });
    }, [])
  );

  React.useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        uniqueProducts.length > 0 ? (
          <Button
            style={{ marginRight: 10 }}
            onPress={() => navigation.navigate('Checkout')}
            title={
              <>
                <Text style={{ color: 'white', marginRight: 10 }}>
                  Checkout
                </Text>
                <Ionicons color="white" name="basket" size={20} />
              </>
            }
          />
        ) : (
          <></>
        ),
    });
  }, [uniqueProducts, navigation]);

  return (
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
            </ListItem.Content>
            <Button
              title="Add"
              onPress={() => {
                dispatcher.Cart.addProduct(product);
              }}
            />
            <Button
              title="Remove"
              onPress={() => {
                dispatcher.Cart.removeProduct(product);
              }}
            />
          </ListItem>
        );
      })}
    </View>
  );
}
