# Implementations

When using `import AtInternet from "@lemonde/react-native-at-internet"`.

## `AtInternet` type declaration :

### Members

#### **EventEmitter**

*NativeEventEmitter* (see [Android doc](https://reactnative.dev/docs/native-modules-android#sending-events-to-javascript) and [iOS doc](https://reactnative.dev/docs/native-modules-ios#sending-events-to-javascript))

#### **Events**: *enum*
  * `buildDidEnd`
  * `didCallPartner`
  * `errorDidOccur`
  * `saveDidEnd`
  * `sendDidEnd`
  * `trackerNeedsFirstLaunchApproval`
  * `warningDidOccur`

### Functions

#### Configuration

* **setLevel2**(`level2`: number): *Promise‹true›*
* **setConfigBoolean**(`key`: string, `value`: boolean | null): *Promise‹true›*
* **setConfigDouble**(`key`: string, `value`: number | null): *Promise‹true›*
* **setConfigInteger**(`key`: string, `value`: number | null): *Promise‹true›*
* **setConfigString**(`key`: string, `value`: string | null): *Promise‹true›*
* **setParamBoolean**(`key`: string, `value`: boolean | null): *Promise‹true›*
* **setParamDouble**(`key`: string, `value`: number | null): *Promise‹true›*
* **setParamInteger**(`key`: string, `value`: number | null): *Promise‹true›*
* **setParamString**(`key`: string, `value`: string | null): *Promise‹true›*
* **setProp**(`key`: string, `value`: string, `persistent`: boolean): *Promise‹true›*

##### iOS only

* **enableListeners**(): *Promise‹true›*: enable [Event](#EventEmitter) emitting
* **disableListeners**(): *Promise‹true›*: disable [Event](#EventEmitter) emitting

#### Hits

* **screen**(`parameters`: [HitParameters](#HitParameters)): *Promise‹true›*
* **touch**(`parameters`: [HitParameters](#HitParameters)): *Promise‹true›*
* **download**(`parameters`: [HitParameters](#HitParameters)): *Promise‹true›*
* **exit**(`parameters`: [HitParameters](#HitParameters)): *Promise‹true›*
* **navigation**(`parameters`: [HitParameters](#HitParameters)): *Promise‹true›*
* **search**(`parameters`: [HitParameters](#HitParameters)): *Promise‹true›*

#### Visitor context

* **visitor**(`visitorId`: string | number, `visitorCategory`: string | number | null): *Promise‹true›*
* **unsetVisitor**(): *Promise‹true›*

## Inner interfaces

### HitParameters
  * name : string
  * `optional` chapter1: string
  * `optional` chapter2: string
  * `optional` chapter3: string
  * `optional` customObject: string (*must be a object JSON string representation, eg.: return value of* `JSON.stringify({ my: 'custom object' })`)
  * `optional` level2: string

## Events Interfaces

* trackerNeedsFirstLaunchApproval
  ```typescript
  { message: string }
  ```

* buildDidEnd
  ```typescript
  { message: string, status: number }
  ```

* sendDidEnd
  ```typescript
  { message: string, status: number }
  ```

* didCallPartner
  ```typescript
  { response: string }
  ```

* warningDidOccur
  ```typescript
  { message: string }
  ```

* saveDidEnd
  ```typescript
  { message: string }
  ```

* errorDidOccur
  ```typescript
  { message: string }
  ```