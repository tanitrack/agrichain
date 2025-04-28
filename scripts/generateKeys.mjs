import * as jose from 'jose';

async function generateKeys() {
  const { publicKey, privateKey } = await jose.generateKeyPair('RS256', {
    extractable: true,
  });

  const privateKeyPKCS8 = await jose.exportPKCS8(privateKey);
  const publicJWK = await jose.exportJWK(publicKey);

  const jwk = {
    ...publicJWK,
    use: 'sig',
    kid: 'key-1',
    alg: 'RS256',
  };

  console.log('CONVEX_PRIVATE_JWK=' + JSON.stringify(privateKeyPKCS8));
  console.log('CONVEX_PUBLIC_JWK=' + JSON.stringify({ keys: [jwk] }));
}

generateKeys();
