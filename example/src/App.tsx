import 'react-native-gesture-handler';
import 'react-native-url-polyfill/auto';
import * as React from 'react';
import AtInternet from '@lemonde/react-native-at-internet';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Store from './ECommerce/Store';
import Cart from './ECommerce/Cart';
import Privacy from './Privacy';
import Debug from './Debug';
import { Provider, useSelector } from 'react-redux';
import configureStore, { RootState } from './store';
import { ActivityIndicator, Platform } from 'react-native';
import { useRef } from 'react';

const { store } = configureStore();
const Tabs = createBottomTabNavigator();

AtInternet.enableListeners();

function App() {
  const [ready, setReady] = React.useState(false);
  const navigationRef = useRef<NavigationContainerRef>();
  const routeNameRef = useRef<string>();
  const debugLength = useSelector<RootState, number>((s) => s.debug.length);
  React.useEffect(() => {
    (async () => {
      await AtInternet.setConfigString('log', 'www');
      await AtInternet.setConfigString('logSSL', 'www');
      await AtInternet.setConfigBoolean('secure', true);
      await AtInternet.setConfigString('domain', 'example.org');
      await AtInternet.setConfigString('pixelPath', '/');
      await AtInternet.setConfigInteger('site', 123456);
      await AtInternet.setLevel2(1);

      await AtInternet.Privacy.setVisitorMode('OptIn');

      AtInternet.EventEmitter.removeAllListeners(AtInternet.Events.sendDidEnd);
      AtInternet.EventEmitter.removeAllListeners(
        AtInternet.Events.errorDidOccur
      );
      AtInternet.EventEmitter.addListener(AtInternet.Events.sendDidEnd, (e) => {
        const url = new URL(e.message);
        const params: { [key: string]: string } = {};

        for (let [key, value] of url.searchParams.entries()) {
          params[key] = value;
        }

        store.dispatch({
          type: 'DEBUG',
          payload: { url: url.href.replace(url.search, ''), params },
        });
      });
      AtInternet.EventEmitter.addListener(
        AtInternet.Events.errorDidOccur,
        console.warn
      );

      console.log('visitor_id', Platform.OS, await AtInternet.getUserId());
      setReady(true);
    })();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        {ready ? (
          <NavigationContainer
            ref={navigationRef}
            onReady={() => {
              routeNameRef.current = navigationRef.current.getCurrentRoute().name;
            }}
            onStateChange={async () => {
              const previousRouteName = routeNameRef.current;
              const currentRouteName = navigationRef.current.getCurrentRoute()
                .name;

              if (previousRouteName !== currentRouteName) {
                AtInternet.event({
                  name: 'react_navigation_state_changed',
                  data: { route: currentRouteName },
                });
              }

              routeNameRef.current = currentRouteName;
            }}
          >
            <Tabs.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName = 'alert-circle';

                  if (route.name === 'Store') {
                    iconName = focused ? 'basket' : 'basket-outline';
                  } else if (route.name === 'Cart') {
                    iconName = focused ? 'cart' : 'cart-outline';
                  } else if (route.name === 'Privacy') {
                    iconName = focused ? 'shield' : 'shield-outline';
                  } else if (route.name === 'Debug') {
                    iconName = focused ? 'code-slash' : 'code-slash-outline';
                  }

                  return <Ionicons name={iconName} size={size} color={color} />;
                },
              })}
            >
              <Tabs.Screen name="Store" component={Store} />
              <Tabs.Screen
                name="Cart"
                component={Cart}
                initialParams={{ screen: 'Home' }}
              />
              <Tabs.Screen name="Privacy" component={Privacy} />
              <Tabs.Screen
                name="Debug"
                component={Debug}
                options={{ tabBarBadge: debugLength }}
              />
            </Tabs.Navigator>
          </NavigationContainer>
        ) : (
          <SafeAreaView
            style={{
              flex: 1,
              alignContent: 'center',
              justifyContent: 'center',
              backgroundColor: '#fff',
            }}
          >
            <ActivityIndicator size="large" />
          </SafeAreaView>
        )}
      </SafeAreaProvider>
    </Provider>
  );
}

export default function Wrapper() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}
