import * as React from 'react';
import { StyleSheet, View, Text, Switch } from 'react-native';
import AtInternet from '@lemonde/react-native-at-internet';
import { Picker } from '@react-native-picker/picker';

AtInternet.enableListeners();

export default function App() {
  const [optIn, setOptIn] = React.useState<boolean>();
  const [currentVisitorMode, setVisitorMode] = React.useState<
    'OptOut' | 'OptIn' | 'Exempt' | 'NoConsent' | 'None'
  >();

  React.useEffect(() => {
    const listener = AtInternet.EventEmitter.addListener(
      AtInternet.Events.buildDidEnd,
      (e) => {
        console.log(e.message);
      }
    );
    return () => {
      listener.remove();
    };
  }, []);

  React.useEffect(() => {
    (async () => {
      await AtInternet.Privacy.extendIncludeBuffer(
        'Exempt',
        'stc/device',
        'ati',
        'atc'
      );
      await AtInternet.Privacy.extendIncludeStorage(
        'OptOut',
        'Campaign',
        'Crash'
      );
      setVisitorMode(await AtInternet.Privacy.getVisitorMode());
      // https://webhook.site/#!/96f68232-3178-42ec-a9a7-9f8d1aabee62
      await AtInternet.setConfigString('log', 'www');
      await AtInternet.setConfigString('logSSL', 'www');
      await AtInternet.setConfigBoolean('secure', true);
      await AtInternet.setConfigString('domain', 'webhook.site');
      await AtInternet.setConfigString(
        'pixelPath',
        '/96f68232-3178-42ec-a9a7-9f8d1aabee62'
      );
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

  React.useEffect(() => {
    currentVisitorMode &&
      AtInternet.touch({
        name: currentVisitorMode,
        chapter1: 'Chapter 1',
        chapter2: 'Chapter 2',
        chapter3: 'Chapter 3',
      });
  }, [currentVisitorMode]);

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 20 }}>AT Internet Example</Text>
      <Text>Toggle Opt-in/Opt-out</Text>
      <Switch
        value={optIn}
        onValueChange={() => {
          (async () => {
            if (optIn) {
              await AtInternet.Privacy.setVisitorOptout();
              setOptIn(false);
            } else {
              await AtInternet.Privacy.setVisitorOptIn();
              setOptIn(true);
            }
            setVisitorMode(await AtInternet.Privacy.getVisitorMode());
          })();
        }}
      />
      <Text>Current Visitor Mode: {currentVisitorMode}</Text>
      <Picker
        mode="dropdown"
        style={{ height: 50, width: 150 }}
        selectedValue={currentVisitorMode}
        onValueChange={(
          itemValue: 'OptOut' | 'OptIn' | 'Exempt' | 'NoConsent' | 'None'
        ) => {
          (async () => {
            await AtInternet.Privacy.setVisitorMode(itemValue);
            setVisitorMode(await AtInternet.Privacy.getVisitorMode());
          })();
        }}
      >
        <Picker.Item label="None" value="None" />
        <Picker.Item label="Exempt" value="Exempt" />
        <Picker.Item label="OptIn" value="OptIn" />
        <Picker.Item label="OptOut" value="OptOut" />
        <Picker.Item label="NoConsent" value="NoConsent" />
      </Picker>
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
