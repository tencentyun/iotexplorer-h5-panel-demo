import React from 'react';
import ReactDOM from 'react-dom';
import { StanderdBleDemo } from './StanderdBleDemo';

import './style.less';

// 该demo为标准蓝牙模式,请确保产品的通信方式为'BLE','WIFI-BLE','其他'中的一种
// 用户开发非蓝牙相关面板请跳转DevicePanelDemo

function App() {
  return (
    <StanderdBleDemo></StanderdBleDemo>
  )
}

ReactDOM.render(<App />, document.getElementById('app'));
