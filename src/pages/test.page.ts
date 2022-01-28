import { Request, Response } from 'express';
import { PageTemplate } from '../objects';

export default class TestPage extends PageTemplate {
  get(req: Request, res: Response) {
    res.send({ time: (new Date()).getTime() });
  }
}
