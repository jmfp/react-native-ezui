package com.ezui

import com.facebook.react.bridge.ReactApplicationContext

class EzuiModule(reactContext: ReactApplicationContext) :
  NativeEzuiSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeEzuiSpec.NAME
  }
}
