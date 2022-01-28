import { Request, Response } from 'express';
import { AuthParams } from '../middleware/auth';
import { Auth } from '../middleware';

export default class AuthService extends Auth {
  private authConfig: AuthParams;

  private authModule: Auth;

  private errorHandler?: (req: Request, res: Response, errorDescription?: string) => void;

  private thrownErrors: boolean = true;

  use(type: 'strict' | 'optional') {
    return (req: Request, res: Response, next: () => void) => {
      if (!req.headers.authorization) {
        if (type !== 'strict') {
          return next();
        }
        const description = 'Authorization header is empty';
        if (this.errorHandler) {
          this.errorHandler(req, res, description);
        }
        if (this.thrownErrors) {
          res.header('Content-Type', 'application/json');
          res.send({ error: { description } });
        }
        return next();
      }
      const header = req.headers.authorization.split(' ');
      if (header.length > 2 || header[0] !== 'Bearer') {
        const description = 'Authorization format is corrupted or not supported';
        if (this.errorHandler) {
          this.errorHandler(req, res, description);
        }
        if (this.thrownErrors) {
          res.header('Content-Type', 'application/json');
          res.send({ error: { description } });
        }
        return next();
      }
      const token = header[1];
      const validation = this.isValid(token);
      if (!validation) {
        const description = 'Expired or invalid token';
        if (this.errorHandler) {
          this.errorHandler(req, res, description);
        }
        if (this.thrownErrors) {
          res.header('Content-Type', 'application/json');
          res.send({ error: { description } });
        }
        return next();
      }
      next();
    };
  }

  setErrorHandler(
    callback: (req: Request, res: Response, errorDescription?: string) => void,
    overwriteNative: boolean = true,
  ) {
    this.errorHandler = callback;
    this.thrownErrors = !overwriteNative;
  }
}
