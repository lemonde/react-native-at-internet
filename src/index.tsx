import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
  NativeModulesStatic,
  EventSubscriptionVendor,
  Platform,
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
  // START Configuration native methods
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
  // END Configuration native methods

  // START Visitor native methods
  visitor(visitorId: string, visitorCategory: string | null): Promise<true>;
  unsetVisitor(): Promise<true>;
  // END Visitor native methods

  // START Events native methods
  screen(parameters: HitParameters): Promise<true>;
  navigation(parameters: HitParameters): Promise<true>;
  download(parameters: HitParameters): Promise<true>;
  exit(parameters: HitParameters): Promise<true>;
  touch(parameters: HitParameters): Promise<true>;
  search(parameters: HitParameters): Promise<true>;

  // START Privacy native methods
  setPrivacyVisitorOptout(): Promise<PrivacyVisitorMode>;
  setPrivacyVisitorOptin(): Promise<PrivacyVisitorMode>;
  setPrivacyVisitorMode(
    mode: string,
    parameters:
      | { duration?: number }
      | {
          duration?: number;
          visitorConsent: boolean;
          customUserIdValue?: string;
        }
  ): Promise<PrivacyVisitorMode>;
  getPrivacyVisitorMode(): Promise<PrivacyVisitorMode>;
  extendIncludeBuffer(
    mode: PrivacyVisitorMode | string,
    keys: string[]
  ): Promise<true>;
  extendIncludeStorage(
    mode: PrivacyVisitorMode | string,
    feature: PrivacyStorageFeature[]
  ): Promise<true>;

  enableListeners(): Promise<true>;
  disableListeners(): Promise<true>;

  Privacy: {
    VisitorMode: typeof ePrivacyVisitorMode;
    StorageFeature: typeof ePrivacyStorageFeature;
    setVisitorOptout(): Promise<PrivacyVisitorMode>;
    setVisitorOptIn(): Promise<PrivacyVisitorMode>;
    setVisitorMode(
      mode: string,
      parameters?:
        | { duration?: number }
        | {
            duration?: number;
            visitorConsent: boolean;
            customUserIdValue?: string;
          }
    ): Promise<PrivacyVisitorMode>;
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

const sanitizeIOSMode = (string: string) => {
  if (Platform.OS === 'ios') {
    return `${string.charAt(0).toLowerCase()}${string.slice(1)}`;
  } else {
    return string;
  }
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
  setVisitorOptout: async () => {
    const newMode = await AtInternet.setPrivacyVisitorOptout();
    return (newMode.charAt(0).toUpperCase() +
      newMode.slice(1)) as PrivacyVisitorMode;
  },
  setVisitorOptIn: async () => {
    const newMode = await AtInternet.setPrivacyVisitorOptin();
    return (newMode.charAt(0).toUpperCase() +
      newMode.slice(1)) as PrivacyVisitorMode;
  },
  extendIncludeBuffer: (mode: PrivacyVisitorMode, ...keys) =>
    AtInternet.extendIncludeBuffer(
      sanitizeIOSMode(mode),
      keys.map(sanitizeIOSMode)
    ),
  extendIncludeStorage: (
    mode: PrivacyVisitorMode,
    ...features: PrivacyStorageFeature[]
  ) =>
    AtInternet.extendIncludeStorage(
      sanitizeIOSMode(mode),
      features.map(sanitizeIOSMode) as PrivacyStorageFeature[]
    ),
  getVisitorMode: async () => {
    const mode = await AtInternet.getPrivacyVisitorMode();
    return (mode.charAt(0).toUpperCase() + mode.slice(1)) as PrivacyVisitorMode;
  },
  setVisitorMode: async (mode, parameters = {}) => {
    const newMode = await AtInternet.setPrivacyVisitorMode(
      sanitizeIOSMode(mode),
      parameters
    );
    return (newMode.charAt(0).toUpperCase() +
      newMode.slice(1)) as PrivacyVisitorMode;
  },
};

export default Module;
