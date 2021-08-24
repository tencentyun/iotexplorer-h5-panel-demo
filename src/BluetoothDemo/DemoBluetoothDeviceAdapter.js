import { DeviceAdapter } from 'qcloud-iotexplorer-h5-panel-sdk';

export function isValidBodyTemperature(temperature) {
	return temperature >= 32 && temperature <= 42;
}

export class DemoBluetoothDeviceAdapter extends DeviceAdapter {
	static serviceId = '0000FFF0-0000-1000-8000-00805F9B34FB';

	// 在搜索时告诉蓝牙适配器哪些设备是我这类型的设备，并在除deviceInfo之外返回唯一标识deviceName和serviceId
	static deviceFilter(deviceInfo) {
		if (deviceInfo.advertisServiceUUIDs) {
			const matchedServiceId = deviceInfo.advertisServiceUUIDs.find(id => id === DemoBluetoothDeviceAdapter.serviceId);

			if (matchedServiceId && deviceInfo.advertisData) {
				try {
					const macArr = deviceInfo.advertisData.slice(2);
					const mac = macArr.join(':');

					return {
						...deviceInfo,
						deviceName: mac,
						serviceId: DemoBluetoothDeviceAdapter.serviceId,
					}
				} catch (err) {
					console.error('parse mac error', err);
				}
			}
		}
	}

	handleBLEMessage(hex) {
		// 校验符合协议
		if (hex[0] === 'D1' && hex[hex.length - 1] === '0D') {
			const resultType = hex[1];
			// 数据长度
			const dataLength = parseInt(hex[2] + hex[3], 16);

			const dataArr = [];

			for (let i = 0, l = dataLength; i < l; i++) {
				dataArr.push(hex[4 + i]);
			}

			switch (resultType) {
				// 温度
				case 'D9': {
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
			}
		}

		return {
			type: 'unknown',
			data: hex,
		};
	}
}
