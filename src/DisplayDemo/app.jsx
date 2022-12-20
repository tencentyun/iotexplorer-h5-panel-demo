import React from 'react'
import { TabBar } from 'antd-mobile'
import {
  Route,
  Switch,
  useHistory,
  useLocation,
  MemoryRouter as Router,
} from 'react-router-dom'
import {
  AppOutline,
  AppstoreOutline,
  GlobalOutline,
  SystemQRcodeOutline
} from 'antd-mobile-icons'

import './index.less'
import ApiDisplay from './ApiDisplay/ApiDisplay';
import MiniProgram from './MiniProgram/MiniProgram'
import ComponentDisplay from './ComponentDisplay/ComponentDisplay'
import { DevicePanelDemo } from '../DevicePanelDemo/DevicePanelDemo'
import { StanderdBleDemo } from '../StanderdBleDemo/StanderdBleDemo'
import { BluetoothDemo } from '../BluetoothDemo/BluetoothDemo'
import PanelDemoDisplay from './PanelDemoDisplay/PanelDemoDisplay'
import { DualmodePanel } from '../DualmodePanelDemo/DualmodePanel'
import { NonInductiveDemo } from '../NonInductiveDemo/NonInductiveDemo'
import CloudStorage from '../CloudStorageDemo/CloudStorage'

const Bottom = () => {
  const history = useHistory()
  const location = useLocation()
  const { pathname } = location

  const setRouteActive = (value) => {
    history.push(value)
  }

  const tabs = [
    {
      key: '/component',
      title: '组件',
      icon: <AppstoreOutline />,
    },
    {
      key: '/api',
      title: '接口',
      icon: <GlobalOutline />,
    },
    {
      key: '/miniprogram',
      title: '微信',
      icon: <AppOutline />,
    },
    {
      key: '/demo',
      title: '示例',
      icon: <SystemQRcodeOutline />,
    }
  ]

  return (
    <TabBar activeKey={pathname} onChange={value => setRouteActive(value)}>
      {tabs.map(item => (
        <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
      ))}
    </TabBar>
  )
}
function App() {
  return (
    <Router initialEntries={['/component']}>
    <div className='home'>
      <div className='top'>
      </div>
      <div className='body'>
        <Switch>
          <Route exact path='/component'>
            <ComponentDisplay />
          </Route>
          <Route exact path='/api'>
            <ApiDisplay />
          </Route>
          <Route exact path='/miniprogram'>
            <MiniProgram />
          </Route>
          <Route exact path='/demo'>
            <PanelDemoDisplay/>
          </Route>
          <Route exact path='/device' component={DevicePanelDemo}/>
          <Route exact path='/ble' component={BluetoothDemo}/>
          <Route exact path='/standerdble' component={StanderdBleDemo}/>
          <Route exact path='/dualmodePanel' component={DualmodePanel}/>
          <Route exact path='/nonInductive' component={NonInductiveDemo}/>
          <Route exact path='/cloudStorage' component={CloudStorage}/>
        </Switch>
      </div>
      <div className='bottom'>
        <Bottom/>
      </div>
    </div>
  </Router>
  )
}

ReactDOM.render(<App />, document.getElementById('app'));
