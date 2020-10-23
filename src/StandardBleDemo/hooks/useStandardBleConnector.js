import React, { useState, useRef, useEffect } from 'react';
import sdk, { StandardDeviceAdapter, ERROR_MESSAGES } from 'qcloud-iotexplorer-h5-panel-sdk';
import { AppDevSdk } from "qcloud-iotexplorer-appdev-sdk";

export const DEVICE_DISCONNECTED = 'disconnected';
export const DEVICE_CONNECTING = 'connecting';
export const DEVICE_CONNECTED = 'connected';
export const DEVICE_CONNECT_ERROR = 'connect-error';
export const DEVICE_DISCONNECTED_MSG = '蓝牙未连接';
export const DEVICE_CONNECTING_MSG = '蓝牙连接中';
export const DEVICE_CONNECTED_MSG = '蓝牙已连接';
export const DEVICE_CONNECT_ERROR_MSG = '无法连接蓝牙设备';
const REPORT_EVENT_TYPE = 'STANDARD_BLE';

export const useStandardBleConnector = ({
  deviceId,
  familyId = '',
  bleDeviceId = '',
  onConnectStatusChange = () => { },
}) => {
  const { deviceInfo,
    _productInfo: productInfo } = sdk;

  const deviceAdapterRef = useRef(null);
  const [deviceConnectInfo, setDeviceConnectInfo] = useState({
    status : {}
  });


  const updateDeviceConnectInfo = (connectInfo, deviceAdapter) => {
    sdk.insightReportor.info(REPORT_EVENT_TYPE, {
      message: '蓝牙连接状态切换',
      serviceId: StandardDeviceAdapter.serviceId16,
      data: {
        deviceId,
        connectInfo
      }
    });
    onConnectStatusChange(connectInfo.status);
    // 更新到redux
    setDeviceConnectInfo({
      DeviceId: deviceId,
      status: connectInfo,
      deviceAdapter: deviceAdapter || null
    });
  };

  const onDisconnectRef = useRef(() => {
    console.log('---on---disconnect---');
    updateDeviceConnectInfo({
      status: DEVICE_DISCONNECTED,
      msg: DEVICE_DISCONNECTED_MSG
    });
    deviceAdapterRef.current.off('disconnect', onDisconnectRef.current);
    deviceAdapterRef.current = null;
  });

  const onRemoteControlRef = useRef(({ deviceId, deviceData }) => {
    // 不是这个设备就过滤掉
    if (deviceId !== deviceId)
      return;
    const nowDeviceData = {};
    Object.keys(deviceData).forEach(key => {
      nowDeviceData[key] = deviceData[key].Value;
    });

    controlDevice({ deviceData: nowDeviceData });
  });

  const onRemoteActionControlRef = useRef(({ Payload }) => {
    // 不是这个设备就过滤掉
    if (deviceId !== deviceId)
      return;

    controlAction({ actionData: Payload });
  });

  useEffect(() => {
    if (deviceId) {
      if (deviceConnectInfo.status !== DEVICE_CONNECTED || !bleDeviceId) {
        connectDevice();
      } else {
        // 已经连接的话，直接赋值
        deviceAdapterRef.current = sdk.blueToothAdapter.getDeviceAdapter(bleDeviceId);
        deviceAdapterRef.current.on('disconnect', onDisconnectRef.current);
      }
      // 不需要连接成功就可以监听
      sdk.on(AppDevSdk.constants.EventTypes.WsControl, onRemoteControlRef.current);
      sdk.on(AppDevSdk.constants.EventTypes.WsActionPush, onRemoteActionControlRef.current);

      return () => {
        if (deviceAdapterRef.current) {
          deviceAdapterRef.current
            .off('disconnect', onDisconnectRef.current);
          deviceAdapterRef.current.stopListenLLEvents();
          sdk.off(AppDevSdk.constants.EventTypes.WsControl, onRemoteControlRef.current);
          sdk.off(AppDevSdk.constants.EventTypes.WsActionPush, onRemoteActionControlRef.current);
          deviceAdapterRef.current = null;
        }
      };
    }

  }, [deviceId]);


  const connectDevice = async () => {
    try {
      updateDeviceConnectInfo({
        status: DEVICE_CONNECTING,
        msg: DEVICE_CONNECTING_MSG
      });

      // 先从缓存里面取吧
      let deviceAdapter = deviceAdapterRef.current = bleDeviceId && sdk.blueToothAdapter.getDeviceAdapter(bleDeviceId);
      if (!deviceAdapter) {
        await sdk.blueToothAdapter.init();
        const [productId, deviceName] = deviceId.split('/');
        
        const device = await sdk.blueToothAdapter.searchDevice({
          serviceId: StandardDeviceAdapter.serviceId,
          productId,
          deviceName,
        });

        if (device) {
          if (!deviceAdapterRef.current) {
            deviceAdapter = deviceAdapterRef.current = await sdk.blueToothAdapter.connectDevice(device);
          }
        }
      }

      // 如果还是没有的话
      if (!deviceAdapter) {
        throw {
          code: 'CANNOT_FIND_DEVICE'
        };
      }
      // 走再次连接的流程
      await deviceAdapter.reconnectDevice({
        deviceName: deviceInfo.DeviceName
      });

      // 设置这个deviceAdapter的templateData
      deviceAdapter.templateData = productInfo.DataTemplate;
      deviceAdapter
        .on('disconnect', onDisconnectRef.current);

      deviceAdapter.startListenLLEvents();

      updateDeviceConnectInfo({
        status: DEVICE_CONNECTED,
        msg: DEVICE_CONNECTED_MSG
      }, deviceAdapter);
    } catch (err) {
      console.error(err);
      if (err) {
        updateDeviceConnectInfo({
          status: DEVICE_CONNECT_ERROR,
          msg: err.errCode || err.msg ? err.msg : DEVICE_CONNECT_ERROR_MSG,
        });

        sdk.insightReportor.error(REPORT_EVENT_TYPE, {
          message: ERROR_MESSAGES[err.code] || ERROR_MESSAGES.CONNECT_DEVICE_ERROR,
          error: err,
          data: {
            error: err
          }
        });
      }
    }
  };

  const checkDeviceAdapter = async () => {
    if (!deviceAdapterRef.current) {
      alert("请先连接至蓝牙设备");
      return false;
    }
    return true;
  };

  const deleteDevice = async () => {
    if (!deviceAdapterRef.current)
      return Promise.reject('请先连接至蓝牙设备');;

    try {
      await deviceAdapterRef.current.unbindDevice({
        familyId: familyId,
        deviceName: deviceInfo.DeviceName
      });
      return true;
    } catch (error) {
      console.error('-----', error);
      return Promise.reject(error);
    }
  };


  const controlDevice = async ({ deviceData }) => {
    if (!await checkDeviceAdapter())
      return;
    await deviceAdapterRef.current.controlDevice({ deviceData });
  };

  const controlAction = async ({ actionData }) => {
    try {
      if (!await checkDeviceAdapter())
        return;
      await deviceAdapterRef.current.controlAction({ actionData });
    } catch (error) {
      sdk.insightReportor.error(REPORT_EVENT_TYPE, {
        message: ERROR_MESSAGES[error.code] || ERROR_MESSAGES.CONTROL_ACTION_ERROR,
        error,
      });
    }
  };

  const disconnectDevice = async () => {
    if (!await checkDeviceAdapter())
      return;
    await deviceAdapterRef.current.disconnectDevice();
  };

  return { deviceAdapter: deviceAdapterRef.current, deviceConnectInfo: deviceConnectInfo.status, connectDevice, deleteDevice, controlDevice, disconnectDevice };
};
