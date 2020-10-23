import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { DevicePanel } from './DevicePanel';
import { SearchPage, PanelPage, DemoBluetoothDeviceAdapter } from './StandardBleDemo';
import sdk from 'qcloud-iotexplorer-h5-panel-sdk';
//sdk.blueToothAdapter.addAdapter(DemoBluetoothDeviceAdapter);

import './style.less';

function App() {
  const isBluetoothDevice = true;
  const isDev = process.env.NODE_ENV !== 'production';
  //新旧链接的兼容
  const hasScf = (/\/scf\//).test(location.href)

  let basename = isDev ? `${hasScf ? '/scf' : ''}/h5panel/developing` : `${hasScf ? '/scf' : ''}/h5panel`;

  console.log('----basename----', basename);
  // 蓝牙的调试模式下路由需要加上 /live
  if (isBluetoothDevice && isDev) {
    basename += '/live';
  }

  useEffect(() => {
    sdk.on('appShow', () => console.log('appShow'))
       .on('appHide', () => console.log('appHide'))
       .on('pageShow', () => console.log('pageShow'))
       .on('pageHide', () => console.log('pageHide'));
  }, []);

  return (
    <Router basename={basename}>
      <div>
        <Switch>
          {/* 蓝牙搜索页 */}
          <Route path="/bluetooth-search">
            <SearchPage />
          </Route>
          <Route path="/">
            <DevicePanel />
          </Route>
        </Switch>
      </div>
    </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('app'));
