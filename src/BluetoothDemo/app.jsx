import React from 'react';
import ReactDOM from 'react-dom';
import { BluetoothDemo } from './BluetoothDemo';

// 该demo为自定义蓝牙模式，请确保产品的通信方式为'BLE','WIFI-BLE','其他'中的一种
// 自定义蓝牙需要用户自行开发连接方式
// 用户开发非蓝牙相关面板请跳转DevicePanelDemo

function App() {
  return (
    <BluetoothDemo></BluetoothDemo>
  )
}

ReactDOM.render(<App />, document.getElementById('app'));
