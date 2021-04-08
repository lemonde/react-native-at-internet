import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
  NativeModulesStatic,
  EventSubscriptionVendor,
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

type PrivacyVisitorMode = 'OptOut' | 'OptIn' | 'Exempt' | 'NoConsent' | 'None';
enum ePrivacyVisitorMode {
  OptOut = 'OptOut',
  OptIn = 'OptIn',
  Exempt = 'Exempt',
  NoConsent = 'NoConsent',
  None = 'None',
}
type PrivacyStorageFeature =
  | 'Campaign'
  | 'UserId'
  | 'Privacy'
  | 'IdentifiedVisitor'
  | 'Crash'
  | 'Lifecycle';
enum ePrivacyStorageFeature {
  Campaign = 'Campaign',
  UserId = 'UserId',
  Privacy = 'Privacy',
  IdentifiedVisitor = 'IdentifiedVisitor',
  Crash = 'Crash',
  Lifecycle = 'Lifecycle',
}

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

  setPrivacyVisitorOptout(): Promise<true>;
  setPrivacyVisitorOptin(): Promise<true>;
  setPrivacyVisitorMode(
    mode: string,
    parameters:
      | { duration?: number }
      | {
          duration?: number;
          visitorConsent: boolean;
          customUserIdValue?: string;
        }
  ): Promise<true>;
  getPrivacyVisitorMode(): Promise<PrivacyVisitorMode>;
  extendIncludeBuffer(mode: string, keys: string[]): Promise<true>;
  extendIncludeStorage(
    mode: string,
    feature: PrivacyStorageFeature[]
  ): Promise<true>;

  enableListeners(): Promise<true>;
  disableListeners(): Promise<true>;

  Privacy: {
    VisitorMode: typeof ePrivacyVisitorMode;
    StorageFeature: typeof ePrivacyStorageFeature;
    setVisitorOptout(): Promise<true>;
    setVisitorOptIn(): Promise<true>;
    setVisitorMode(
      mode: string,
      parameters?:
        | { duration?: number }
        | {
            duration?: number;
            visitorConsent: boolean;
            customUserIdValue?: string;
          }
    ): Promise<true>;
    getVisitorMode(): Promise<PrivacyVisitorMode>;
    extendIncludeBuffer(mode: string, ...keys: string[]): Promise<true>;
    extendIncludeStorage(
      mode: string,
      ...feature: PrivacyStorageFeature[]
    ): Promise<true>;
  };
  Events: typeof Events;
  EventEmitter: Omit<NativeEventEmitter, 'addListener'> &
    AtInternetEventEmitter;
};

const { AtInternet } = NativeModules as NativeModulesStatic & {
  AtInternet: AtInternetType & EventSubscriptionVendor;
};

const Module = AtInternet as Omit<
  AtInternetType,
  | 'setPrivacyVisitorOptout'
  | 'setPrivacyVisitorOptin'
  | 'setPrivacyVisitorMode'
  | 'getPrivacyVisitorMode'
  | 'extendIncludeBuffer'
  | 'extendIncludeStorage'
>;
Module.EventEmitter = new NativeEventEmitter(AtInternet);
Module.Events = Events;
Module.Privacy = {
  VisitorMode: ePrivacyVisitorMode,
  StorageFeature: ePrivacyStorageFeature,
  setVisitorOptout: AtInternet.setPrivacyVisitorOptout,
  setVisitorOptIn: AtInternet.setPrivacyVisitorOptin,
  extendIncludeBuffer: (mode, ...keys) =>
    AtInternet.extendIncludeBuffer(mode, keys),
  extendIncludeStorage: (mode, ...features) =>
    AtInternet.extendIncludeStorage(mode, features),
  getVisitorMode: async () => {
    const mode = await AtInternet.getPrivacyVisitorMode();
    console.log(mode);
    return (mode.charAt(0).toUpperCase() + mode.slice(1)) as PrivacyVisitorMode;
  },
  setVisitorMode: (mode, parameters = {}) =>
    AtInternet.setPrivacyVisitorMode(mode, parameters),
};

export default Module;
