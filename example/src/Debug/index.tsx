import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import List from './List';
import Description from './Description';

const Stack = createStackNavigator();

export default function Cart() {
  return (
    <Stack.Navigator initialRouteName="List">
      <Stack.Screen
        name="List"
        component={List}
        options={{ title: 'List of sent hits' }}
      />
      <Stack.Screen name="Description" component={Description} />
    </Stack.Navigator>
  );
}
