import React, { useEffect, useState, useRef } from 'react';
import { BleComboDualModeDeviceAdapter4H5 } from 'qcloud-iotexplorer-appdev-plugin-wificonf-blecombo/lib/protocols/BleComboDualMode';

const sdk = window.h5PanelSdk;
const { blueToothAdapter } = sdk;

export function DualmodePanel() {
  const [bool, setBool] = useState(false);
  const deviceAdapterRef = useRef(null);
  const [deviceConnectInfo, setDeviceConnectInfo] = useState({
    status: 'connecting',
    msg: '',
  });
  const onMessageRef = useRef(message => {
    console.log('onMessage', message);
  });
  const onDisconnectRef = useRef(() => {
    setDeviceConnectInfo({
      status: 'disconnected',
      msg: '设备已断开',
    });
    deviceAdapterRef.current = null;
  });


  const triggerVibrateShort = () => {
    return sdk.triggerVibrateShort();
  };

  const connectDevice = async () => {
    try {
      setDeviceConnectInfo({
        status: 'connecting',
        msg: '蓝牙设备连接中…',
      });

      await blueToothAdapter.init();
      console.log('开始搜索设备', sdk.deviceName);
      const device = await blueToothAdapter.searchDevice({
        deviceName: sdk.deviceName,
        serviceId: BleComboDualModeDeviceAdapter4H5.serviceId,
        productId: sdk.productId,
        disableCache: true,
      });
      console.log('搜索结果：', device);
      if (device) {
        if (!deviceAdapterRef.current) {
          console.log('deviceInfo', device);
          const deviceAdapter = deviceAdapterRef.current = await blueToothAdapter.connectDevice({
            ...device,
            productId: sdk.productId,
          });
          console.log('deviceAdapter:', deviceAdapter);
          // authorized之后，才能向设备发送控制数据
          if (!deviceAdapter.authorized) {
            // 走再次连接的流程
            await deviceAdapter.authenticateConnection({
              deviceName: sdk.deviceName,
            });
          }

          deviceAdapterRef.current = deviceAdapter;
          deviceAdapter
            .on('message', onMessageRef.current)
            .on('disconnect', onDisconnectRef.current);
        }

        console.log('connected');

        setDeviceConnectInfo({
          status: 'connected',
          msg: '已连接',
        });
      } else {
        setDeviceConnectInfo({
          status: 'disconnected',
          msg: '无法连接设备',
        });
      }
    } catch (err) {
      console.error('connectDevice err', err);
      if (err) {
        setDeviceConnectInfo({
          status: 'disconnected',
          msg: err.errCode ? err.msg : '无法连接设备',
        });
      }
    }
  };

  const toggleBoolChange = async () => {
    await sdk.controlDeviceData({ power_switch: Number(!bool) });
    setBool(!bool);
  };

  const goDeviceDetail = () => {
    sdk.goDeviceDetailPage();
  }

  useEffect(() => {
    connectDevice();
    setBool(sdk.deviceData.bool);
    sdk.setTriggerVibrateShortFilter((property) => {
      return property.define.type === 'bool';
    });

    return () => {
      if (deviceAdapterRef.current) {
        deviceAdapterRef.current
          .off('message', onMessageRef.current)
          .off('disconnect', onDisconnectRef.current);
        deviceAdapterRef.current = null;
      }
    };
  }, []);

  return (
    <div className="bluetooth-panel">
      <div className="device-status-text">
        <div className="text">{deviceConnectInfo.msg}</div>
        {deviceConnectInfo.status === 'disconnected' && (
          <div>
            <div className="text">，</div>
            <button className="link" onClick={connectDevice}>点击重试</button>
          </div>
        )}

        <div>
          Bool: {bool ? '开' : '关'}
        </div>

        <button onClick={triggerVibrateShort}>触发震动</button>
        <button onClick={toggleBoolChange}>触发bool型变化</button>
        <button onClick={goDeviceDetail}>跳转设备详情</button>
      </div>
    </div>
  )
}
