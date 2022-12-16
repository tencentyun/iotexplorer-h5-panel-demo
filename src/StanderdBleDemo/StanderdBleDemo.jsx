import React, { useEffect, createContext, useState } from 'react';
import { DevicePanel } from './DevicePanel';
const sdk = window.h5PanelSdk;
import './style.less';

// 该demo为标准蓝牙模式,请确保产品的通信方式为'BLE','WIFI-BLE','其他'中的一种
// 用户开发非蓝牙相关面板请跳转DevicePanelDemo

export const ResourceNameContext = createContext(null);
export function StanderdBleDemo() {
  const isBluetoothDevice = true;
  const isDev = process.env.NODE_ENV !== 'production';
  console.log(sdk,'sdk');
  //新旧链接的兼容
  const hasScf = (/\/scf\//).test(location.href)
  let basename = isDev ? `${hasScf ? '/scf' : ''}/h5panel/developing` : `${hasScf ? '/scf' : ''}/h5panel`;
  console.log('----basename----', basename);

  // 蓝牙的调试模式下路由需要加上 /live
  if (isBluetoothDevice && isDev) {
    basename += '/live';
  }

  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    sdk.sdkReady().then(() => setSdkReady(true));
    sdk.on('appShow', () => console.log('appShow'))
      .on('appHide', () => console.log('appHide'))
      .on('pageShow', () => console.log('pageShow'))
      .on('pageHide', () => console.log('pageHide'));
  }, []);

  return !sdkReady ? <div>loading...</div> : <DevicePanel/>
}
