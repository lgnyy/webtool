
var ca = {rsaKey:{}, sm2Key:{}};

ca.rsaKey.subject = "3043310B300906035504060C02434E310C300A060355040A0C034C474E310C300A060355040B0C034C474E3118301606035504030C0F4C474E20526F6F7420525341204341";
ca.rsaKey.kid = "a33665e0cc7d6d6b2f64cbf4d768d880826ce191";
ca.rsaKey.priKey = "-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA0zVWb8X8joqVUCqDCHhP5nsO9MBUHafYi+UrY7zddCbBIYWH\nng+TYt/HNURMP7wMgaeGSh911ueuURASmHhdDABpEPmfy4m1Vnyz5ptz3lhHniHW\nrJ6QjJGQLmO7xahtfRbnGAp8cV8YB7ZJIMVdVv/Ual0qr23pyFLOP+xSuLYuIrWU\ngSq/0eL9i0HJcD6oYJBoypEUsrb0slurNLlQMp21vK5rXckwKjL3eNgIvL3CnIs1\nckOjoMwm6N7bcHV9QM42r8W+gsYWsZ5s10X9X7q22UA3aZnQOmdD7457dwJ/E0GJ\nOXnWGYiU7pBijgrtLiEf1hIXQA0vboBBLTImtwIDAQABAoIBADVsW2XAXaasdSIm\n7qf4zrUM0XalI2Gw7/xKxlPfFODpYJabEPexFuW+lsPpd6Pza/JrrnMXTBZE2fnV\nJ+77GwYLIIhTq9CvD3hF6LdfAMrv54WfJ47YONXlh+PEBF31wWQPo/qXxGxk0k45\nFHw+j+KOqWsSD9b55VVvZI4Ut8PSk0v9IeEkIv+BR3IEJn9C0/kDrkx9G44O88Tz\n6r/cpn5yIoCPiYTDNlXmKkwal0sf8XQAG+lrWIb/3paKvbn7FaZiLjbt/R7Q02y9\nYfMm+QZ+rJNqTF+4b6CGPJlbblIGTTxBSBDOfIaGz5KxpEojt1S1ltUR4IR8ciq+\nuFpKc2ECgYEA8530X2B07pfCpo59GPBUDZIDruMnZb7d7AXGLIdjGnf6Cl6BvDNN\njkNXkv7rrHTQrdeRasVui3EDHDUqpnd6xVFGjK4VkwU7OiUxKaOMZhcMd6N+dyQn\nSCr+CY/EA4BXnbRfxo7j3E+mzpn3Y+Qw5LSixsKnGMQ6R3fJOf6pkMcCgYEA3fGr\nDHoz4IVwHpmhRUGs/6cRLTr0IUZt+DqOnJ/pGVfbDJJDcjUcp+xBHPCTACrX1oTs\nsoOUd0uXmXOURDgdFcarj12WOYf7l6H9AvNYDLipwHuPv+Z9pSfUI3p17DZIjNuD\n2JgbfdOm90b5OIwrhNyvio+NzyUgf11h35XlqpECgYEAlso9OU/l8MzEsf1eVzJi\nhGfNmdGGUEb87BuC14sRf4+lmAd5O/lxVs4+BYF+dKd1hzT4EGOWEf9okmwiMxmf\nR0UQawFR30eMqmfc704JGCPKFr9/BtW87sGVrmtrQ1OMZ9P+uFM3nOU8dYL9irny\nvY1Fd8uCTCUhgZ0WU6xaXn8CgYBUyDuqIYhtrSueVNuZRDRc2KokGBAoIepiV6Qg\nyqlVyAziaYEgQI+4yfQ5pODSwIsA5Hgy3Ta6t4Kq2M77nF/n8KOauYpoYbzHONcY\n6HJrMaOO5uSLzvWSQHu2LdKcMERYooZkF/7wewieD1umsUzyjQb1rE7koW8fmEGK\nEo3QMQKBgQDRx9nWuGxGfyzY3Vdv80MOSRZoMJFJNqelBtbrwmFBruLGkyuwzE77\n0s3K0jjNHDStIUu00I4VUD1psrD8TUKETYxWqUpBWvuhVvBuu9LbVMPD69l8Jgos\nWK8UjyVsJtwLs2ajEnccRtHgZDLGCPNH2kaVt2vuS62MFLbBc02lbQ==\n-----END RSA PRIVATE KEY-----";
ca.sm2Key.subject = "3043310B300906035504060C02434E310C300A060355040A0C034C474E310C300A060355040B0C034C474E3118301606035504030C0F4C474E20526F6F7420534D32204341";
ca.sm2Key.kid = "abdd59364ce30bdb93dcbd8b74d6cf5a44378b5f";
ca.sm2Key.priKey = "-----BEGIN EC PRIVATE KEY-----\nMHcCAQEEIF7rjyMurLh4O9TZvj9vRrYAYEeYDETZMO8oAO6Etng3oAoGCCqBHM9V\nAYItoUQDQgAEh0SUXfpVbFAK9oyg+MFDp5co7y1O5RnZuAY+mXMufTaKo2hn4QAa\nPghEmqAYrI90uds/1Qzl4Iy/KsdUG274Bg==\n-----END EC PRIVATE KEY-----";

ca.makeCert = function(certparam){
	// 支持SM2签名
  if (!KJUR.asn1.x509.OID.name2oidList[certparam.sigalg]){
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

	var cakey = (certparam.sigalg === "SM3withSM2")? ca.sm2Key : ca.rsaKey;

	if (certparam.sbjpubkey.indexOf("-----BEGIN CERTIFICATE REQUEST-----") >= 0){
		var p10 = KJUR.asn1.csr.CSRUtil.getParam(certparam.sbjpubkey, true);
		certparam.sbjpubkey = KEYUTIL.getKey(p10.sbjpubkey);
		if (!certparam.subject){
			certparam.subject = p10.subject;
		}

		// verify p10
		var sig = new KJUR.crypto.Signature({alg: p10.sigalg});
		sig.init(certparam.sbjpubkey);
		sig.updateHex(p10.tbs);
		if (!sig.verify(p10.sighex)){
			throw new Error("verify p10 fail!");
		}
	}else{
		certparam.sbjpubkey = KEYUTIL.getKey(certparam.sbjpubkey);
	}
	certparam.cakey = KEYUTIL.getKey(certparam.cakey || cakey.priKey);
	
	if (!certparam.serial){
		certparam.serial = {"int":Math.floor(new Date().getTime() / 1000)};
	}
	if (!certparam.issuer){
		certparam.issuer =  {"hex": cakey.subject};
	}
	if (!certparam.notbefore){
		var utc = new KJUR.asn1.DERUTCTime();
		certparam.notbefore = utc.formatDate(new Date(), "utc");
	}
	if (!certparam.notafter){
		var utc = new KJUR.asn1.DERUTCTime();
		var dt = new Date();
		dt.setFullYear(dt.getFullYear() +1);
		certparam.notafter = utc.formatDate(dt, "utc");
	}
	if (!certparam.subject){
		certparam.subject =  {"str": "/C=CN/O=LGN/CN=test1"}
	}
	
	const defext =  [
		{"extname":"keyUsage", "names":["digitalSignature","nonRepudiation","keyEncipherment","dataEncipherment","keyAgreement"]},
		{"extname":"extKeyUsage", "array":["serverAuth","clientAuth"]},	
		{"extname":"cRLDistributionPoints", "array":[{"dpname":{"full":[{"dn":"/CN=crl88888/OU=crl/O=LGN"}]}}]},
		{"extname":"basicConstraints", "cA": false},
		{"extname":"authorityKeyIdentifier", "kid": {"hex": cakey.kid}},
		{"extname":"subjectKeyIdentifier", "kid": {"hex": KEYUTIL.getKeyID(certparam.sbjpubkey)}}
	];
	if (!certparam.ext){
		certparam.ext = defext;
	}else {
		for (let e1 of defext){
			if (!certparam.ext.find((e2) => e2.extname === e1.extname)){
				certparam.ext.push(e1);
			}
		}
	}

	var certpem = (new KJUR.asn1.x509.Certificate(certparam)).getPEM();
	return certpem;
};

ca.dumpCert = function(certpem){
    var certdump = ASN1HEX.dump(pemtohex(certpem));
    return certdump;
};