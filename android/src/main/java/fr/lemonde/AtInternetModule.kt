@file:Suppress("unused")

package fr.lemonde

import androidx.annotation.Nullable
import com.atinternet.tracker.ATInternet
import com.atinternet.tracker.Gesture
import com.atinternet.tracker.Screen
import com.atinternet.tracker.SetConfigCallback
import com.atinternet.tracker.Tracker
import com.atinternet.tracker.TrackerListener
import com.atinternet.tracker.Privacy
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Dynamic
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class AtInternetModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext), TrackerListener {

    private val tracker: Tracker = ATInternet.getInstance().defaultTracker

    override fun getName(): String {
        return "AtInternet"
    }

    @ReactMethod
    fun setLevel2(level2: Int, promise: Promise) {
        tracker.Context().level2 = level2
        promise.resolve(true)
    }

    @ReactMethod
    fun setConfigString(key: String, value: String, promise: Promise) {
        tracker.setConfig(
            key,
            value,
            SetConfigCallback() {
                promise.resolve(true)
            }
        )
    }

    @ReactMethod
    fun setConfigBoolean(key: String, value: Boolean, promise: Promise) {
        tracker.setConfig(
            key,
            value,
            SetConfigCallback() {
                promise.resolve(true)
            }
        )
    }

    @ReactMethod
    fun setConfigInteger(key: String, value: Int, promise: Promise) {
        tracker.setConfig(
            key,
            value,
            SetConfigCallback() {
                promise.resolve(true)
            }
        )
    }

    @ReactMethod
    fun setConfigDouble(key: String, value: Double, promise: Promise) {
        tracker.setConfig(
            key,
            value,
            SetConfigCallback() {
                promise.resolve(true)
            }
        )
    }

    @ReactMethod
    fun setParamString(key: String, value: String, promise: Promise) {
        tracker.setParam(key, value)
        promise.resolve(true)
    }

    @ReactMethod
    fun setParamBoolean(key: String, value: Boolean, promise: Promise) {
        tracker.setParam(key, value)
        promise.resolve(true)
    }

    @ReactMethod
    fun setParamInteger(key: String, value: Int, promise: Promise) {
        tracker.setParam(key, value)
        promise.resolve(true)
    }

    @ReactMethod
    fun setParamDouble(key: String, value: Double, promise: Promise) {
        tracker.setParam(key, value)
        promise.resolve(true)
    }

    @ReactMethod
    fun setProp(key: String, value: String, persistent: Boolean, promise: Promise) {
        tracker.setProp(key, value, persistent)
        promise.resolve(true)
    }

    @ReactMethod
    fun visitor(visitorId: Dynamic, visitorCategory: Dynamic, promise: Promise) {
        if (visitorCategory.isNull)
            tracker.IdentifiedVisitor().set(visitorId.asString())
        else
            tracker.IdentifiedVisitor().set(visitorId.asString(), visitorCategory.asString())

        promise.resolve(true)
    }

    @ReactMethod
    fun unsetVisitor(promise: Promise) {
        tracker.IdentifiedVisitor().unset()
        promise.resolve(true)
    }

    @ReactMethod
    fun screen(parameters: ReadableMap, promise: Promise) {
        if (!parameters.hasKey("name")) {
            promise.reject(Exception("Missing mandatory screen field \"name\""))
        }

        val screen: Screen = tracker.Screens().add()
        screen.name = parameters.getString("name")

        if (parameters.hasKey("chapter1"))
            screen.chapter1 = parameters.getString("chapter1")

        if (parameters.hasKey("chapter2"))
            screen.chapter2 = parameters.getString("chapter2")

        if (parameters.hasKey("chapter3"))
            screen.chapter3 = parameters.getString("chapter3")

        if (parameters.hasKey("level2"))
            screen.level2 = parameters.getInt("level2")

        if (parameters.hasKey("customObject"))
            screen.CustomObjects().add(parameters.getString("customObject"))

        screen.sendView()
        promise.resolve(true)
    }

    @ReactMethod
    fun navigation(parameters: ReadableMap, promise: Promise) {
        try {
            val gesture = gesture(parameters)
            gesture.sendNavigation()
            promise.resolve(true)
        } catch (e: Throwable) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun download(parameters: ReadableMap, promise: Promise) {
        try {
            val gesture = gesture(parameters)
            gesture.sendDownload()
            promise.resolve(true)
        } catch (e: Throwable) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun exit(parameters: ReadableMap, promise: Promise) {
        try {
            val gesture = gesture(parameters)
            gesture.sendExit()
            promise.resolve(true)
        } catch (e: Throwable) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun touch(parameters: ReadableMap, promise: Promise) {
        try {
            val gesture = gesture(parameters)
            gesture.sendTouch()
            promise.resolve(true)
        } catch (e: Throwable) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun search(parameters: ReadableMap, promise: Promise) {
        try {
            val gesture = gesture(parameters)
            gesture.sendSearch()
            promise.resolve(true)
        } catch (e: Throwable) {
            promise.reject(e)
        }
    }

    @ReactMethod
    fun setPrivacyVisitorOptout(promise: Promise) {
        Privacy.setVisitorOptOut()
        promise.resolve(true)
    }

    @ReactMethod
    fun setPrivacyVisitorOptin(promise: Promise) {
        Privacy.setVisitorOptIn()
        promise.resolve(true)
    }

    @ReactMethod
    fun setPrivacyVisitorMode(mode: String, parameters: ReadableMap, promise: Promise) {
        var visitorMode: Privacy.VisitorMode? = null

        when (mode) {
            "OptIn" -> visitorMode = Privacy.VisitorMode.OptIn
            "OptOut" -> visitorMode = Privacy.VisitorMode.OptOut
            "Exempt" -> visitorMode = Privacy.VisitorMode.Exempt
            "NoConsent" -> visitorMode = Privacy.VisitorMode.NoConsent
            "None" -> visitorMode = Privacy.VisitorMode.None
            else -> {
                promise.reject("INVALID_PRIVACY_MODE", "Invalid privacy mode $mode (could be OptIn, OptOut, Exempt, NoConsent or None)")
                return
            }
        }

        val hasDuration = parameters.hasKey("duration")
        val hasConsent = parameters.hasKey("visitorConsent")
        val hasCustomUserId = parameters.hasKey("customUserIdValue")

        if (hasConsent && hasCustomUserId && hasDuration) {
            Privacy.setVisitorMode(
                mode,
                parameters.getBoolean("visitorConsent"),
                parameters.getString("customUserIdValue"),
                parameters.getInt("duration")
            )
        } else if (hasConsent && hasCustomUserId) {
            Privacy.setVisitorMode(
                mode,
                parameters.getBoolean("visitorConsent"),
                parameters.getString("customUserIdValue")
            )
        } else if (hasDuration) {
            Privacy.setVisitorMode(
                visitorMode,
                parameters.getInt("duration")
            )
        } else {
            Privacy.setVisitorMode(
                visitorMode
            )
        }

        promise.resolve(true)
    }

    @ReactMethod
    fun getPrivacyVisitorMode(promise: Promise) {
        promise.resolve(Privacy.getVisitorModeString())
    }

    @ReactMethod
    fun extendIncludeBuffer(visitorMode: String, keys: Array<String>, promise: Promise) {
        Privacy.extendIncludeBufferForVisitorMode(visitorMode, *keys)
        promise.resolve(true)
    }

    @ReactMethod
    fun extendIncludeStorage(visitorMode: String, features: Array<String>, promise: Promise) {
        val privacyFeatures: List<Privacy.StorageFeature> = ArrayList()

        features.forEach {
            when (it) {
                "Campaign" -> privacyFeatures.plus(Privacy.StorageFeature.Campaign)
                "Crash" -> privacyFeatures.plus(Privacy.StorageFeature.Crash)
                "IdentifiedVisitor" -> privacyFeatures.plus(Privacy.StorageFeature.IdentifiedVisitor)
                "Lifecycle" -> privacyFeatures.plus(Privacy.StorageFeature.Lifecycle)
                "Privacy" -> privacyFeatures.plus(Privacy.StorageFeature.Privacy)
                "UserId" -> privacyFeatures.plus(Privacy.StorageFeature.UserId)
            }
        }

        Privacy.extendIncludeStorageForVisitorMode(visitorMode, *privacyFeatures.toTypedArray())
        promise.resolve(true)
    }

    fun gesture(parameters: ReadableMap): Gesture {
        if (!parameters.hasKey("name")) {
            throw Exception("Missing mandatory screen field \"name\"")
        }

        val gesture: Gesture = tracker.Gestures().add()
        gesture.name = parameters.getString("name")

        if (parameters.hasKey("chapter1"))
            gesture.chapter1 = parameters.getString("chapter1")

        if (parameters.hasKey("chapter2"))
            gesture.chapter2 = parameters.getString("chapter1")

        if (parameters.hasKey("chapter3"))
            gesture.chapter3 = parameters.getString("chapter3")

        if (parameters.hasKey("level2"))
            gesture.level2 = parameters.getInt("level2")

        if (parameters.hasKey("customObject"))
            gesture.CustomObjects().add(parameters.getString("customObject"))

        return gesture
    }

    @ReactMethod
    fun enableListeners(promise: Promise) {
        tracker.listener = this
        promise.resolve(true)
    }

    @ReactMethod
    fun disableListeners(promise: Promise) {
        tracker.setDefaultListener()
        promise.resolve(true)
    }

    private fun sendEvent(eventName: String, @Nullable params: WritableMap) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    override fun trackerNeedsFirstLaunchApproval(message: String?) {
        val params = Arguments.createMap()
        params.putString("message", message)
        sendEvent("trackerNeedsFirstLaunchApproval", params)
    }

    override fun buildDidEnd(status: TrackerListener.HitStatus?, message: String?) {
        val params = Arguments.createMap()
        params.putString("message", message)
        params.putString("status", status.toString())
        sendEvent("buildDidEnd", params)
    }

    override fun sendDidEnd(status: TrackerListener.HitStatus?, message: String?) {
        val params = Arguments.createMap()
        params.putString("message", message)
        params.putString("status", status.toString())
        sendEvent("sendDidEnd", params)
    }

    override fun didCallPartner(response: String?) {
        val params = Arguments.createMap()
        params.putString("response", response)
        sendEvent("didCallPartner", params)
    }

    override fun warningDidOccur(message: String?) {
        val params = Arguments.createMap()
        params.putString("message", message)
        sendEvent("warningDidOccur", params)
    }

    override fun saveDidEnd(message: String?) {
        val params = Arguments.createMap()
        params.putString("message", message)
        sendEvent("saveDidEnd", params)
    }

    override fun errorDidOccur(message: String?) {
        val params = Arguments.createMap()
        params.putString("message", message)
        sendEvent("errorDidOccur", params)
    }
}
