import React, { useEffect, useState, useReducer } from 'react';
import sdk from 'qcloud-iotexplorer-h5-panel-sdk'
import classNames from 'classnames';

import './SearchPage.less';

const { blueToothAdapter, familyId, productId, roomId } = sdk;

function reducer(state, action) {
	const { type, payload } = action;

	switch (type) {
		case 'startSearch':
			return {
				...state,
				devices: [],
				findError: false,
				searching: true,
				connecting: false,
				msg: '正在搜索设备...'
			};
		case 'stopSearch':
			return {
				...state,
				findError: false,
				searching: false,
				connecting: false,
			};
		case 'onFoundDevice':
			return {
				...state,
				findError: false,
				connecting: false,
				devices: payload.devices,
			};
		case 'findError':
			return {
				...state,
				findError: true,
				connecting: false,
				msg: `发现错误，详细信息为：${payload.err.errCode}:${payload.err.msg}`
			};
		case 'startConnect':
			return {
				...state,
				findError: false,
				connecting: true,
				msg: '连接中...'
			};
		case 'connectSuccess':
			return {
				...state,
				findError: false,
				connecting: false,
				connectDeviceInfo: {
					...state.connectDeviceInfo,
					...payload,
				},
				msg: '连接成功'
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
				msg: '断开连接'
			};
	}

	return state;
}

const windowHeight = window.innerHeight || document.documentElement.clientHeight;

export function SearchPage() {
	const [state, dispatch] = useReducer(reducer, {
		devices: [],
		searching: false,
		connecting: false,
		connectDeviceInfo: null,
	});

	const startSearch = async () => {
		dispatch({ type: 'startSearch' });

		try {
			await blueToothAdapter.startSearch({
				onError: err => {
					console.error('search on error', err);
				},
				onSearch: devices => {
					dispatch({ type: 'onFoundDevice', payload: { devices } });
				},
			});
		} catch (err) {
			console.error('start search fail', err);
			dispatch({ type: 'findError', payload: { err } });
		}
	};


	const doConnect = async (deviceInfo) => {
		try {
			dispatch({ type: 'startConnect' });
			const {
				mac
			} = deviceInfo;

			const deviceAdapter = await blueToothAdapter.connectDevice({
				...deviceInfo,
				deviceName: mac,
				productId: sdk.productId,
			});

			console.log('连接成功！');

			// 先写死吧，后面可以从链接上取
			// const roomId = 'r_25b2a01c4d4740149b54212a05007bca';

			// 需要绑定后才可操作
			await deviceAdapter.bindDevice({
				familyId,
				roomId,
			});

			console.log('绑定成功！');

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
		} catch (err) {
			console.error(err);
		}
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
		<div className="bluetooth-search-container">
			<button className="btn btn-primary" onClick={startSearch}>开始搜索设备</button>
			<div className="bluetooth-search-item-list" style={{ minHeight: `${windowHeight}px` }}>
				<div className={classNames("panel-status", {
					"loading": state.searching,
					"error": state.findError
				})}>
					<div className="searching-txt"> {state.msg}</div>
				</div>

				<div className="search-result">
					<div className="search-title">已发现如下设备:</div>
					<div className="search-body"/>
					<div className="search-row">
						{
							state.devices.map(item => (
								<div className="search-item">
									<div className="item-name">
										{item.name}
									</div>
									<div
										className="link-btn need-hover"
										onClick={() => connect(item)}
									>
										连接
									</div>
								</div>
							))
						}
					</div>
				</div>
			</div>
		</div>
	)
}
