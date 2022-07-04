import { useReducer } from 'react';
import { DataTemplateProperty, normalizeDataByTemplate } from '../dataTemplate';

interface DeviceDataState {
  deviceData: Record<string, unknown>;
  deviceStatus: number;
  propertyMap: Record<string, DataTemplateProperty>;
  propertyList: DataTemplateProperty[];
}

function reducer(state: DeviceDataState, action: {
  type: string;
  payload: any;
}) {
  const { type, payload } = action;

  switch (type) {
    case 'data': {
      const deviceData = state.deviceData;

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
  const propertyMap = <Record<string, DataTemplateProperty>>{};
  const propertyList = <DataTemplateProperty[]>sdk.dataTemplate.properties;

  propertyList.forEach((item: DataTemplateProperty) => {
    propertyMap[item.id] = item;
  });

  return {
    propertyMap: propertyMap,
    propertyList: propertyList,
    deviceData: normalizeDataByTemplate(<Record<string, unknown>>sdk.deviceData, propertyList),
    deviceStatus: <number>sdk.deviceStatus,
  };
}

export function useDeviceData(sdk: any) {
  const [state, dispatch] = useReducer(reducer, sdk, initState);

  const onDeviceDataChange = (deviceData: Record<string, { Value: unknown; LastUpdate: number }>) => {
    dispatch({
      type: 'data',
      payload: deviceData,
    });
  };

  const onDeviceStatusChange = (deviceStatus: number) => {
    dispatch({
      type: 'status',
      payload: deviceStatus,
    });
  };

  return [
    state,
    {
      onDeviceDataChange,
      onDeviceStatusChange
    },
  ] as const;
}
