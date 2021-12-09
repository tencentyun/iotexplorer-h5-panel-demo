import React, { useEffect, createContext, useState } from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";
import { DevicePanel } from './DevicePanel';
import { SearchPage } from './StandardBleDemo';
import sdk from 'qcloud-iotexplorer-h5-panel-sdk';
import { AddFile, ErrorPage, FileManage } from './fileManageDemo';
//sdk.blueToothAdapter.addAdapter(DemoBluetoothDeviceAdapter);
import './style.less';

export const ResourceNameContext = createContext(null);
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
	const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
		sdk.sdkReady().then(() =>  setSdkReady(true));
    sdk.on('appShow', () => console.log('appShow'))
      .on('appHide', () => console.log('appHide'))
      .on('pageShow', () => console.log('pageShow'))
      .on('pageHide', () => console.log('pageHide'));
  }, []);
  const [ResourceInfo, setResourceInfo] = useState({
    ResourceName: '',
    upDateResourceName: (Resource) => handleUpdateResource(Resource)
  });

  const handleUpdateResource = (Resource) => {
    setResourceInfo({
      ResourceName: Resource,
      upDateResourceName: handleUpdateResource
    })
  }
  return (
    !sdkReady ? <div > loading...</div >  : (
    <ResourceNameContext.Provider value={ResourceInfo}>
    <Router basename={basename}>
      <div>
        <Switch>
          {/* 蓝牙搜索页 */}
          <Route path="/bluetooth-search">
            <SearchPage />
          </Route>
          <Route path="/file-manage">
              <FileManage/>
          </Route>
          <Route path='/addfile'>
            <AddFile/>
          </Route>
          <Route path='/error'>
            <ErrorPage/>
          </Route>
          <Route path="/">
            <DevicePanel />
          </Route>
        </Switch>
      </div>
    </Router>
    </ResourceNameContext.Provider>
  ))
}

ReactDOM.render(<App/>, document.getElementById('app'));
