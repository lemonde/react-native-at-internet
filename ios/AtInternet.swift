import Tracker

enum AtInternetError: Error {
    case missingMandatoryField(field: String)
}

@objc(AtInternet)
class AtInternet: RCTEventEmitter, TrackerDelegate {
    let tracker = ATInternet.sharedInstance.defaultTracker

    // MARK: RCTBridgeModule
    @objc override static func requiresMainQueueSetup() -> Bool {
        return true
    }
    // MARK: Bridged methods

    override func supportedEvents() -> [String]! {
        [
            "trackerNeedsFirstLaunchApproval",
            "buildDidEnd",
            "sendDidEnd",
            "didCallPartner",
            "warningDidOccur",
            "saveDidEnd",
            "errorDidOccur"
        ]
    }

    @objc(setLevel2:withResolver:withRejecter:)
    func setLevel2(level2: Int, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        self.tracker.context.level2 = level2
        resolve(true)
    }

    @objc(setConfigString:withValue:withResolver:withRejecter:)
    func setConfigString(
            key: String,
            value: String,
            resolve: @escaping RCTPromiseResolveBlock,
            reject: RCTPromiseRejectBlock
    ) {
        self.tracker.setConfig(key, value: value) { (_) -> Void in
            resolve(true)
        }
    }

    @objc(setConfigBoolean:withValue:withResolver:withRejecter:)
    func setConfigBoolean(
            key: String,
            value: Bool,
            resolve: @escaping RCTPromiseResolveBlock,
            reject: RCTPromiseRejectBlock
    ) {
        self.tracker.setConfig(key, value: value ? "true" : "false") { (_) -> Void in
            resolve(true)
        }
    }

    @objc(setConfigDouble:withValue:withResolver:withRejecter:)
    func setConfigDouble(
            key: String,
            value: Double,
            resolve: @escaping RCTPromiseResolveBlock,
            reject: RCTPromiseRejectBlock
    ) {
        self.tracker.setConfig(key, value: String(format: "%f", value)) { (_) -> Void in
            resolve(true)
        }
    }

    @objc(setConfigInteger:withValue:withResolver:withRejecter:)
    func setConfigInteger(
            key: String,
            value: Int,
            resolve: @escaping RCTPromiseResolveBlock,
            reject: RCTPromiseRejectBlock
    ) {
        self.tracker.setConfig(key, value: String(value)) { (_) -> Void in
            resolve(true)
        }
    }

    @objc(setParamString:withValue:withResolver:withRejecter:)
    func setParamString(
            key: String,
            value: String,
            resolve: @escaping RCTPromiseResolveBlock,
            reject: RCTPromiseRejectBlock
    ) {
        self.tracker.setParam(key, value: value)
        resolve(true)
    }

    @objc(setParamBoolean:withValue:withResolver:withRejecter:)
    func setParamBoolean(key: String, value: Bool, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        self.tracker.setParam(key, value: value)
        resolve(true)
    }

    @objc(setParamDouble:withValue:withResolver:withRejecter:)
    func setParamDouble(key: String, value: Double, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        self.tracker.setParam(key, value: value)
        resolve(true)
    }

    @objc(setParamInteger:withValue:withResolver:withRejecter:)
    func setParamInteger(key: String, value: Int, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        self.tracker.setParam(key, value: value)
        resolve(true)
    }

    @objc(setProp:withValue:isPersistent:withResolver:withRejecter:)
    func setProp(
            key: String,
            value: String,
            persistent: Bool,
            resolve: RCTPromiseResolveBlock,
            reject: RCTPromiseRejectBlock
    ) {
        self.tracker.setProp(key, value: value, persistent: persistent)
        resolve(true)
    }

    @objc(screen:withResolver:withRejecter:)
    func screen(parameters: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        if parameters["name"] == nil {
            reject(
                    "MISSING_PARAMETER",
                    "Missing mandatory screen field \"name\"",
                    AtInternetError.missingMandatoryField(field: "name")
            )
            return
        }

        let screen = self.tracker.screens.add()

        if let name = parameters["name"] as? String {
            screen.name = name
        }

        if let chapter1 = parameters["chapter1"] as? String {
            screen.chapter1 = chapter1
        }

        if let chapter2 = parameters["chapter2"] as? String {
            screen.chapter2 = chapter2
        }

        if let chapter3 = parameters["chapter3"] as? String {
            screen.chapter3 = chapter3
        }

        if let level2 = parameters["level2"] as? Int {
            screen.level2 = level2
        }

        if let customObject = parameters["customObject"] as? String {
            screen.customObjects.add(customObject)
        }

        screen.sendView()
        resolve(true)
    }

    @objc(setPrivacyVisitorOptout:withRejecter:)
    func setPrivacyVisitorOptout(
            resolve: RCTPromiseResolveBlock,
            reject: RCTPromiseRejectBlock
    ) {
        Privacy.setVisitorOptOut();
        resolve(true)
    }
    
    @objc(setPrivacyVisitorOptin:withRejecter:)
    func setPrivacyVisitorOptin(
            resolve: RCTPromiseResolveBlock,
            reject: RCTPromiseRejectBlock
    ) {
        Privacy.setVisitorOptIn();
        resolve(true)
    }
    
    @objc(setPrivacyVisitorMode:withParameters:withResolver:withRejecter:)
    func setPrivacyVisitorMode(
            mode: String,
            parameters: [String: Any],
            resolve: RCTPromiseResolveBlock,
            reject: RCTPromiseRejectBlock
    ) {
        let hasDuration = parameters.index(forKey: "duration") != nil;
        let hasConsent = parameters.index(forKey: "visitorConsent") != nil;
        let hasCustomUserId = parameters.index(forKey: "customUserIdValue") != nil;

        if (hasConsent && hasCustomUserId && hasDuration) {
            Privacy.setVisitorMode(
                mode,
                visitorConsent: parameters["visitorConsent"] as! Bool,
                customUserId: parameters["customUserIdValue"] as! String?,
                duration: parameters["duration"] as! Int
            )
        } else if (hasConsent && hasCustomUserId) {
            Privacy.setVisitorMode(
                mode,
                visitorConsent: parameters["visitorConsent"] as! Bool,
                customUserId: parameters["customUserIdValue"] as! String?
            )
        } else if (hasDuration) {
            Privacy.setVisitorMode(
                mode,
                duration: parameters["duration"] as! Int
            )
        } else {
            Privacy.setVisitorMode(mode);
        }
        
        resolve(true)
    }
    
    @objc(getPrivacyVisitorMode:withRejecter:)
    func getPrivacyVisitorMode(
            resolve: RCTPromiseResolveBlock,
            reject: RCTPromiseRejectBlock
    ) {
        resolve(Privacy.getVisitorModeString())
    }
    
    @objc(extendIncludeBuffer:withKeys:withResolver:withRejecter:)
    func extendIncludeBuffer(
            mode: String,
            keys: [String],
            resolve: RCTPromiseResolveBlock,
            reject: RCTPromiseRejectBlock
    ) {
        Privacy.extendIncludeBuffer(mode, keys: keys)
        resolve(true)
    }
    
    @objc(extendIncludeStorage:withFeatures:withResolver:withRejecter:)
    func extendIncludeStorage(
            mode: String,
            features: [String],
            resolve: RCTPromiseResolveBlock,
            reject: RCTPromiseRejectBlock
    ) {
        Privacy.extendIncludeStorage(mode, storageFeatureKeys: features);
        resolve(true)
    }

    func gesture(parameters: [String: Any]) throws -> Gesture {
        if parameters["name"] == nil {
            throw AtInternetError.missingMandatoryField(field: "name")
        }

        let gesture = self.tracker.gestures.add()

        if let name = parameters["name"] as? String {
            gesture.name = name
        }

        if let chapter1 = parameters["chapter1"] as? String {
            gesture.chapter1 = chapter1
        }

        if let chapter2 = parameters["chapter2"] as? String {
            gesture.chapter2 = chapter2
        }

        if let chapter3 = parameters["chapter3"] as? String {
            gesture.chapter3 = chapter3
        }

        if let level2 = parameters["level2"] as? Int {
            gesture.level2 = level2
        }

        if let customObject = parameters["customObject"] as? String {
            gesture.customObjects.add(customObject)
        }

        return gesture
    }

    @objc(navigation:withResolver:withRejecter:)
    func navigation(parameters: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        do {
            let gesture = try self.gesture(parameters: parameters)
            gesture.sendNavigation()
            resolve(true)
        } catch let error {
            reject("MISSING_PARAMETER", "Missing mandatory screen field \"name\"", error)
        }
    }

    @objc(download:withResolver:withRejecter:)
    func download(parameters: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        do {
            let gesture = try self.gesture(parameters: parameters)
            gesture.sendDownload()
            resolve(true)
        } catch let error {
            reject("MISSING_PARAMETER", "Missing mandatory screen field \"name\"", error)
        }
    }

    @objc(exit:withResolver:withRejecter:)
    func exit(parameters: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        do {
            let gesture = try self.gesture(parameters: parameters)
            gesture.sendExit()
            resolve(true)
        } catch let error {
            reject("MISSING_PARAMETER", "Missing mandatory screen field \"name\"", error)
        }
    }

    @objc(touch:withResolver:withRejecter:)
    func touch(parameters: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        do {
            let gesture = try self.gesture(parameters: parameters)
            gesture.sendTouch()
            resolve(true)
        } catch let error {
            reject("MISSING_PARAMETER", "Missing mandatory screen field \"name\"", error)
        }
    }

    @objc(search:withResolver:withRejecter:)
    func search(parameters: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        do {
            let gesture = try self.gesture(parameters: parameters)
            gesture.sendSearch()
            resolve(true)
        } catch let error {
            reject("MISSING_PARAMETER", "Missing mandatory screen field \"name\"", error)
        }
    }

    @objc(visitor:withCategory:withResolver:withRejecter:)
    func visitor(
            visitorId: String,
            visitorCategory: String?,
            resolve: RCTPromiseResolveBlock,
            reject: RCTPromiseRejectBlock
    ) {
        let category: String = visitorCategory ?? ""

        if category.isEmpty {
            self.tracker.identifiedVisitor.set(visitorId, visitorCategory: category)
        } else {
            self.tracker.identifiedVisitor.set(visitorId)
        }

        resolve(true)
    }

    @objc(unsetVisitor:withRejecter:)
    func unsetVisitor(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        self.tracker.identifiedVisitor.unset()
        resolve(true)
    }

    @objc(enableListeners:withRejecter:)
    func enableListeners(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        tracker.delegate = self
        resolve(true)
    }

    @objc(disableListeners:withRejecter:)
    func disableListeners(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        tracker.delegate = nil
        resolve(true)
    }

    public func trackerNeedsFirstLaunchApproval(_ message: String) {
        self.sendEvent(withName: "trackerNeedsFirstLaunchApproval", body: ["message": message])
    }

    public func buildDidEnd(_ status: HitStatus, message: String) {
        self.sendEvent(withName: "buildDidEnd", body: ["message": message, "status": status.rawValue])
    }

    public func sendDidEnd(_ status: HitStatus, message: String) {
        self.sendEvent(withName: "sendDidEnd", body: ["message": message, "status": status.rawValue])
    }

    public func saveDidEnd(_ message: String) {
        self.sendEvent(withName: "saveDidEnd", body: ["message": message])
    }

    public func didCallPartner(_ response: String) {
        self.sendEvent(withName: "didCallPartner", body: ["response": response])
    }

    public func warningDidOccur(_ message: String) {
        self.sendEvent(withName: "warningDidOccur", body: ["message": message])
    }

    public func errorDidOccur(_ message: String) {
        self.sendEvent(withName: "errorDidOccur", body: ["message": message])
    }
}
