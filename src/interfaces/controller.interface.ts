import { NextFunction, Request, Response } from "express";

export interface IController {
    getById: (req: Request, res: Response, next: NextFunction) => void;
    getAll: (req: Request, res: Response, next: NextFunction) => void;
    create: (req: Request, res: Response, next: NextFunction) => void;
    update: (req: Request, res: Response, next: NextFunction) => void;
    delete: (req: Request, res: Response, next: NextFunction) => void;
}