import * as React from 'react';
import { useSelector } from 'react-redux';
import { ScrollView, TouchableOpacity } from 'react-native';
import type { DebugHit, RootState } from '../store';
import { ListItem, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/core';

export default function List() {
  const navigation = useNavigation();
  const hits = useSelector<RootState, Array<DebugHit>>((s) => s.debug);

  return (
    <ScrollView style={{ flex: 1 }}>
      {hits
        .sort((a, b) => {
          return b.ts - a.ts;
        })
        .map((hit, idx) => {
          const ts = new Date();
          ts.setTime(hit.ts);
          return (
            <ListItem
              key={idx}
              bottomDivider
              Component={TouchableOpacity}
              onPress={() => navigation.navigate('Description', { hit })}
            >
              <ListItem.Content>
                <Text>{hit.url}</Text>
                <Text>{ts.toUTCString()}</Text>
              </ListItem.Content>
              <ListItem.Chevron color="black" />
            </ListItem>
          );
        })}
    </ScrollView>
  );
}
