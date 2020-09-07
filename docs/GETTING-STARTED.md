# Getting Started

## Track your first screen

```typescript
// src/App.tsx

import React, { useEffect } from 'react';
import AtInternet from '@lemonde/react-native-at-internet';

export default function App() {

    useEffect(() => {
        (async () => {
            await AtInternet.screen({
                name: 'Page name',
                chapter1: 'Chapter 1',
                chapter2: 'Chapter 2',
                chapter3: 'Chapter 3',
            });
        })();
    });

    // ...
}
```

## Track your first action

```typescript
// src/App.tsx

import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import AtInternet from '@lemonde/react-native-at-internet';

export default function App() {

    const trackPress = async () => {
        await AtInternet.touch({
            name: 'Your button'
        });
    };

    return (
        <>
            <TouchableOpacity
            onPress={trackPress}>
            <Text>
              Your button
            </Text>
          </TouchableOpacity>
        </>
    );
}
```

## Using custom configuration (subdomain, ssl, …)

All configuration keys are defined here : [Android][1] and [iOS][2]

> Please be sure to use the correct type (`setConfigString`, `setConfigBoolean`, `setConfigInteger` or `setConfigDouble`).

```typescript
// src/App.tsx

import React, { useEffect } from 'react';
import AtInternet from '@lemonde/react-native-at-internet';

export default function App() {
    useEffect(() => {
        (async () => {
            await AtInternet.setConfigString('log', 'sub');
            await AtInternet.setConfigString('logSSL', 'sub');
            await AtInternet.setConfigBoolean('secure', true);
            await AtInternet.setConfigString('domain', 'example.com');
            await AtInternet.setConfigString('pixelPath', '/hit.gif');
            await AtInternet.setConfigInteger('site', 123456);
                })();
    });

    // ...
}
```

## Listening to events

```typescript
// src/App.tsx

import React, { useEffect } from 'react';
import AtInternet from '@lemonde/react-native-at-internet';

export default function App() {
    useEffect(() => {
        (async () => {
            // iOS only 
            await AtInternet.enableListeners();
            
            AtInternet.EventEmitter.removeAllListeners(AtInternet.Events.buildDidEnd);
            
            AtInternet.EventEmitter.addListener(AtInternet.Events.buildDidEnd, ({message, status}) => {
                console.log('buildDidEnd', message, status);
            });
    });

    // ...
}
```

[1]: https://developers.atinternet-solutions.com/android-en/getting-started-android-en/configuration-android-en/#list-of-variables_2
[2]: https://developers.atinternet-solutions.com/apple-universal-en/getting-started-apple-universal-en/configuration-apple-universal-en/#list-of-variables_2