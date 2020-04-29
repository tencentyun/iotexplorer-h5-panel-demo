import React, { useEffect, useState, useReducer } from 'react';
import sdk from 'qcloud-iotexplorer-h5-panel-sdk';
import classNames from 'classnames';
import './style.less';
import { NumberPanelControl } from './components/NumberPanelControl';
import { EnumPanelControl } from './components/EnumPanelControl';

console.log('sdk', sdk);

function reducer(state, action) {
  const { type, payload } = action;

  switch (type) {
    case 'report':
    case 'control':
      const { deviceData } = state;

      Object.keys(payload || {}).forEach((key) => {
        deviceData[key] = payload[key].Value;
      });

      return {
        ...state,
        deviceData,
      };
    case 'status':
      return {
        ...state,
        deviceStatus: payload,
      };
  }

  return state;
}

function initState(sdk) {
  const templateMap = {};
  // 过滤掉string和timestamp类型
  const templateList = sdk.dataTemplate.properties
    .filter((item) => {
      if (item.define.type !== 'string' || item.define.type !== 'timestamp') {
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

const windowHeight = window.innerHeight || document.documentElement.clientHeight;

export function DevicePanel() {
  const [state, dispatch] = useReducer(reducer, sdk, initState);

  const [numberPanelInfo, setNumberPanelInfo] = useState({
    visible: false,
    templateId: '',
  });
  const [enumPanelInfo, setEnumPanelInfo] = useState({
    visible: false,
    templateId: '',
  });
  const [offlineModalVisible, setOfflineModalVisible] = useState(false);


  const onControlDeviceData = (id, value) => sdk.controlDeviceData({ [id]: value });

  const onControlPanelItem = (item) => {
    console.log('onControlPanelItem', item);

    const { id, define: { type, mapping } } = item;
    const value = state.deviceData[id];

    switch (type) {
      case 'bool':
        onControlDeviceData(id, !value ? 1 : 0);
        break;
      case 'int':
      case 'float':
        setNumberPanelInfo({
          visible: true,
          templateId: id,
        });
        break;
      case 'enum': {
        setEnumPanelInfo({
          visible: true,
          templateId: id,
        });
      }
    }
  };

  const offline = sdk.deviceStatus === 0;
  //离线弹窗
  useEffect(() => {
    if (offline && !offlineModalVisible) {
      sdk.offlineTip.open();
    }else{
      sdk.offlineTip.close();
    }
  }, [offline]);
  

  useEffect(() => {
    sdk.setShareConfig({
      title: sdk.displayName,
    });

    sdk.onWsControl(({ deviceId, deviceData }) => {
        if (deviceId === sdk.deviceId) {
          dispatch({
            type: 'control',
            payload: deviceData,
          });
        }
      })
      .onWsReport(({ deviceId, deviceData }) => {
        if (deviceId === sdk.deviceId) {
          dispatch({
            type: 'report',
            payload: deviceData,
          });
        }
      })
      .onWsStatusChange(({ deviceId, deviceStatus }) => {
        if (deviceId === sdk.deviceId) {
          dispatch({
            type: 'status',
            payload: deviceStatus,
          });
        }
      });
  }, []);

  return (
    <>
      <div className="panel-list" style={{ minHeight: `${windowHeight}px` }}>
        {state.templateList.map((item) => {
          const { id } = item;

          const {
            name,
            mode = '',
            define: {
              type, mapping, start,
            } = {},
          } = item;

          let value = state.deviceData[id];

          // 一般非在线状态需要禁止控制，控制了也白控制
          const disabled = false; // !state.deviceStatus || mode.indexOf('w') === -1;

          if ((type === 'int' || type === 'float') && typeof value === 'undefined') {
            value = start;
          }

          return (
            <div
              key={id}
              className="col-span-1 panel-row"
            >
              <div
                key={id}
                className={classNames('panel-item', `type-${type}`, {
                  disabled,
                })}
              >
                <div
                  className="panel-item-content need-hover"
                  onClick={() => {
                    if (disabled) return;

                    onControlPanelItem(item);
                  }}
                >
                  <div className="panel-header">
                    <div className="panel-name text-overflow">
                      {name}
                    </div>
                  </div>

                  <div
                    className={classNames('panel-value-container append-arrow')}
                  >
                    <div className="panel-value text-overflow">
                      {type === 'bool' ? (
                        <div
                          className={classNames('iot-switch', {
                            checked: !!value,
                          })}
                        />
                      ) : type === 'enum' ? (
                        mapping[value || 0]
                      ) : value}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="divider"/>

        <div className="panel-row">
          <div className="panel-item">
            <div
              className="panel-item-content need-hover"
              onClick={() => sdk.goDeviceDetailPage()}
            >
              <div className="panel-header">
                <div className="panel-name">
                  设备详情
                </div>
              </div>

              <div className="panel-value-container append-arrow"/>
            </div>
          </div>
        </div>
      </div>
      {numberPanelInfo.visible && (
        <NumberPanelControl
          visible={true}
          templateId={numberPanelInfo.templateId}
          templateConfig={state.templateMap[numberPanelInfo.templateId]}
          value={state.deviceData[numberPanelInfo.templateId]}
          onChange={onControlDeviceData}
          onClose={() => setNumberPanelInfo({ visible: false, templateId: '' })}
        />
      )}

      {enumPanelInfo.visible && (
        <EnumPanelControl
          visible={true}
          templateId={enumPanelInfo.templateId}
          templateConfig={state.templateMap[enumPanelInfo.templateId]}
          value={state.deviceData[enumPanelInfo.templateId]}
          onChange={onControlDeviceData}
          onClose={() => setEnumPanelInfo({ visible: false, templateId: '' })}
        />
      )}
    </>
  )
}
