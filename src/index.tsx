import { NativeModules } from 'react-native';

type AtInternetType = {
  multiply(a: number, b: number): Promise<number>;
};

const { AtInternet } = NativeModules;

export default AtInternet as AtInternetType;
