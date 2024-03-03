import { log } from 'console';
import crypto from 'crypto';

const pubkey =
  'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq/ETwUMhqIGHmwPyKMXCxbGlbpK1khzwECHZmpLS2dDkGXj3aICekhSslHSeq0EjAaldBioar2Y70XFo6B8zLyypGEY89Hs/Jv9amMWdVNIhrIEJgJ66W+HBfdTBh2IJD8oMnU+vgZKl+Ie2YK8AsdalcnIAqmVA6b0wBTsJO6to9dFb4EbD5/bnm3CYEsP9PWH/3tMte5vnCSXExDNbbL8gX/FG0pQD48hRyBd+Sg6X2s0EQZpKw9TBrzmDryCs5AIS/zsiV15ICNPkHIF3PUgzg/u2gL0ByxMBH5lkYdZNpFFCF5cFCmDiPAbHhKj3hhl0pkIfYSW3xuSB05chEwIDAQAB';

function crypto_encrypt(value: string, key_value: string): string {
  const key = crypto.createPublicKey({
    key: Buffer.from(key_value, 'base64'),
    format: 'der',
    type: 'spki'
  });

  const response = crypto
    .publicEncrypt(
      {
        key,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: 'sha256'
      },
      Buffer.from(value, 'utf-8')
    )
    .toString('base64');

  return response;
}

const pass = crypto_encrypt('1.aV3fg3çior', pubkey);

log(pass);
