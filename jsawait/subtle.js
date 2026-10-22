
async function subtle_digest(input){
	let digestResult = await window.crypto.subtle.digest(input.algorithm, input.data);
	return new Uint8Array(digestResult);
}

async function subtle_generateKey(input){
	let key = await window.crypto.subtle.generateKey(input.algorithm, true, input.keyUsages);
	let exported = await window.crypto.subtle.exportKey(input.format, key.privateKey);
	//let exported = await window.crypto.subtle.exportKey("spki", key.publicKey);
	return new Uint8Array(exported);
};

async function subtle_sign(input){
	let key = await window.crypto.subtle.importKey(input.format, input.keyData, input.algorithm, true, input.keyUsages);
	let signature = await window.crypto.subtle.sign(input.algorithm2, key, input.data);
	return new Uint8Array(signature);
}

async function subtle_verify(input){
	let key = await window.crypto.subtle.importKey(input.format, input.keyData, input.algorithm, true, input.keyUsages);
	let verifyResult = await window.crypto.subtle.verify(input.algorithm2, key, input.signature, input.data);
	return verifyResult;
}

async function subtle_encrypt(input){
	if (input.algorithm2.name === "AES-ECB"){
		let algorithm = {name: "AES-CBC", iv: new Uint8Array(16)};
		let key = await window.crypto.subtle.importKey(input.format||"raw", input.keyData, algorithm, true, input.keyUsages || ["encrypt"]);
		let len = input.data.length & 0xFFF0;
		let result = new Uint8Array(input.padding? (16 + len) : len);
		for (let i=0; i<len; i+=16){
			let encryptData1 = await window.crypto.subtle.encrypt(algorithm, key, input.data.subarray(i,i+16));
			result.set(new Uint8Array(encryptData1).subarray(0, 16), i);
		}
		if (input.padding){
			let encryptData2 = await window.crypto.subtle.encrypt(algorithm, key, input.data.subarray(len));
			result.set(new Uint8Array(encryptData2).subarray(0, 16), len);
		}
		return result;
	}else{
		let key = await window.crypto.subtle.importKey(input.format||"raw", input.keyData, input.algorithm, true, input.keyUsages || ["encrypt"]);
		let encryptData = await window.crypto.subtle.encrypt(input.algorithm2, key, input.data);
		return new Uint8Array(encryptData);
	}
}

async function subtle_decrypt(input){
	if (input.algorithm2.name === "AES-ECB"){
		throw new Error("not support!");
	}else{
		let key = await window.crypto.subtle.importKey(input.format||"raw", input.keyData, input.algorithm, true, input.keyUsages || ["decrypt"]);
		let decryptData = await window.crypto.subtle.decrypt(input.algorithm2, key, input.data);
		return new Uint8Array(decryptData);
	}
}
