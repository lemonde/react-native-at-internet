import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { StyleSheet, Switch, View, Modal } from 'react-native';
import { Text, Button, Card } from 'react-native-elements';
import AtInternet from '@westdeutscherrundfunkkoeln/react-native-at-internet';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createStackNavigator();

export default function Privacy() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [optIn, setOptIn] = React.useState<boolean | undefined>();
  const [currentVisitorMode, setVisitorMode] = React.useState<
    'OptOut' | 'OptIn' | 'Exempt' | 'NoConsent' | 'None'
  >();

  React.useEffect(() => {
    (async () => {
      const visitorMode = await AtInternet.Privacy.getVisitorMode();
      setVisitorMode(visitorMode);
    })();
  }, []);

  React.useEffect(() => {
    switch (currentVisitorMode) {
      case 'OptIn': {
        setOptIn(true);
        break;
      }
      case 'OptOut': {
        setOptIn(false);
        break;
      }
      default: {
        setOptIn(undefined);
      }
    }
  }, [currentVisitorMode]);

  return (
    <Stack.Navigator>
      <Stack.Screen name="Privacy Settings">
        {() => {
          return (
            <View style={styles.Container}>
              <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                  setModalVisible(!modalVisible);
                }}
              >
                <SafeAreaView
                  style={{
                    ...styles.Container,
                    justifyContent: 'center',
                    backgroundColor: '#cccc',
                  }}
                >
                  <Card>
                    <Card.Title>Change Privacy Visitor Mode</Card.Title>
                    {['None', 'Exempt', 'OptIn', 'OptOut', 'NoConsent'].map(
                      (mode) => (
                        <Button
                          title={mode}
                          key={mode}
                          disabled={currentVisitorMode === mode}
                          style={{ marginVertical: 5 }}
                          onPress={() => {
                            (async () => {
                              await AtInternet.Privacy.setVisitorMode(mode);
                              setVisitorMode(
                                await AtInternet.Privacy.getVisitorMode()
                              );
                              setModalVisible(false);
                            })();
                          }}
                        />
                      )
                    )}
                  </Card>
                </SafeAreaView>
              </Modal>
              <View style={styles.Row}>
                <Text>Current visitor mode: </Text>
                <Text style={{ fontWeight: 'bold' }}>{currentVisitorMode}</Text>
              </View>
              <View style={styles.Row}>
                <Text>Toggle Opt-in/Opt-out: </Text>
                <Switch
                  value={optIn}
                  onValueChange={() => {
                    (async () => {
                      if (optIn) {
                        await AtInternet.Privacy.setVisitorOptout();
                      } else {
                        await AtInternet.Privacy.setVisitorOptIn();
                      }
                      setVisitorMode(await AtInternet.Privacy.getVisitorMode());

                      console.log(await AtInternet.Privacy.getVisitorMode());
                    })();
                  }}
                />
              </View>
              <View style={styles.Row}>
                <Button
                  title="Change mode manually"
                  onPress={() => setModalVisible(true)}
                />
              </View>
            </View>
          );
        }}
      </Stack.Screen>
    </Stack.Navigator>
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
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 20,
  },
});
