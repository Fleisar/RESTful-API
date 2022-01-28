import { Request, Response } from 'express';
import { AuthService } from '../services';
import { PageTemplate } from '../objects';

export default class TokenPage extends PageTemplate {
  private authService: AuthService;

  constructor(path: string, authService: AuthService) {
    super(path);
    this.authService = authService;
  }

  get(req: Request, res: Response) {
    this.authService.use('strict')(req, res, () => {});
    const token = req.headers.authorization.split(' ')[1];
    const data = this.authService.getTokenData(token);
    const endDate = data.creationDate + data.lifetime;
    res.send({ token, data, toExpire: endDate - (new Date()).getTime() });
  }

  post(req: Request, res: Response) {
    const token = this.authService.genToken();
    res.send({ token, expires: this.authService.lifetime });
  }
}
