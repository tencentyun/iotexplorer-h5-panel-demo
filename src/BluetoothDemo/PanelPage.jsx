import React, { useEffect, useState, useRef } from 'react';
import sdk from 'qcloud-iotexplorer-h5-panel-sdk';

const { blueToothAdapter } = sdk;

import classNames from 'classnames';

console.log('sdk', sdk);

export function PanelPage() {
	const deviceAdapterRef = useRef(null);
	const [deviceConnectInfo, setDeviceConnectInfo] = useState({
		status: 'connecting',
		msg: '',
	});
	const onMessageRef = useRef(message => {
		console.log('onMessage', message);
	});
	const onDisconnectRef = useRef(() => {
		setDeviceConnectInfo({
			status: 'disconnected',
			msg: '温度计已断开',
		});
		deviceAdapterRef.current = null;
	});

	const connectDevice = async () => {
		try {
			setDeviceConnectInfo({
				status: 'connecting',
				msg: '蓝牙设备连接中…',
			});

			await blueToothAdapter.init();
			const device = await blueToothAdapter.searchDevice({
				deviceName: sdk.deviceName,
			});

			if (device) {
				if (!deviceAdapterRef.current) {
					const { deviceId, serviceId, deviceName, name } = device;

					const deviceAdapter = deviceAdapterRef.current = await blueToothAdapter.connectDevice({
						deviceId,
						serviceId,
						deviceName,
						productId: sdk.productId,
						name,
					});

					deviceAdapter
						.on('message', onMessageRef.current)
						.on('disconnect', onDisconnectRef.current);
				}

				console.log('connected');

				setDeviceConnectInfo({
					status: 'connected',
					msg: '已连接',
				});
			} else {
				setDeviceConnectInfo({
					status: 'disconnected',
					msg: '无法连接温度计',
				});
			}
		} catch (err) {
			console.error('connectDevice err', err);
			if (err) {
				setDeviceConnectInfo({
					status: 'disconnected',
					msg: err.errCode ? err.msg : '无法连接温度计',
				});
			}
		}
	};

	useEffect(() => {
		connectDevice();

		return () => {
			if (deviceAdapterRef.current) {
				deviceAdapterRef.current
					.off('message', onMessageRef.current)
					.off('disconnect', onDisconnectRef.current);
				deviceAdapterRef.current = null;
			}
		};
	}, []);

	return (
		<div className="bluetooth-panel">
			<div className="device-status-text">
				<div className="text">{deviceConnectInfo.msg}</div>
				{deviceConnectInfo.status === 'disconnected' && (
					<div>
						<div className="text">，</div>
						<div className="link" onClick={connectDevice}>点击重试</div>
					</div>
				)}
			</div>
		</div>
	)
}
