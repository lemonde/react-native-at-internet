import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/core';
import * as React from 'react';
import { Button, Card, Text } from 'react-native-elements';
import AtInternet from '@westdeutscherrundfunkkoeln/react-native-at-internet';
import { View, StyleSheet } from 'react-native';
import { useSelector, useStore } from 'react-redux';
import type { RootState, RootActions } from '../../store';
import Dispatcher from '../../store/Dispatcher';

export default function ProductPage() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const qty = useSelector(
    (state: RootState) =>
      state.cart.products.filter((id) => id === route.params?.item.id).length
  );
  const store = useStore<RootState, RootActions>();
  const dispatcher = new Dispatcher(store);

  useFocusEffect(
    React.useCallback(() => {
      // if (route.params?.item) {
      //   const item = route.params.item as Product;
      //   navigation.setOptions({ title: item.title });
      //   AtInternet.screen({ name: item.title, chapter1: 'Product' });
      //   AtInternet.SalesInsights.Products.displayPage({
      //     id: item.id,
      //     $: item.title,
      //     pricetaxincluded: item.price,
      //     stock: item.stock > 0,
      //   });
      // }

      // @ts-ignore
      AtInternet.event({ name: 'test.event', data: { some: 'data_1' } });
    }, [route, navigation])
  );

  return (
    <Card containerStyle={{ flex: 1, margin: 0 }}>
      <Card.Image source={{ uri: route.params.item.image }} />
      <Card.Title>{route.params.item.title}</Card.Title>
      <View style={styles.Row}>
        <Text>Price</Text>
        <Text>
          {route.params.item.price} {route.params.item.currency}
        </Text>
      </View>
      <Card.Divider />
      <View style={styles.Row}>
        <Text>In Stock</Text>
        <Text>{route.params.item.stock}</Text>
      </View>
      <Card.Divider />
      <View style={{ ...styles.Row }}>
        <Button
          title="Add to cart"
          onPress={() => {
            dispatcher.Cart.addProduct(route.params.item);
          }}
        />
        <Text h4>{qty}</Text>
        <Button
          title="Remove from cart"
          onPress={() => {
            dispatcher.Cart.removeProduct(route.params.item);
          }}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  Row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
});
