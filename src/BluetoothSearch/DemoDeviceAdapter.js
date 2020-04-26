import sdk, { DeviceAdapter } from '../../../iot-explorer-h5-panel/sdk/src';
import { arrayBufferToHexStringArray } from '../utils';

export function isValidBodyTemperature(temperature) {
	return temperature >= 32 && temperature <= 42;
}

// TODO：注意，这里用的是华盛昌体温枪的协议写的demo，是私有协议，调通后上线前务必要把协议混淆掉
export class DemoDeviceAdapter extends DeviceAdapter {
	static serviceId = '0000FFF0-0000-1000-8000-00805F9B34FB';

	constructor(sdk, props) {
		super(sdk, props);

		this._serviceId = DemoDeviceAdapter.serviceId;
	}

	static deviceFilter(deviceInfo, targetDeviceName) {
		console.log('deviceInfo', deviceInfo);
		if (deviceInfo.advertisServiceUUIDs) {
			const matchedServiceId = deviceInfo.advertisServiceUUIDs.find(id => DemoDeviceAdapter.serviceId === id);

			if (matchedServiceId && Array.isArray(deviceInfo.advertisData)) {
				try {
					const macArr = deviceInfo.advertisData.slice(2);
					const mac = macArr.join(':');

					if (!targetDeviceName || (targetDeviceName && targetDeviceName === mac)) {
						if (deviceInfo.name && deviceInfo.name.indexOf('_') === -1) {
							deviceInfo.name = `${deviceInfo.name}_${macArr.slice(0, 2).join('')}`;
						}

						return {
							...deviceInfo,
							mac, // deprecated: 保留 mac 向前兼容
							deviceName: mac,
							serviceId: matchedServiceId,
						};
					}
				} catch (err) {
					console.error('parse mac error', err);
				}
			}
		}
	}

	handleBLEMessage(hex) {
		// 校验符合协议
		if (hex[0] === 'D5' && hex[hex.length - 1] === '0D') {
			const resultType = hex[1];
			// 数据长度
			const dataLength = parseInt(hex[2] + hex[3], 16);

			const dataArr = [];

			for (let i = 0, l = dataLength; i < l; i++) {
				dataArr.push(hex[4 + i]);
			}

			switch (resultType) {
				// 温度
				case 'F5': {
					// 报了两个数据，这个先不用
					// const surfaceTemperature = dataArr[0] + dataArr[1];
					const bodyTemperature = dataArr[2] + dataArr[3];

					const calculateTemperature = (value) => {
						const [unit, h, l1, l2] = value;

						let temperature = (h * 256 + parseInt(`0x${l1}${l2}`, 16)) / 10;

						// 不为0，说明是华氏度
						if (unit !== '0') {
							temperature = (temperature - 32) * 5 / 9;
						}

						return temperature;
					};

					const temperature = calculateTemperature(bodyTemperature);

					const result = {
						type: 'temperature',
						data: temperature,
					};

					// 只有合法温度才上报
					if (isValidBodyTemperature(temperature)) {
						result.reportData = { temperature };
					}

					return result;
				}
				// deviceName
				case 'A0': {
					const deviceName = dataArr.map(hex => String.fromCharCode(parseInt(hex, 16))).join('');

					return {
						type: 'deviceName',
						data: deviceName,
					};
				}
			}
		}

		return {
			type: 'unknown',
			data: hex,
		};
	}
}
