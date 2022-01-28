import { Request, Response } from 'express';

export interface PageInterface {
	readonly path: string | RegExp;

	get?(req: Request, res: Response): any;

	post?(req: Request, res: Response): any;

	put?(req: Request, res: Response): any;

	patch?(req: Request, res: Response): any;

	delete?(req: Request, res: Response): any;

	copy?(req: Request, res: Response): any;

	head?(req: Request, res: Response): any;

	options?(req: Request, res: Response): any;
}

export default class PageTemplate implements PageInterface {
  readonly path: string | RegExp;

  constructor(path: string | RegExp) {
    this.path = path;
  }
}
