import { useFocusEffect, useNavigation } from '@react-navigation/core';
import * as React from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import { Text, Card } from 'react-native-elements';
import AtInternet, {
  ECommerceProduct,
} from '@westdeutscherrundfunkkoeln/react-native-at-internet';
import type { Product } from '../../constants';
import { DATA } from '../../constants';

const Item = (item: Product) => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate('Product', { item });
      }}
    >
      <Card>
        <Card.Title>{item.title}</Card.Title>
        <Card.Image
          source={{
            uri: item.image,
          }}
        />
        <View
          style={{
            flexDirection: 'row',
            alignContent: 'stretch',
            alignItems: 'stretch',
            justifyContent: 'space-between',
            flex: 1,
            width: '100%',
          }}
        >
          <Text>{item.stock} left in stock</Text>
          <Text>{`${item.price} ${item.currency}`}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

export default function Home() {
  const renderItem = ({ item }: { item: Product }) => <Item {...item} />;

  useFocusEffect(
    React.useCallback(() => {
      AtInternet.screen({ name: 'Home' });
      AtInternet.SalesInsights.Products.display(
        ...DATA.map((item) => {
          const product: ECommerceProduct = {
            id: item.id,
            $: item.title,
            pricetaxincluded: item.price,
            stock: item.stock > 0,
          };

          return product;
        })
      );
    }, [])
  );

  return (
    <FlatList
      data={DATA}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
}
