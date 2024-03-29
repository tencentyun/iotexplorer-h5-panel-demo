import React, { useEffect, createContext, useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { DevicePanel } from './DevicePanel';
const sdk = window.h5PanelSdk;
import { AddFile, ErrorPage, FileManage } from '../fileManage';
import './style.less';

export const ResourceNameContext = createContext(null);
export function DevicePanelDemo() {
  const isDev = process.env.NODE_ENV !== 'production';

  //新旧链接的兼容
  const hasScf = (/\/scf\//).test(location.href)
  let basename = isDev ? `${hasScf ? '/scf' : ''}/h5panel/developing` : `${hasScf ? '/scf' : ''}/h5panel`;
  console.log('----basename----', basename);
  
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    sdk.sdkReady().then(() => setSdkReady(true));
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
  };

  return !sdkReady
    ? <div>loading...</div>
    : (
      <ResourceNameContext.Provider value={ResourceInfo}>
        <Router basename={basename}>
          <div>
            <Switch>
              <Route path='/'>
                <DevicePanel />
              </Route>
              <Route path='/file-manage'>
                <FileManage />
              </Route>
              <Route path='/addfile'>
                <AddFile />
              </Route>
              <Route path='/error'>
                <ErrorPage />
              </Route>
            </Switch>
          </div>
        </Router>
      </ResourceNameContext.Provider>
    );
}

