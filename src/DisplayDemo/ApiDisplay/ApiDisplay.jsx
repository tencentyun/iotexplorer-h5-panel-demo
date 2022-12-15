import React, { useState } from 'react';
import { List, Divider, Button } from 'antd-mobile';
import './ApiDisplay.less';
import { GlobalOutline } from 'antd-mobile-icons';
import { Modal } from '../../components/Modal';

const sdk = window.h5PanelSdk;

export default function ApiDisplay() {
  const [visible, setVisible] = useState(false);
  const [content, setContent] = useState('');
  return (
    <div className='miniprogram'>
      <div>
        <div className='icon'>
          <GlobalOutline fontSize={48} color='var(--adm-color-weak)'/>
        </div>
        <div className='text'>以下将展示腾讯连连小程序的接口能力，具体属性参数详见<a href='https://cloud.tencent.com/document/product/1081/67447'>设备管理</a></div>
      </div>
      <Divider>设备管理</Divider>
      <List>
        <List.Item onClick={ async () => {
          const res = await sdk.getProductInfo();
          setContent(JSON.stringify(res[0], undefined, '\t'));
          setVisible(true);
        }}>
          获取产品信息
        </List.Item>
        <List.Item onClick={ async() => {
          const res = await sdk.getDeviceInfo();
          setContent(JSON.stringify(res, undefined, '\t'));
          setVisible(true);
        }}>
          获取设备信息
        </List.Item>
        <List.Item onClick={ async() => {
          const res = await sdk.getUserInfo();
          setContent(JSON.stringify(res, undefined, '\t'));
          setVisible(true);
        }}>
          获取用户信息
        </List.Item>
        <List.Item onClick={ async() => {
          // const res = await sdk.getSubDeviceList();
          // setContent(JSON.stringify(res, undefined, '\t'));
          // setVisible(true);         
        }}>
          <a href="https://cloud.tencent.com/document/product/1081/67447#:~:text=%EF%BC%88%E5%88%86%E4%BA%AB%E8%AE%BE%E5%A4%87%EF%BC%89%E3%80%82-,%E8%8E%B7%E5%8F%96%E7%BB%91%E5%AE%9A%E5%88%B0%E7%BD%91%E5%85%B3%E4%B8%8B%E7%9A%84%E5%AD%90%E8%AE%BE%E5%A4%87%E5%88%97%E8%A1%A8,-%E8%BF%99%E4%B8%AA%E6%8E%A5%E5%8F%A3%E5%8F%AA%E8%83%BD">获取绑定到网关下的子设备列表</a>
        </List.Item>
        <List.Item onClick={ async() => {
          // const res = await sdk.controlDeviceData({power_switch: 1});
          // setContent(JSON.stringify(res, undefined, '\t'));
          // setVisible(true);    
        }}>
        <a href="https://cloud.tencent.com/document/product/1081/67447#:~:text=%E8%A7%81deviceList%E3%80%82-,%E6%8E%A7%E5%88%B6%E8%AE%BE%E5%A4%87%E5%B1%9E%E6%80%A7,-%E6%8E%A5%E5%8F%A3%E5%AE%9A%E4%B9%89">控制设备属性</a>
        </List.Item>
        <List.Item onClick={ async() => {
          // const res = await sdk.callDeviceAction({test: 1}, 'act_1');
          // setContent(JSON.stringify(res, undefined, '\t'));
          // setVisible(true);  
        }}>
          <a href="https://cloud.tencent.com/document/product/1081/67447#:~:text=%E6%8E%A7%E5%88%B6%E8%AE%BE%E5%A4%87%E3%80%82-,%E8%B0%83%E7%94%A8%E8%AE%BE%E5%A4%87%E8%A1%8C%E4%B8%BA,-%E6%8E%A5%E5%8F%A3%E5%AE%9A%E4%B9%89">调用设备行为</a>
        </List.Item>
        <List.Item onClick={ async() => {
          // const res = await sdk.getDeviceData();
          // setContent(JSON.stringify(res, undefined, '\t'));
          // setVisible(true);  
        }}>
          <a href="https://cloud.tencent.com/document/product/1081/67447#:~:text=%E8%AE%BE%E5%A4%87%E8%A1%8C%E4%B8%BA%E3%80%82-,%E8%8E%B7%E5%8F%96%E8%AE%BE%E5%A4%87%E7%89%A9%E6%A8%A1%E5%9E%8B%E6%95%B0%E6%8D%AE,-%E6%8E%A5%E5%8F%A3%E5%AE%9A%E4%B9%89">获取设备物模型数据</a>
        </List.Item>
        <List.Item onClick={ async() => {
        //   const res = await sdk.getDeviceDataHistory({
        //     FieldName: 'power_switch',
        //     MaxTime: 0,
        //     MinTime: Date.now(),
        //     Limit: 2
        // })
        //   setContent(JSON.stringify(res, undefined, '\t'));
        //   setVisible(true);  
        }}>
          <a href="https://cloud.tencent.com/document/product/1081/67447#:~:text=%E7%89%A9%E6%A8%A1%E5%9E%8B%E6%95%B0%E6%8D%AE%E3%80%82-,%E8%8E%B7%E5%8F%96%E8%AE%BE%E5%A4%87%E7%89%A9%E6%A8%A1%E5%9E%8B%E5%8E%86%E5%8F%B2%E6%95%B0%E6%8D%AE,-%E6%8E%A5%E5%8F%A3%E5%AE%9A%E4%B9%89">获取设备物模型历史数据</a>
        </List.Item>
        <List.Item onClick={ async() => {
          const res = await sdk.getDeviceStatus();
          setContent(JSON.stringify(res, undefined, '\t'));
          setVisible(true);
        }}>
        获取设备当前状态
        </List.Item>
        <List.Item onClick={ async() => {
          const res = await sdk.deleteDevice();
          setContent(JSON.stringify(res, undefined, '\t'));
          setVisible(true);
        }}>
        删除设备
        </List.Item>
        <List.Item onClick={ async() => {
          // const {data} = await sdk.getShareParams();
          // setContent(JSON.stringify(data, undefined, '\t'));
          // setVisible(true);
        }}>
          <a href="https://cloud.tencent.com/document/product/1081/67447#:~:text=%E8%BF%94%E5%9B%9E%E4%B8%80%E4%B8%AA%20Promise%E3%80%82-,%E8%8E%B7%E5%8F%96%E8%87%AA%E5%AE%9A%E4%B9%89%E5%88%86%E4%BA%AB%E5%8F%82%E6%95%B0,-%E8%8B%A5%E8%AF%A5%E8%AE%BE%E5%A4%87">获取自定义分享参数</a>
        </List.Item>
        <List.Item onClick={ async() => {
          // const res = await sdk.reportFirmwareVersion({ version: '1.0.0'});
          // setContent(JSON.stringify(res, undefined, '\t'));
          // setVisible(true);      
        }}>
          <a href="https://cloud.tencent.com/document/product/1081/67447#:~:text=string-,%E5%9B%BA%E4%BB%B6%E7%89%88%E6%9C%AC%E4%B8%8A%E6%8A%A5,-%E4%B8%8A%E6%8A%A5%E8%AE%BE%E5%A4%87%E7%AB%AF">固件版本上报</a>
        </List.Item>
        <List.Item onClick={ async() => {
          // const res = await sdk.checkFirmwareUpdate({ ProductId: 'ZR1A6RRX69', DeviceName: 'dev1' });
          // setContent(JSON.stringify(res, undefined, '\t'));
          // setVisible(true);            
        }}>
          <a href="https://cloud.tencent.com/document/product/1081/67447#:~:text=%E5%90%A6-,%E5%9B%BA%E4%BB%B6%E5%8D%87%E7%BA%A7%E4%BF%A1%E6%81%AF%E6%9F%A5%E8%AF%A2,-%E6%9F%A5%E8%AF%A2%E8%AE%BE%E5%A4%87%E7%9A%84">固件升级信息查询</a>
        </List.Item>
        <List.Item onClick={ async() => {
          // const res = await sdk.getShareParams();
          // setContent(JSON.stringify(res, undefined, '\t'));
          // setVisible(true);
        }}>
          <a href="https://cloud.tencent.com/document/product/1081/67447#:~:text=%E5%AE%9A%E4%B9%89%E5%88%86%E4%BA%AB%E5%8F%82%E6%95%B0%E3%80%82-,%E6%A3%80%E6%9F%A5%E8%AE%BE%E5%A4%87%E6%98%AF%E5%90%A6%E6%9C%89%E5%8F%AF%E5%8D%87%E7%BA%A7%E5%9B%BA%E4%BB%B6,-%E6%A3%80%E6%9F%A5%E6%8C%87%E5%AE%9A%E8%AE%BE%E5%A4%87">检查设备是否有可升级固件</a>
        </List.Item>
        <List.Item onClick={ async() => {
          // const res = await sdk.getDeviceLatestOTAInfo();
          // setContent(JSON.stringify(res, undefined, '\t'));
          // setVisible(true);
        }}>
          <a href="https://cloud.tencent.com/document/product/1081/67447#:~:text=%E6%98%AF%E5%90%A6%E5%8D%87%E7%BA%A7%E3%80%82-,%E8%8E%B7%E5%8F%96%E6%9C%80%E6%96%B0%E5%9B%BA%E4%BB%B6%E4%BF%A1%E6%81%AF,-%E8%8E%B7%E5%8F%96%E6%8E%A7%E5%88%B6%E5%8F%B0%E6%8E%A8%E9%80%81">获取最新固件信息</a>
        </List.Item>
        <List.Item onClick={ async() => {
          // const res = await sdk.downLoadDeviceOTA();
          // setContent(JSON.stringify(res, undefined, '\t'));
          // setVisible(true);         
        }}>
        <a href="https://cloud.tencent.com/document/product/1081/67447#:~:text=string-,%E4%B8%8B%E8%BD%BD%E5%9B%BA%E4%BB%B6,-%E4%B8%8B%E8%BD%BD%E6%8E%A7%E5%88%B6%E5%8F%B0%E6%8E%A8%E9%80%81">下载固件</a>
        </List.Item>
        <List.Item onClick={ async() => {
          await sdk.goFirmwareUpgradePage();
        }}>
        进行固件升级
        </List.Item>
        <List.Item onClick={ async() => {
          // const res = await sdk.reportOTAStatus({ state: 'string', persent: 'string', version: 'string', resultCode: 1 })
          // setContent(JSON.stringify(res, undefined, '\t'));
          // setVisible(true);      
        }}>
        <a href="https://cloud.tencent.com/document/product/1081/67447#:~:text=%E6%98%AF-,%E5%9B%BA%E4%BB%B6%E5%8D%87%E7%BA%A7%E7%8A%B6%E6%80%81%E4%B8%8A%E6%8A%A5,-%E4%B8%8A%E6%8A%A5%E8%AE%BE%E5%A4%87%E7%AB%AF">固件升级状态上报</a>
        </List.Item>
      </List>
      <Modal visible={visible} >
        <Modal.Body>
          <pre>{content}</pre>
        </Modal.Body>
        <Modal.Footer>
          <Button type='primary' onClick={()=> {
              setContent('');
              setVisible(false);
          }}>关闭</Button>
          </Modal.Footer>
      </Modal>
    </div>
  )
}
