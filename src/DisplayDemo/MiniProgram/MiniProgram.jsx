import React from 'react';
import { List, Divider } from 'antd-mobile';
import './MiniProgram.less';
import { AppOutline } from 'antd-mobile-icons';
const sdk = window.h5PanelSdk;
export default function MiniProgram() {
  return (
    <div className='miniprogram'>
      <div>
        <div className='icon'>
          <AppOutline fontSize={48} color='var(--adm-color-weak)'/>
        </div>
        <div className='text'>以下将展示腾讯连连小程序的能力，具体属性参数详见<a href='https://cloud.tencent.com/document/product/1081/67450'>调用小程序能力</a></div>
      </div>
      <Divider>连连小程序能力</Divider>
      <List>
        <List.Item onClick={() => {sdk.goDeviceDetailPage()}}>
          跳转设备详情页面
        </List.Item>
        <List.Item onClick={() => {sdk.goGatewayAddSubDevicePage('')}}>
          跳转添加子设备页面
        </List.Item>
        <List.Item onClick={() => sdk.goFeedBackPage()}>
          跳转反馈页面
        </List.Item>
        <List.Item onClick={() => sdk.goDeviceInfoPage()}>
          跳转设备信息页面
        </List.Item>
        <List.Item onClick={() => sdk.goEditDeviceNamePage()}>
          跳转修改设备名称页面
        </List.Item>
        <List.Item onClick={() => sdk.goDevicePanelPage('dev2')}>
          <a href="https://cloud.tencent.com/document/product/1081/67450#:~:text=%E8%BF%94%E5%9B%9E%E4%B8%80%E4%B8%AAPromise-,%E8%B7%B3%E8%BD%AC%E5%85%B6%E4%BB%96%E8%AE%BE%E5%A4%87%E7%9A%84%E9%9D%A2%E6%9D%BF%E9%A1%B5%E9%9D%A2,-%E6%8E%A5%E5%8F%A3%E5%AE%9A%E4%B9%89">跳转其他设备的面板页面</a>
        </List.Item>
        <List.Item onClick={() => sdk.goRoomSettingPage()}>
          跳转房间设置页面
        </List.Item>
        <List.Item onClick={() => sdk.goShareDevicePage()}>
          跳转设备分享页面
        </List.Item>
        <List.Item onClick={() => sdk.goVideoPanelPage()}>
          跳转到video设备的面板页面
        </List.Item>
        <List.Item onClick={() => sdk.goTimingProjectPage()}>
          跳转云端定时页面
        </List.Item>
      </List>
      <Divider>微信小程序能力</Divider>
      <List>
        <List.Item onClick={() => sdk.reloadAfterUnmount()}>
          小程序刷新数据
        </List.Item>
        <List.Item onClick={() => sdk.navigateToMiniProgram({ appid: 1305377975})}>
          <a href="https://cloud.tencent.com/document/product/1081/67450#:~:text=%E8%BF%94%E5%9B%9E%E4%B8%80%E4%B8%AAPromise-,%E8%B7%B3%E8%BD%AC%E5%88%B0%E5%85%B6%E4%BB%96%E5%B0%8F%E7%A8%8B%E5%BA%8F,-%E8%B7%B3%E8%BD%AC%E5%88%B0">跳转到其他小程序</a>
        </List.Item>
        <List.Item onClick={() => sdk.navBack()}>
          跳转小程序的上一级页面
        </List.Item>
        <List.Item onClick={() => sdk.setShareConfig({ title: '分享'})}>
          <a href="https://cloud.tencent.com/document/product/1081/67450#:~:text=%E8%BF%94%E5%9B%9E%E4%B8%80%E4%B8%AAPromise-,%E8%AE%BE%E7%BD%AE%E5%BD%93%E5%89%8D%E9%A1%B5%E9%9D%A2%E7%9A%84%E5%88%86%E4%BA%AB%E5%86%85%E5%AE%B9,-%E8%AE%BE%E7%BD%AE%E5%BD%93%E5%89%8D%E9%A1%B5">设置当前页面的分享内容</a>
        </List.Item>
        <List.Item onClick={() => sdk.triggerVibrateShort('heavy')}>
          通知小程序触发震动
        </List.Item>
      </List>
    </div>
  )
}
