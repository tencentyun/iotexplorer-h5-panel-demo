export const noop = () => {};

export function arrayBufferToHexStringArray(buffer) {
	try {
		if (Object.prototype.toString.call(buffer) !== '[object ArrayBuffer]') {
			throw 'invalid array buffer';
		}
		const dataView = new DataView(buffer);

		const hexStrArr = [];

		for (let i = 0, l = dataView.byteLength; i < l; i++) {
			const str = dataView.getUint8(i);
			let hex = (str & 0xff).toString(16);
			hex = (hex.length === 1) ? `0${hex}` : hex;
			hexStrArr.push(hex.toUpperCase());
		}

		return hexStrArr;
	} catch (err) {
		console.error('arrayBufferToHexStringArray error', err);
		return [];
	}
}

export const delay = timeout => new Promise(resolve => setTimeout(() => resolve(), timeout));

export function hexToArrayBuffer(hex) {
	return new Uint8Array(hex.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16))).buffer;
}