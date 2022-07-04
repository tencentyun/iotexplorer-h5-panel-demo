import React, { useState, useRef, useEffect } from 'react';
import sdk, { blueToothAdapter, StandardDeviceAdapter, ERROR_MESSAGES } from 'qcloud-iotexplorer-h5-panel-sdk';

const REPORT_EVENT_TYPE = 'STANDARD_BLE';

export enum StandardBleConnectStatus {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED ='connected',
  ERROR = 'connect-error',
};

export const StandardBleConnectStatusStr = {
  [StandardBleConnectStatus.DISCONNECTED]: '蓝牙未连接',
  [StandardBleConnectStatus.CONNECTING]: '蓝牙连接中',
  [StandardBleConnectStatus.CONNECTED]: '蓝牙已连接',
  [StandardBleConnectStatus.ERROR]: '无法连接蓝牙设备',
};

export const getStandardBleConnectStatusInfo = (connectStatus = StandardBleConnectStatus.DISCONNECTED, msg = '') => {
  if (!StandardBleConnectStatusStr[connectStatus]) {
    connectStatus = StandardBleConnectStatus.DISCONNECTED;
  }

  return {
    status: connectStatus,
    msg: msg || StandardBleConnectStatusStr[connectStatus],
  };
};

const isDeviceReady = (deviceAdapter: any) => deviceAdapter
  && deviceAdapter.isConnected
  && deviceAdapter.authorized;

export const useStandardBleConnector = ({
  deviceId,
  familyId = '',
}: {
  deviceId: string;
  familyId?: string;
}) => {
  const { deviceInfo, productInfo } = sdk;

  const deviceAdapterRef = useRef<any>(null);
  const [connectStatusInfo, setConnectStatusInfo] = useState(getStandardBleConnectStatusInfo());

  const getDeviceAdapter = () => {
    let deviceAdapter = deviceAdapterRef.current;

    if (!deviceAdapter) {
      deviceAdapter = blueToothAdapter.getDeviceAdapter({
        explorerDeviceId: deviceId,
      });
    }

    return deviceAdapter;
  };

  const updateDeviceConnectStatusInfo = (connectStatus: StandardBleConnectStatus, msg = '') => {
    setConnectStatusInfo(getStandardBleConnectStatusInfo(connectStatus, msg));
  };

  // 连接状态的双向数据更新
  const onAuthorizedRef = useRef(() => {
    // 需要蓝牙连接认证通过才行
    console.log('---on---authorized---');
    updateDeviceConnectStatusInfo(StandardBleConnectStatus.CONNECTED);
  });

  const onDisconnectRef = useRef(() => {
    console.log('---on---disconnect---');
    updateDeviceConnectStatusInfo(StandardBleConnectStatus.DISCONNECTED);
  });

  const checkDeviceAdapter = (deviceAdapter: any): deviceAdapter is any => {
    try {
      const deviceReady = isDeviceReady(deviceAdapter);

      if (!deviceReady) {
        sdk.tips.showInfo('请先连接至蓝牙设备');
        return false;
      }
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const controlDevice = async ({ deviceData }: {
    deviceData: any;
  }) => {
    const deviceAdapter = deviceAdapterRef.current;
    if (!checkDeviceAdapter(deviceAdapter)) return;
    await deviceAdapter.controlDevice({ deviceData });
  };

  const controlAction = async ({ actionData }: {
    actionData: any;
  }) => {
    const deviceAdapter = deviceAdapterRef.current;
    if (!checkDeviceAdapter(deviceAdapter)) return;
    await deviceAdapter.controlAction({ actionData });
  };

  const connectDevice = async () => {
    try {
      console.log('connect device');

      const [productId, deviceName] = deviceId.split('/');

      let deviceAdapter = getDeviceAdapter();

      if (!isDeviceReady(deviceAdapter)) {
        console.log('device not ready');

        updateDeviceConnectStatusInfo(StandardBleConnectStatus.CONNECTING);

        if (!deviceAdapter) {
          console.log('no adapter');

          await blueToothAdapter.init();

          const device = await blueToothAdapter.searchDevice({
            serviceId: StandardDeviceAdapter.serviceId,
            productId,
            deviceName,
            // 因为要使用广播中的version来判断发包，所以不使用缓存吧
            disableCache: true,
          });

          console.log('searchDevice result', device);

          if (device) {
            deviceAdapter = await blueToothAdapter.connectDevice(device);
          }
        }

        // 如果还是没有的话
        if (!deviceAdapter) {
          throw {
            code: 'CANNOT_FIND_DEVICE',
          };
        }

        if (!deviceAdapter.isConnected) {
          await deviceAdapter.connectDevice();
        }

        if (!deviceAdapter.authorized) {
          // 走再次连接的流程
          await deviceAdapter.authenticateConnection({
            deviceName,
          });
        }
      }

      deviceAdapterRef.current = deviceAdapter;
      deviceAdapter.off('disconnect', onDisconnectRef.current);
      deviceAdapter.off('authorized', onAuthorizedRef.current);
      deviceAdapter.on('disconnect', onDisconnectRef.current);
      deviceAdapter.on('authorized', onAuthorizedRef.current);

      updateDeviceConnectStatusInfo(StandardBleConnectStatus.CONNECTED);
    } catch (err) {
      console.error(err);
      if (err && typeof err === 'object') {
        const errObj = <Record<string, unknown>>err;
        updateDeviceConnectStatusInfo(StandardBleConnectStatus.ERROR, errObj.msg ? String(errObj.msg) : '');

        sdk.insightReportor.error(REPORT_EVENT_TYPE, {
          message: ERROR_MESSAGES[String(errObj.code)] || ERROR_MESSAGES.CONNECT_DEVICE_ERROR,
          error: err,
          data: {
            error: err,
          },
        });
      }
    }
  };

  const deleteDevice = async () => {
    const deviceAdapter = deviceAdapterRef.current;
    if (!isDeviceReady(deviceAdapter)) {
      const isConfirm = confirm('确定要删除这个设备吗？当前设备未连接,删除后如需重新绑定需要初始化蓝牙设备。');

      if (!isConfirm) {
        return Promise.reject();
      } else {
        return sdk.requestTokenApi('AppDeleteDeviceInFamily', {
          FamilyId: familyId,
          DeviceId: deviceId,
        });
      }
    }

    if (!familyId) return Promise.reject('无家庭信息，无法删除');

    try {
      await deviceAdapter.unbindDevice({
        familyId,
        deviceName: deviceInfo.DeviceName,
      });
      return true;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const disconnectDevice = async () => {
    if (!deviceAdapterRef.current) return;

    await deviceAdapterRef.current.disconnectDevice();
  };

  useEffect(() => {
    console.log('in effect', { deviceId, connectStatusInfo });
    if (deviceId) {
      connectDevice();

      return () => {
        if (deviceAdapterRef.current) {
          deviceAdapterRef.current.off('disconnect', onDisconnectRef.current);
          deviceAdapterRef.current.off('authorized', onAuthorizedRef.current);
          // 销毁这个实例
          deviceAdapterRef.current = null;
        }
      };
    }
  }, [deviceId]);

  return [
    connectStatusInfo,
    {
      deviceAdapter: deviceAdapterRef.current,
      connectDevice,
      deleteDevice,
      controlDevice,
      disconnectDevice,
      controlAction,
    },
  ] as const;
};
