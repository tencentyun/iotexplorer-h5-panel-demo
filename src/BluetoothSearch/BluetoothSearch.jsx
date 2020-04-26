import React, { useEffect, useRef, useState, useReducer } from 'react';
// import sdk from 'qcloud-iotexplorer-h5-panel-sdk';
import sdk, { DeviceAdapter } from '../../../iot-explorer-h5-panel/sdk/src';
import classNames from 'classnames';
import { DemoDeviceAdapter } from './DemoDeviceAdapter';

console.log('sdk', sdk, DeviceAdapter);

const blueToothAdapter = sdk.blueToothAdapter;

blueToothAdapter.addAdapter(DemoDeviceAdapter);

function reducer(state, action) {
	const { type, payload } = action;

	switch (type) {
		case 'startSearch':
			return {
				...state,
				searching: true,
			};
		case 'stopSearch':
			return {
				...state,
				searching: false,
			};
		case 'onFoundDevice':
			return {
				...state,
				devices: payload.devices,
			};
		case 'startConnect':
			return {
				...state,
				connecting: true,
			};
		case 'connectSuccess':
			return {
				...state,
				connectDeviceInfo: {
					...state.connectDeviceInfo,
					...payload,
				},
			};
		case 'onMessage':
			return {
				...state,
				connectDeviceInfo: {
					...state.connectDeviceInfo,
					temperature: payload.data,
					timestamp: payload.timestamp,
				},
			};
		case 'disconnect':
			return {
				...state,
				connectDeviceInfo: {
					...state.connectDeviceInfo,
					isConnect: false,
				},
			};
	}

	return state;
}

export function BluetoothSearch() {
	const [state, dispatch] = useReducer(reducer, {
		devices: [],
		searching: false,
		connecting: false,
		connectDeviceInfo: null,
	});
	// const [devices, setDevices] = useState([]);
	// const [searching, setSearching] = useState(false);
	// const [connectDeviceInfo, setConnectDeviceInfo] = useState(null);
	// const onMsgRef = useRef(({
	// 	type,
	// 	data,
	// 	dataReported,
	// 	timestamp,
	// }) => {
	// 	setConnectDeviceInfo({
	// 		...connectDeviceInfo,
	// 		temperature: data,
	// 		timestamp,
	// 	})
	// });
	// const onDisconnectRef = useRef(() => {
	// 	setConnectDeviceInfo({
	// 		...connectDeviceInfo,
	// 		isConnect: false,
	// 	});
	// });

	const startSearch = async () => {
		dispatch({ type: 'startSearch' });

		try {
			await blueToothAdapter.init();

			await blueToothAdapter.startSearch({
				onError: err => {
					console.error('search on error', err);
					dispatch({ type: 'stopSearch' });
				},
				onSearch: devices => {
					dispatch({ type: 'onFoundDevice', payload: { devices } });
				},
			});
		} catch (err) {
			console.error('start search fail', err);
			dispatch({ type: 'stopSearch' });
		}
	};

	const reconnect = async () => {
		try {
			await doConnect(state.connectDeviceInfo.deviceInfo);
		} catch (err) {
			console.error(err);
		}
	};

	const doConnect = async (deviceInfo) => {
		dispatch({ type: 'startConnect' });

		const deviceAdapter = await blueToothAdapter.connectDevice({
			...deviceInfo,
			productId: sdk.productInfo.ProductId,
			// productId: '0V9XZQ6WT5',
		});

		dispatch({
			type: 'connectSuccess',
			payload: {
				deviceInfo,
				explorerDeviceId: deviceAdapter.explorerDeviceId,
				isConnect: true,
				name: deviceInfo.name,
			},
		});

		deviceAdapter
			.on('message', ({
				type,
				data,
				dataReported,
				timestamp,
			}) => {
				dispatch({
					type: 'onMessage',
					payload: {
						type,
						data,
						dataReported,
						timestamp,
					},
				});
			})
			.on('disconnect', () => dispatch({ type: 'disconnect' }));
	};

	const connect = async (deviceInfo) => {
		try {
			await blueToothAdapter.stopSearch();

			dispatch({ type: 'stopSearch' });

			await doConnect(deviceInfo);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<>
			<button onClick={startSearch}>开始搜索设备</button>
			{state.searching && (
				<div>
					搜索中...
				</div>
			)}
			{state.connecting && (
				<div>
					连接中...
				</div>
			)}
			{state.devices.map(device => (
				<div key={device.deviceName}>
					<div>
						设备名: {device.name}
					</div>
					<div>
						设备标识: {device.deviceName}
					</div>

					<button onClick={() => connect(device)}>连接</button>
				</div>
			))}

			{state.connectDeviceInfo && (
				<>
					{state.connectDeviceInfo ? (
						<div>当前已连接</div>
					) : (
						<div>设备已断开，
							<button onClick={reconnect}>重连</button>
						</div>
					)}

					<div>
						设备名称: {state.connectDeviceInfo.name}
					</div>

					<div>
						explorer设备id: {state.connectDeviceInfo.explorerDeviceId}
					</div>

					<div>
						收到温度：{state.connectDeviceInfo.temperature}
					</div>
					<div>
						上报温度：{state.connectDeviceInfo.timestamp}
					</div>
				</>
			)}
		</>
	)
}
