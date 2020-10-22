import { useReducer } from 'react';

interface DeviceDataState {
  deviceData: object;
  deviceStatus: 0 | 1;
  templateMap: object;
  templateList: TemplatePropertyConfig[];
}

function reducer(state: DeviceDataState, action: {
  type: string;
  payload: any;
}) {
  const { type, payload } = action;

  switch (type) {
    case 'data': {
      const deviceData: any = state.deviceData;

      Object.keys(payload || {}).forEach((key) => {
        deviceData[key] = payload[key].Value;
      });

      return {
        ...state,
        deviceData,
      };
    }
    case 'status':
      return {
        ...state,
        deviceStatus: payload,
      };
  }

  return state;
}

function initState(sdk: any) {
  const templateMap: any = {};

  // 过滤掉 string 和 timestamp 类型
  const templateList = sdk.dataTemplate.properties
    .filter((item: TemplatePropertyConfig) => {
      if (item.define.type !== 'string' && item.define.type !== 'timestamp') {
        templateMap[item.id] = item;

        return true;
      }

      return false;
    });

  return {
    templateMap,
    templateList,
    deviceData: sdk.deviceData,
    deviceStatus: sdk.deviceStatus,
  };
}

export function useDeviceData(sdk: any) {
  const [state, dispatch] = useReducer(reducer, sdk, initState);

  const onDeviceDataChange = (deviceData: object) => {
    dispatch({
      type: 'data',
      payload: deviceData,
    });
  };

  const onDeviceStatusChange = (deviceStatus: 0 | 1) => {
    dispatch({
      type: 'status',
      payload: deviceStatus,
    });
  };

  return [state, {
    onDeviceDataChange,
    onDeviceStatusChange
  }];
}
