import { Request, Response } from 'express';
import { WebServer } from './modules';
import { AuthService } from './services';

const config = {
  auth: {
    password: 'PasswordPasswordPasswordPassword',
    lifetime: 3600,
    iv: 'PasswordPassword',
  },
};

const server = new WebServer();
const auth = new AuthService(config.auth);

server.use(auth.use('optional'));

server.route('/token').post((req: Request, res: Response) => {
  const token = auth.genToken();
  res.send({ token, expires: config.auth.lifetime });
}).get((req: Request, res: Response) => {
  auth.use('strict')(req, res, () => {});
  const token = req.headers.authorization.split(' ')[1];
  const data = auth.getTokenData(token);
  const endDate = data.creationDate + data.lifetime;
  res.send({ token, data, toExpire: endDate - (new Date()).getTime() });
});

server.start();
