# 蓝牙设备H5开发

蓝牙设备接入H5，需要实现两个页面：

1. 设备搜索页
2. 设备面板页

## 页面介绍

目前，这两个页面公用一个JS文件，厂商需要自行根据路由处理JS中渲染的页面，两个页面的路由分别为：

调试模式：

1. 搜索页： `/h5panel/developing/live/bluetooth-search`
2. 面板页： `/h5panel/developing/live`

生产环境：

1. 搜索页： `/h5panel/bluetooth-search`
2. 面板页： `/h5panel`

具体可以参考 demo 里 `app.jsx` 中的路由实现。 

### 1. 设备搜索页

负责处理蓝牙搜索，过滤出厂商自己的设备，并添加绑定到用户家庭下的功能。

由于各蓝牙设备协议和广播内容不同，需要厂商自行实现如何从小程序搜索的设备列表中查找出厂商自己设备的逻辑，具体参考 BluetoothDemo/SearchPage 页面。

### 2. 设备面板页

与普通的H5面板一样，厂商可以自定义自己设备的设备面板页面，唯一的区别在于设备面板页中需要通过sdk处理蓝牙设备的搜索、连接等逻辑。

## 开发流程

### 1. 搜索页

1. 进入开发模式（参见 README.md 中 `真机调试` 部分的介绍）
2. 打开添加设备页，长按搜索蓝牙设备区域，弹窗中选择 "生成H5蓝牙搜索页调试地址"
3. 通过手机微信或其他途径，将链接发送到电脑，通过电脑浏览器访问调试链接。链接形式如下，开发者需要自行在链接中填入需要开发的产品ID：

`https://iot.cloud.tencent.com/h5panel/developing/live/bluetooth-search?h5PanelDevId=2f2c9228c2904920976e2d356baf3fd4&productId=`

4. 同H5面板调试，搜索页默认会加载 `//developing.script/developing.js` 与 `//developing.style/developing.css` 文件，您需要配置代理转发将这两个地址转发到您本地开发的 JS/CSS 上。

### 2. 面板页

1. 首先，需要通过完成搜索页的开发，即成功绑定设备到家庭后，才能够进行H5面板页的开发
2. 下面的步骤与 `真机调试` 中介绍的步骤一致，即进入开发模式，长按设备列表中需要调试的设备，得到调试链接并在PC浏览器中打开，进行调试及开发。

## SDK蓝牙模块

首先，H5本身是无法调用小程序的蓝牙接口的，我们在SDK中封装了H5与小程序间的蓝牙协议通信机制，使用蓝牙H5必须要使用SDK的蓝牙模块能力。

蓝牙模块中有两个核心模块

1. 蓝牙适配器 blueToothAdapter，它负责了初始化适配器、建立通信通道、监听底层事件回调、暴露封装的搜索及连接蓝牙设备的方法等。

2. 设备适配器 deviceAdapter，它主要由厂商来实现，基类 DeviceAdapter 中实现了处理事件回调、连接设备等方法，而厂商则需要继承于基类来实现厂商自己设备的设备适配器，主要是处理搜索过程中的设备过滤、通信过程中的协议解析等。

具体的蓝牙模块文档可以参考SDk中的[蓝牙模块章节](https://www.npmjs.com/package/qcloud-iotexplorer-h5-panel-sdk/v/1.1.1#%E8%93%9D%E7%89%99%E6%A8%A1%E5%9D%97)。

### 设备适配器

厂商接入蓝牙H5的核心就在于实现一个蓝牙设备的适配器，一个设备适配器的子类需要做这么几件事情：

1. 所有设备适配器须继承于设备适配器基类 DeviceAdapter；

2. 子类构造函数上须挂一个静态属性 serviceId，它标识了该蓝牙设备的主服务ID；

3. 子类构造函数上须挂一个静态方法 deviceFilter: (deviceInfo) => { deviceName: string, serviceId: string, ...deviceInfo }

该方法是一个过滤器，在搜索蓝牙设备时会将每个搜出的设备信息传入该方法，如果判断是本产品的设备，则需在除入参deviceInfo之外返回设备唯一标识 deviceName 及 serviceId，否则返回空；

4. 子类需实现 handleBLEMessage 方法，用于处理蓝牙数据协议。该方法会在 onBLECharacteristicValueChange 回调触发后调用，并将收到的Buffer转为16进制字符串，然后调用 handleBLEMessage(hexString)。handleBLEMessage 的返回值厂商可以自定义，但是如果该条数据需要上报云端，那么在返回值中需要包含 `reportData` 字段，并在其中塞入需要上报到云端的数据（注意要与产品定义物模型匹配）。

如温度计在收到温度上报后，只有符合正常人体温度区间的温度才需要上报云端：

```
handleBLEMessage(hexString) {
    const temperature = handleMessage(hexString); // 自行实现数据协议处理

    // 不合法数据
    if (!temperature) return { type: 'unknown' };

    // 自行定义返回值，会透传给 'message' 事件，
    const result = {
        type: 'temperature',
        data: temperature,
    };
    
    // 判断数据需要上报
    if (isValid(temperature)) {
        // 上报字段需匹配物模型
        result.reportData = { temperatureModelKey: temperature };
    }

    return result;
}
```

详细的搜索页、蓝牙面板页，设备适配器的实现可以参考蓝牙DEMO。