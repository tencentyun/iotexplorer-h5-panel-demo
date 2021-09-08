import React, { useEffect, createContext, useState } from 'react';
import ReactDOM from 'react-dom';
import { DualmodePanel } from './DualmodePanel'
import { BleComboDualModeDeviceAdapter4H5 } from 'qcloud-iotexplorer-appdev-plugin-wificonf-blecombo/lib/protocols/BleComboDualMode';
const sdk = window.h5PanelSdk;
BleComboDualModeDeviceAdapter4H5.injectOptions({ appDevSdk: sdk.appDevSdk });

// h5 sdk升级后支持下面的 addAdapter
// sdk.blueToothAdapter.addAdapter(BleComboDualModeDeviceAdapter4H5, true);
sdk.blueToothAdapter._deviceAdapterFactoryMap[BleComboDualModeDeviceAdapter4H5.serviceId] = BleComboDualModeDeviceAdapter4H5;

console.log('sdk', sdk);
console.log(DualmodePanel);
function App() {
  return <DualmodePanel />;
}

ReactDOM.render(<App/>, document.getElementById('app'));