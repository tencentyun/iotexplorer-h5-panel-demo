import React from 'react'
import { List, Divider } from 'antd-mobile'
import './ComponentDisplay.less'
import { AppstoreOutline } from 'antd-mobile-icons'
const sdk = window.h5PanelSdk;

export default function ComponentDisplay() {
  return (
    <div className='component'>
      <div className='header'>
        <div className='icon'>
          <AppstoreOutline fontSize={48} color='var(--adm-color-weak)'/>
        </div>
        <div className='text'>以下将展示腾讯连连小程序的组件能力，具体属性参数详见<a href='https://cloud.tencent.com/document/product/1081/67449'>界面组件</a></div>
      </div>
      <Divider>tips组件</Divider>
      <List>
      <List.Item onClick={()=> sdk.tips.show('tips 组件，样式和风格与连连小程序一致。')}>
        显示提示
      </List.Item>
      <List.Item onClick={()=> sdk.tips.hide()}>
      关闭提示
      </List.Item>
      <List.Item onClick={()=> sdk.tips.showLoading('展示 loading tips 后必须主动调用关闭接口，否则 tips 将会一直保留')}>
      显示加载提示
      </List.Item>
      <List.Item onClick={()=> sdk.tips.hideLoading()}>
      关闭加载提示
      </List.Item>
      <List.Item onClick={()=> sdk.tips.showInfo('tips可以传入options参数，定制自己需要展示的样式')}>
      显示一般提示
      </List.Item>
      <List.Item onClick={()=> sdk.tips.showSuccess('我是绿的，所以我是成功提示tips')}>
      显示成功提示
      </List.Item>
      <List.Item onClick={()=> sdk.tips.showError('我是红的，所以我是错误提示tips')}>
      显示错误提示
      </List.Item>
      <List.Item onClick={()=> sdk.tips.showModal({
          title: '我是title',
          content: '展示一个弹窗，参数、功能、样式同小程序原生 showModal 基本一致',
          showCancel: true,
          cancelText: '我是取消',
          cancelColor: 'green',
          confirmText: '我是确认',
          confirmColor: 'red',
        })}>
      模态对话框
      </List.Item>
      <List.Item onClick={()=> sdk.tips.confirm('我是title', '我是封装了后的，用于向用户进行二次确认操作时使用？')}>
      确认模态对话框
      </List.Item>
      <List.Item onClick={()=> sdk.tips.alert('我也是封装后的，用于向用户进行消息提示操作时使用！')}>
      提示模态对话框
      </List.Item>
      </List>
      <Divider>离线提示组件</Divider>
      <List>
        <List.Item onClick={()=> sdk.showOfflineTip()}>
        设备离线提示
        </List.Item>
        <List.Item onClick={()=> sdk.hideOfflineTip()}>
        关闭离线提示
        </List.Item>
      </List>
      <Divider>设备详情组件</Divider>
      <List>
        <List.Item onClick={()=> sdk.showDeviceDetail({
        labelWidth: 120,
        marginTop: 8,
        shareParams: {
          a: 'a',
          b: 'b',
        },
        extendItems: [
          {
            labelIcon: 'https://main.qcloudimg.com/raw/be1d876d55ec2479d384e17c94df0e69.svg',
            label: '自定义菜单',
            content: '自定义菜单内容（可选）',
            onClick: () => console.log('点击自定义菜单'),
          },
        ],
        extendButtons: [
          {
            text: '我可以自定义',
            type: 'warning',
            onClick: () => console.log('点击自定义按钮'),
          },
          {
            text: '关闭设备详情',
            type: '',
            onClick: () => sdk.hideDeviceDetail(),
          },
        ],
      })}>
        显示设备详情
        </List.Item>
        <List.Item onClick={()=> sdk.hideDeviceDetail()}>
        关闭设备详情
        </List.Item>
      </List>
    </div>
  )
}
