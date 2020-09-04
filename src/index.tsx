import { NativeModules, NativeEventEmitter } from 'react-native';

interface HitParameters {
  name: string;
  chapter1?: string;
  chapter2?: string;
  chapter3?: string;
  level2?: number;
  customObject?: string;
}

export enum Events {
  trackerNeedsFirstLaunchApproval = 'trackerNeedsFirstLaunchApproval',
  buildDidEnd = 'buildDidEnd',
  sendDidEnd = 'sendDidEnd',
  didCallPartner = 'didCallPartner',
  warningDidOccur = 'warningDidOccur',
  saveDidEnd = 'saveDidEnd',
  errorDidOccur = 'errorDidOccur',
}

type AtInternetType = {
  setConfigString(key: string, value: string | null): Promise<true>;
  setConfigBoolean(key: string, value: boolean | null): Promise<true>;
  setConfigInteger(key: string, value: number | null): Promise<true>;
  setConfigDouble(key: string, value: number | null): Promise<true>;
  setParamString(key: string, value: string | null): Promise<true>;
  setParamBoolean(key: string, value: boolean | null): Promise<true>;
  setParamInteger(key: string, value: number | null): Promise<true>;
  setParamDouble(key: string, value: number | null): Promise<true>;
  setProp(key: string, value: string, persistent: boolean): Promise<true>;
  setLevel2(level2: number): Promise<true>;
  visitor(
    visitorId: string | number,
    visitorCategory: string | number | null
  ): Promise<true>;
  unsetVisitor(): Promise<true>;
  screen(parameters: HitParameters): Promise<true>;
  navigation(parameters: HitParameters): Promise<true>;
  download(parameters: HitParameters): Promise<true>;
  exit(parameters: HitParameters): Promise<true>;
  touch(parameters: HitParameters): Promise<true>;
  search(parameters: HitParameters): Promise<true>;

  Events: typeof Events;
  EventEmitter: NativeEventEmitter;
};

const { AtInternet } = NativeModules;
AtInternet.EventEmitter = new NativeEventEmitter(AtInternet);
AtInternet.Events = Events;

export default AtInternet as AtInternetType;
