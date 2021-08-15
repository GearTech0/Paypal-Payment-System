import { Router } from "express";
import { PathParams } from "express-serve-static-core";

export class RouterType {
    protected handle = Router();
    protected path: PathParams;

    constructor(path: PathParams) {
        this.path = path;
    }

    public register(router: Router): void {
        router.use(this.path, this.handle);
    }

    public getHandle(): Router {
        return this.handle;
    }
}