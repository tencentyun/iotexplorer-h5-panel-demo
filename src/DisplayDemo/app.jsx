import React from 'react'
import { NavBar, TabBar } from 'antd-mobile'
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
import PanelDemoDisplay from './PanelDemoDisplay/PanelDemoDisplay'
import { NonInductiveDemo } from '../NonInductiveDemo/NonInductiveDemo'
import CloudStorage from '../CloudStorageDemo/CloudStorage'
import { DevicePanel } from '../DevicePanel'
import { SearchPage } from '../StandardBleDemo'
import { AddFile, ErrorPage, FileManage } from '../fileManageDemo'
import { DualmodePanel } from '../DualmodePanel/DualmodePanel'
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
          <Route exact path='/device' component={DevicePanel}/>
          <Route exact path='/bluetooth' component={SearchPage}/>
          <Route exact path='/file' component={FileManage}/>
          <Route exact path='/error' component={ErrorPage}/>
          <Route exact path='/addFile' component={AddFile}/>
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
