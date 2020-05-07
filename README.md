# iotexplorer-h5-panel
腾讯连连自定义H5面板开发文档

## Quick Start

### 1. 安装H5面板SDK

[H5 SDK 文档](https://www.npmjs.com/package/qcloud-iotexplorer-h5-panel-sdk)

```
npm i qcloud-iotexplorer-h5-panel-sdk
```

### 2. 前端渲染H5面板

H5面板框架会渲染一个 id="app" 的容器给您用于渲染，并且 H5 SDK 会初始化好一切您所需用到的参数，您可自行选择使用任何技术方案进行前端渲染，最终仅需输出一个 JS 文件和一个 CSS 文件(css可选)提供给 H5 面板加载即可。

### 2. 代理 JS / CSS 文件到本地

开发模式中，H5面板框架默认会加载 `//developing.script/developing.js` 与 `//developing.style/developing.css` 文件，您需要配置代理转发将这两个地址转发到您本地开发的 JS/CSS 上。

### 3. 访问H5面板开发模式

通过浏览器或"微信开发者工具 - 公众号页面调试"来访问H5面板开发模式，地址为：`https://iot.cloud.tencent.com/h5panel/developing?productId={productId}`。

> * 开发模式需要用到您的腾讯云登录态，并会用您腾讯云的 Uin + OwnerUin 注册一个新的腾讯连连用户，并会帮您初始化一个虚拟家庭及一个用于调试的设备，让您无需关注这背后的设备绑定、家庭等逻辑，而专注于面板的开发
> * 必须使用对该产品有操作权限的腾讯云账号登录才可以对此产品进行开发
> * 由于微信和QQ侧限制，H5调试时的腾讯云登录不支持 QQ/微信登陆，您可以使用邮箱、子用户或公众号方式登录。

### 4. 访问蓝牙发现+面板H5页开发模式

通过浏览器或"微信开发者工具 - 公众号页面调试"来访问H5面板开发模式，地址为：
- 蓝牙发现页开发模式：`https://iot.cloud.tencent.com/h5panel/developing/bluetooth-search?bluetoothDevId={bluetoothDevId}&productId={productId}`。
- 蓝牙操控面板开发模式：`https://iot.cloud.tencent.com/h5panel/developing/bluetooth-panel?bluetoothDevId={bluetoothDevId}&deviceId={deviceId}&familyId={familyId}&roomId={roomId}&familyType={familyType}`

- 链接参数从哪里呢？别急，有快捷方式，见下面`开发模式链接获取方式`的说明

> * 开发模式链接获取方式：
    >> * step1: 腾讯连连小程序进入`我的->关于我们->长按连连logo->进入蓝牙面板开发模式
    >> * step2: 蓝牙发现页开发模式链接获取方式：长按添加设备页面->提示链接复制成功
    >> * step3: 蓝牙操控面板链接获取方式: 长按主页某个设备item-> 提示链接复制成功
> * 登陆方式同3
> 关于蓝牙发现页开发的说明
   >> * 方案实现原理为 设备->(蓝牙)->小程序->(websocket)->H5；所以开发的时候需要保持小程序运行的状态来进行设备端和小程序的蓝牙通信
   >> * 实现自定蓝牙协议的DeviceAdapter，如下面代码所示
   >> * 蓝牙相关的接口参见[H5 SDK 文档](https://www.npmjs.com/package/qcloud-iotexplorer-h5-panel-sdk)
```
import sdk, { DeviceAdapter } from 'qcloud-iotexplorer-h5-panel-sdk';

export class DemoBluetoothDeviceAdapter extends DeviceAdapter {
    //每个蓝牙设备这部分都不一样
    static serviceId = 'XXXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX';

    constructor(props) {
        super(props);

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

 ```


### 真实设备调试

在原url上，多传个需要调试的真实设备 deviceName 即可，如：

`https://iot.cloud.tencent.com/h5panel/developing?productId={productId}&deviceName={yourRealDeviceDeviceId}`

> 注意事项：
> * 使用真实设备调试时，会自动将该设备绑定到您的调试用户的家庭下，同时会解除该设备原来的绑定关系
> * “已发布” 状态的产品不支持真实设备调试，因为存在将真实用户正在使用的设备踢除绑定关系的风险。

## Demo

### 启动

```
npm install
npm run dev
```

启动后可通过 `https://localhost:9000/index.js` 来访问编译后的 JS 文件

### 配置代理

```
# 以 Whistle 代理为例：
developing.script/developing.js https://127.0.0.1:9000/index.js
```

### 访问开发工具

访问 https://iot.cloud.tencent.com/h5panel/developing?productId={productId} ，可看到渲染出来的 H5 面板。

