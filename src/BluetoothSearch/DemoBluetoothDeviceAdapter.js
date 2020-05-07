import { DeviceAdapter } from '../../../sdk/src/bluetooth/DeviceAdapter';

export class DemoBluetoothDeviceAdapter extends DeviceAdapter {
  //每个蓝牙设备这部分都不一样
  static serviceId = '0000FFF0-0000-1000-8000-00805F9B34FB';

  constructor(sdk, props) {
    super(sdk, props);

    this._serviceId = DemoBluetoothDeviceAdapter.serviceId;
  }

  //重写这个方法
  static deviceFilter(deviceInfo) {
    if (deviceInfo.advertisServiceUUIDs) {
      const matchedServiceId = deviceInfo.advertisServiceUUIDs.find(id => id == DemoBluetoothDeviceAdapter.serviceId);

      if (matchedServiceId && deviceInfo.advertisData) {
        try {
          const macArr = deviceInfo.advertisData.slice(2);
          const mac = macArr.join(':');
          
          return {
            ...deviceInfo,
            deviceName: mac,
            serviceId: matchedServiceId,
          }
        } catch (err) {
          console.error('parse mac error', err);
        }
      }
    }
  }

  handleBLEMessage(hex) {
    //简化方式，需补充
    return {
      type: 'unknown',
      data: hex,
    };
  }
}
