import * as crypto from 'crypto';

export type Token = {
	lifetime: number,
	creationDate: number,
	iv: string,
	data?: any,
}

export type AuthParams = {
	lifetime?: number,
	password: string,
	algorithm?: 'aes256',
	iv?: string,
};

export default class Auth {
  readonly lifetime: number;

  private readonly password: string;

  readonly algorithm: 'aes256';

  private readonly iv: string;

  constructor({
    lifetime = 3600, password, algorithm = 'aes256', iv,
  }: AuthParams) {
    this.lifetime = lifetime;
    this.password = password;
    this.algorithm = algorithm;
    this.iv = iv ?? crypto.randomBytes(8).toString('hex');
  }

  genToken(): string {
    const cipher = crypto.createCipheriv(
      this.algorithm,
      this.password,
      this.iv,
    );
    const tokenData: Token = {
      lifetime: this.lifetime,
      creationDate: (new Date()).getTime(),
      iv: this.iv,
    };
    const data = JSON.stringify(tokenData);
    const parts = [];
    parts.push(cipher.update(data));
    parts.push(cipher.final());
    return Buffer.concat(parts).toString('base64');
  }

  getTokenData(token: string): Token | null {
    const decipher = crypto.createDecipheriv(
      this.algorithm,
      this.password,
      this.iv,
    );
    let tokenString = '';
    try {
      tokenString += decipher.update(token, 'base64', 'utf-8');
      tokenString += decipher.final('utf-8');
    } catch (e) {
      return null;
    }
    let tokenData = null;
    try {
      tokenData = JSON.parse(tokenString);
    } catch (e) {
      console.log(`Failed to parse token: ${tokenString}`);
    }
    return tokenData as Token;
  }

  isValid(token: string): boolean {
    const tokenData = this.getTokenData(token);
    if (tokenData === null) {
      return false;
    }
    const endTime = tokenData.creationDate + tokenData.lifetime;
    const nowTime = (new Date()).getTime();
    return nowTime <= endTime;
  }
}
