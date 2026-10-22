
function sm2Patch(sigalg) {
	// 支持SM2签名
  if (!KJUR.asn1.x509.OID.name2oidList[sigalg]){
    var old_ECDSA_getName = KJUR.crypto.ECDSA.getName;
    KJUR.crypto.ECDSA.getName = function(s) {
      if (s === '2a811ccf5501822d'){
        return 'sm2p256v1'; // 1.2.156.10197.1.301
      }
      return old_ECDSA_getName(s);
    };

    KJUR.crypto.ECParameterDB.regist("sm2p256v1", 256, "fffffffeffffffffffffffffffffffffffffffff00000000ffffffffffffffff", "fffffffeffffffffffffffffffffffffffffffff00000000fffffffffffffffc", "28e9fa9e9d9f5e344d5a9e4bcf6509a7f39789f515ab8f92ddbcbd414d940e93", "fffffffeffffffffffffffffffffffff7203df6b21c6052b53bbf40939d54123", "1", "32c4ae2c1f1981195f9904466a39c9948fe30bbff2660be1715a4589334c74c7", "bc3736a2f4f6779c59bdcee36b692153d0a9877cc62a474002df32e52139f0a0", []);

    KJUR.asn1.x509.OID.name2oidList["sm2p256v1"] = "1.2.156.10197.1.301";
    KJUR.asn1.x509.OID.name2oidList["SM3withSM2"] = "1.2.156.10197.1.501";

    var old_Signature = KJUR.crypto.Signature;
    KJUR.crypto.Signature = function(params){
      if (params.alg !== "SM3withSM2"){
        return old_Signature.call(this, params);
      }
      this.init = function(key){
        this.key = key;
      };
      this.updateHex = function(data){
        this.data = data; // support array?
      };
      this.sign = function(){
        var key = this.key;
        return sm2.doSignature(this.data, key.prvKeyHex,  {input:"hex", hash:true, der: true, publicKey:key.pubKeyHex});
      };
      this.verify = function(sighex){
        var key = this.key;
        return sm2.doVerifySignature(this.data, sighex, key.pubKeyHex, {input:"hex", hash:true, der: true, publicKey:key.pubKeyHex});
      };
    }
  }
}

(function(sigalg){
	setTimeout(function() {
		sm2Patch(sigalg)
	}, 500);
})("SM3withSM2");
