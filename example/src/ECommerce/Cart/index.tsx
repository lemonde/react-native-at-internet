import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Display from './Display';
import Checkout from './Checkout';
import Payment from './Payment';

const Stack = createStackNavigator();

export default function Cart() {
  return (
    <Stack.Navigator initialRouteName="Display">
      <Stack.Screen
        name="Display"
        component={Display}
        options={{ title: 'Cart' }}
      />
      <Stack.Screen name="Checkout" component={Checkout} />
      <Stack.Screen name="Payment" component={Payment} />
    </Stack.Navigator>
  );
}
