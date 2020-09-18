<div align="center">

# react-native-at-internet

[![GitHub license](https://img.shields.io/github/license/lemonde/react-native-at-internet)](https://github.com/lemonde/react-native-at-internet/blob/master/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/lemonde/react-native-at-internet)](https://github.com/lemonde/react-native-at-internet/stargazers)
![Travis (.com)](https://img.shields.io/travis/com/lemonde/react-native-at-internet)
![visitor badge](https://visitor-badge.laobi.icu/badge?page_id=lemonde.react-native-at-internet)

Implementation of ATInternet Android & iOS packages

</div>


## Getting started

### Disclaimer

This is a simple and unofficial implementation of AtInternet SDK for [Android][1] and [iOS][2],
it does not implement all methods nor functionalities of native modules,
feel free to **open a pull request** and complete this.

### Installation

```sh
npm install @lemonde/react-native-at-internet
```

### Prerequisite (Android only)

To be able to use AT Internet’s SDK, it is NECESSARY to add the following authorisations in your `AndroidManifest` file, just before <application> tag:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="com.example">
    <uses-permission android:name="android.permission.INTERNET"/>
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>

    ...
</manifest>
```

## Usage

```js
import AtInternet from "@lemonde/react-native-at-internet";

// ...

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
```

For further documentation see the [implementations](docs/IMPLEMENTATIONS.md) and the [getting started](docs/GETTING-STARTED.md).

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

[1]: https://developers.atinternet-solutions.com/android-en/getting-started-android-en/operating-principle-android-en/
[2]: https://developers.atinternet-solutions.com/apple-universal-en/getting-started-apple-universal-en/operating-principle-apple-universal-en/
