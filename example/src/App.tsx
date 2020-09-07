import * as React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import AtInternet from '@lemonde/react-native-at-internet';

AtInternet.enableListeners();
AtInternet.EventEmitter.removeAllListeners(AtInternet.Events.sendDidEnd);
AtInternet.EventEmitter.addListener(AtInternet.Events.buildDidEnd, (e) => {
  console.log(e.message);
});

export default function App() {
  React.useEffect(() => {
    (async () => {
      await AtInternet.setConfigString('log', 'subdomainWithoutSSL');
      await AtInternet.setConfigString('logSSL', 'subdomainWithSSL');
      await AtInternet.setConfigBoolean('secure', true);
      await AtInternet.setConfigString('domain', 'example.com');
      await AtInternet.setConfigString('pixelPath', '/path/to/hit');
      await AtInternet.setConfigInteger('site', 123456);
      await AtInternet.setLevel2(1);
      await AtInternet.setProp('x2', 'first custom param', true);
      await AtInternet.setProp('x3', 'second custom param', true);
      await AtInternet.setProp('x15', 'custom param (only next hit)', false);
      await AtInternet.screen({
        name: 'Page name',
        chapter1: 'Chapter 1',
        chapter2: 'Chapter 2',
        chapter3: 'Chapter 3',
        customObject: JSON.stringify({
          custom: 'object',
          with: { nested: 'properties' },
        }),
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <Text>Loaded</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
