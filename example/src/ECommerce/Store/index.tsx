import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import ProductPage from './Product';

const Stack = createStackNavigator();

export default function Store() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ title: 'My Awesome Store' }}
      />
      <Stack.Screen name="Product" component={ProductPage} />
    </Stack.Navigator>
  );
}
