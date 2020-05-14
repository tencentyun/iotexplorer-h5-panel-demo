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

### 真实设备调试

在原url上，多传个需要调试的真实设备 deviceName 即可，如：

`https://iot.cloud.tencent.com/h5panel/developing?productId={productId}&deviceName={yourRealDeviceDeviceId}`

> 注意事项：
> * 使用真实设备调试时，会自动将该设备绑定到您的调试用户的家庭下，同时会解除该设备原来的绑定关系
> * “已发布” 状态的产品不支持真实设备调试，因为存在将真实用户正在使用的设备踢除绑定关系的风险。

## 真机调试

对于已发布的产品，在小程序中调试H5面板非常困难，为了解决该已绑定设备的面板调试问题，我们提供了真机调试方案。

用于可以在小程序中打开开发模式，之后可以通过长按设备列表中需要调试的设备，来获取到一个可在浏览器中访问的真实设备H5面板的调试地址，来用于真机调试。

1. 打开《腾讯连连》小程序，进入 "我的" - "关于我们"，长按 "腾讯连连" Logo，选择 "进入开发模式"；

2. 进入设备列表，长按需要调试的设备，从弹层中选择 "生成H5面板调试地址"，之后该调试地址将被复制到剪贴板，然后就可以通过浏览器访问该调试地址来进行真机面板调试。 

## 蓝牙设备
参见[蓝牙设备文档](https://github.com/tencentyun/iotexplorer-h5-panel-demo/blob/master/BLUETOOTH-README.md)

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

