import * as express from 'express';
import {
  Express, IRoute, Request, Response, Router,
} from 'express';

export default class WebServer {
  readonly port: number;

  readonly root: string;

  protected server: Express;

  constructor({ port = 3000, root = '/api' }: {
		port?: number,
		root?: string,
	} = {}) {
    this.port = port;
    this.root = root;
    this.server = express();
  }

  use(func: (...[]) => void): void {
    this.server.use(func);
  }

  route(path: string | RegExp) {
    return this.server.route(path);
  }

  bind(path: string | RegExp, callback: (req: Request, res: Response) => void) {
    this.server.all(path, callback);
  }

  start(): void {
    this.server.listen(this.port, () => {
      console.log(`Server are now listening on ${this.port}`);
    });
  }
}
