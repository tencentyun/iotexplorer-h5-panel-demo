import React from 'react';
import ReactDOM from 'react-dom';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Link
} from "react-router-dom";
import { DevicePanel } from './DevicePanel';
import { SearchPage, PanelPage, DemoBluetoothDeviceAdapter } from './BluetoothDemo';
import sdk from 'qcloud-iotexplorer-h5-panel-sdk';

sdk.blueToothAdapter.addAdapter(DemoBluetoothDeviceAdapter);

import './style.less';

function App() {
	const isBluetoothDevice = true;
	const isDev = process.env.NODE_ENV !== 'production';

	let basename = isDev ? '/h5panel/developing' : '/h5panel';

	// 蓝牙的调试模式下路由需要加上 /live
	if (isBluetoothDevice && isDev) {
		basename += '/live';
	}

	return (
		<Router basename={basename}>
			<div>
				<Switch>
					{/* 蓝牙搜索页 */}
					<Route path="/bluetooth-search">
						<SearchPage/>
					</Route>
					<Route path="/">
						<DevicePanel/>
					</Route>
				</Switch>
			</div>
		</Router>
	)
}

ReactDOM.render(<App/>, document.getElementById('app'));