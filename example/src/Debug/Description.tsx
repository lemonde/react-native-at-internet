import * as React from 'react';
import { useRoute } from '@react-navigation/core';
import type { DebugHit } from '../store';
import { ScrollView, StyleSheet } from 'react-native';
import { Text, ListItem } from 'react-native-elements';
import HTML from 'react-native-render-html';

function DebugItem({ name, value }: { name: string; value: string }) {
  let asObject: any;
  try {
    const obj = JSON.parse(value);

    if (typeof obj === 'object') {
      asObject = obj;
    }
  } finally {
    if (asObject) {
      return (
        <ListItem bottomDivider>
          <ListItem.Content style={styles.col}>
            <Text style={styles.name}>{name}</Text>
            <HTML
              source={{
                html: `<pre>${JSON.stringify(asObject, null, 2)}</pre>`,
              }}
            />
          </ListItem.Content>
        </ListItem>
      );
    }

    return (
      <ListItem bottomDivider>
        <ListItem.Content style={styles.row}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.code}>{value}</Text>
        </ListItem.Content>
      </ListItem>
    );
  }
}

export default function Description() {
  const route = useRoute();
  const { hit } = route.params as { hit: DebugHit };
  const ts = new Date();
  ts.setTime(hit.ts);
  return (
    <ScrollView style={styles.container}>
      <DebugItem name={'Sent to'} value={hit.url} />
      <DebugItem name={'Sent at'} value={ts.toUTCString()} />
      {Object.keys(hit.params).map((key) => {
        const value = hit.params[key];
        return <DebugItem name={key} value={value} key={key} />;
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  col: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  name: { fontWeight: 'bold' },
  code: { fontFamily: 'monospace' },
});
