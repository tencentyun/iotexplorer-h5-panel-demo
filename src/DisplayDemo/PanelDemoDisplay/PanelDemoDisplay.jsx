import React from 'react'
import { Link } from 'react-router-dom';
import { SystemQRcodeOutline } from 'antd-mobile-icons';
import { List, Divider } from 'antd-mobile';
import './PanelDemoDisplay.less'

const sdk = window.h5PanelSdk;
export default function PanelDemoDisplay() {
  return (
    <div className='panel-demo'>
      <div>
        <div className='icon'>
        <SystemQRcodeOutline fontSize={48} color='var(--adm-color-weak)'/>
        </div>
        <div className='text'>以下将展示部分面板的示例以及功能</div>
      </div>
    <Divider>H5面板</Divider>
    <List>
      <List.Item>
        <Link to='/ble'>自定义蓝牙</Link>
      </List.Item>
      <List.Item>
        <Link to='/standerdBle'>标准蓝牙</Link>
      </List.Item>
      <List.Item>
        <Link to='/nonInductive'>无感配网</Link>
      </List.Item>
      <List.Item>
        <Link to='/dualmodePanel'>双路通信</Link>
      </List.Item>
      <List.Item>
        <Link to='/cloudStorage'>云存服务</Link>
      </List.Item>
      <List.Item>
      <Link to='/device'>标准面板</Link>
      </List.Item>
      </List>
    </div>
  )
}
