import React, { useEffect, useState, useRef } from "react";
import { Loading } from "../components/Loading";
import debug from 'debug';

const sdk = window.h5PanelSdk;
let intervalId = null;
let timeoutId = null;


const logger = debug('无感配网');
const log = logger.extend('log');
const error = logger.extend('error');
localStorage.debug = '无感配网:*';

export function NonInductiveDemo() {
  const [isSearching, setIsSearching] = useState(false);
  const [devices, setDevices] = useState([]);
  const handleSearchDevice = async (apSwitch) => {
    let token;
    try {
      token = await sdk.createWifiBindToken();
    } catch (err) {
      error('获取token出错', err);
      return;
    }

    try {
      setIsSearching(!!apSwitch);
      const res = await sdk.callDeviceAction(
        {
          token,
          ap_switch: apSwitch,
        },
        'dev_network_config'
      );
      log(apSwitch === 1 ? '开始发现设备，找队友ing...' : '停止搜索设备', res);
    } catch (err) {
      setIsSearching(false);
      log('开始搜索设备出错,请检查路由器是否在线', err);
    }
    // 开始轮询，获取当前绑定成功的设备列表
    if (apSwitch === 1) {
      clearInterval(intervalId);
      clearTimeout(timeoutId);
      intervalId = setInterval(async() => {
        const devices = await sdk.getDevicesByBindToken(token);
        log(devices);
        setDevices(devices);
      }, 1000);

      // 5分钟后自动停止搜索
      timeoutId = setTimeout(() => handleSearchDevice(0), 5 * 60 * 1000);
    }
  }

  useEffect(() => {
    // 监听wsEventReport事件可以知道发现了哪些设备
    sdk.on('wsEventReport', (data) => {
      log('wsEventReport',  data);
      const {
        Payload
      } = data;
      const {eventId, params} = Payload;
      if (eventId === 'dev_network_config_report') {
        log(`发现设备：${params.deviceName}`);
      }
    });
    // 监听wsStatusChange事件可以知道绑定了哪些设备
    sdk.on('wsDeviceBind', (data) => {
      log('wsDeviceBind',  data);
      const {
        Payload
      } = data;
      console.log(Payload);
    });
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    }
  }, []);

  useEffect(() => {
    if (!isSearching) {
      clearInterval(intervalId);
    }
  }, [isSearching]);

  return (
    <div style={{padding: 10}}>
      <h2>无感配网demo</h2>
      {
        !isSearching ? (
          <button onClick={() => handleSearchDevice(1)}>搜索设备</button>
        ) : (
          <div>
            <div>正在搜索设备中... <Loading /></div>
            <button onClick={() => handleSearchDevice(0)}>停止搜索</button>
          </div>
        )
      }

      {
        devices.length ? <>
          <h3>已添加如下设备:</h3>
            <ul>
            {
              devices.map((device) => <li key={device.DeviceName}>{device.DeviceName}</li>)
            }
            </ul>
          </> : null
      }
    </div>
  )
}
