# iotexplorer-h5-panel-demo

腾讯连连(腾讯云物联网控制端)自定义H5面板开发demo react版，

如需要 vue 框架 demo [请点击查看](https://github.com/tencentyun/iotexplorer-h5-panel-template)：

## 使用说明

如果您还不了解 h5 面板，可以查看[快速入门](https://cloud.tencent.com/document/product/1081/49027)及[开发指南](https://cloud.tencent.com/document/product/1081/49028)

## 开发配置

准备环境:

- [Node.js](https://nodejs.org) (>= 12.10 required, >= 14.17 preferred)
- [npm](https://www.npmjs.com) (>= 6.x) or [yarn](https://yarnpkg.com) (>= 1.22)
- [whistle](https://github.com/avwo/whistle)
- [SwitchyOmega](https://github.com/FelisCatus/SwitchyOmega).

```bash
npm run dev:dualmode # 开发双路通信面板
npm run dev:wugan # 开发无感通信面板
npm run dev # 开发默认面板
```

如果打包某个面板，只需要将`dev`改为`release` 即可
腾讯连连自定义H5面板Demo

关于H5面板的详细原理及开发、调试流程，请参考[官网文档](https://cloud.tencent.com/document/product/1081/49028#h5-.E9.9D.A2.E6.9D.BF.E5.BC.80.E5.8F.91).

## Quick Start

```
npm install
npm run dev
```

启动后可通过 `https://localhost:9000/index.js` 来访问编译后的 JS 文件


其他问题

所需工具和实现原理：
[SwitchyOmega](https://github.com/FelisCatus/SwitchyOmega).

添加proxy ,将在浏览器中的访问的请求通过该插件代理到  `127.0.0.1:8899` ，再通过 whistle 将请求代理到本地服务。

[whistle](https://github.com/avwo/whistle)

工具安装后，通过 `whistle start` 启动代理服务，通过 浏览器访问 `127.0.0.1:8899` 
在 whistle 页面的，新建 rule 规则 ，配置如下：

```shell
developing.script/developing.js https://127.0.0.1:9000/index.js
developing.style/developing.css https://127.0.0.1:9000/index.css
# https://iot.cloud.tencent.com:9000 https://127.0.0.1:9000 # 用于支持HMR 可以不用
```

1、wistle 导入https证书通过中间人方式解决https 抓包问题。
[解决方法](https://jingyan.baidu.com/article/c843ea0bc4142a77921e4a79.html)

2、chorme 抓取https包提示不是私密链接的问题
[解决方案](https://blog.51cto.com/u_15399817/4583253)