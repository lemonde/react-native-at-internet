import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';

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

type AtInternetEventEmitter = {
  addListener(
    eventType: Events.trackerNeedsFirstLaunchApproval,
    listener: (body: { message: string }) => any,
    context?: any
  ): EmitterSubscription;
  addListener(
    eventType: Events.buildDidEnd,
    listener: (body: { message: string; status: number }) => any,
    context?: any
  ): EmitterSubscription;
  addListener(
    eventType: Events.sendDidEnd,
    listener: (body: { message: string; status: number }) => any,
    context?: any
  ): EmitterSubscription;
  addListener(
    eventType: Events.didCallPartner,
    listener: (body: { response: string }) => any,
    context?: any
  ): EmitterSubscription;
  addListener(
    eventType: Events.warningDidOccur,
    listener: (body: { message: string }) => any,
    context?: any
  ): EmitterSubscription;
  addListener(
    eventType: Events.saveDidEnd,
    listener: (body: { message: string }) => any,
    context?: any
  ): EmitterSubscription;
  addListener(
    eventType: Events.errorDidOccur,
    listener: (body: { message: string }) => any,
    context?: any
  ): EmitterSubscription;
};

type AtInternetType = {
  setLevel2(level2: number): Promise<true>;
  setConfigString(key: string, value: string | null): Promise<true>;
  setConfigBoolean(key: string, value: boolean | null): Promise<true>;
  setConfigInteger(key: string, value: number | null): Promise<true>;
  setConfigDouble(key: string, value: number | null): Promise<true>;

  setParamString(key: string, value: string | null): Promise<true>;
  setParamBoolean(key: string, value: boolean | null): Promise<true>;
  setParamInteger(key: string, value: number | null): Promise<true>;
  setParamDouble(key: string, value: number | null): Promise<true>;

  setProp(key: string, value: string, persistent: boolean): Promise<true>;

  visitor(visitorId: string, visitorCategory: string | null): Promise<true>;
  unsetVisitor(): Promise<true>;

  screen(parameters: HitParameters): Promise<true>;
  navigation(parameters: HitParameters): Promise<true>;
  download(parameters: HitParameters): Promise<true>;
  exit(parameters: HitParameters): Promise<true>;
  touch(parameters: HitParameters): Promise<true>;
  search(parameters: HitParameters): Promise<true>;

  enableListeners(): Promise<true>;
  disableListeners(): Promise<true>;

  Events: typeof Events;
  EventEmitter: Omit<NativeEventEmitter, 'addListener'> &
    AtInternetEventEmitter;
};

const { AtInternet } = NativeModules;
AtInternet.EventEmitter = new NativeEventEmitter(AtInternet);
AtInternet.Events = Events;

export default AtInternet as AtInternetType;
