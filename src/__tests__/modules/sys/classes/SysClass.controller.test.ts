import request from 'supertest';
import { StatusCodes } from 'http-status-codes';
import express, { Express } from 'express';
import { SysClassesService } from '../../../../modules/sys/classes/sys-class.service';
import { SysClassesController } from '../../../../modules/sys/classes/sys-class.controller';

describe('SysClassesController', () => {
    let app: Express;
    let sysClassesService: SysClassesService;
    let sysClassesController: SysClassesController;

    beforeEach(() => {
        sysClassesService = {
            getById: jest.fn(),
            getAll: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as SysClassesService;

        sysClassesController = new SysClassesController(sysClassesService);

        app = express();
        app.use(express.json());

        app.get('/sysclasses/:id', (req, res, next) =>
            sysClassesController.getById(req, res, next)
        );
    });

    describe('getById', () => {
        it('should return 400 if ID is invalid', async () => {
            const response = await request(app).get('/sysclasses/invalidId');

            expect(response.status).toBe(StatusCodes.BAD_REQUEST);
            expect(response.body.errors).toContain('invalid ID');
        });

        it('should return 404 if no class is found', async () => {
            (sysClassesService.getById as jest.Mock).mockResolvedValueOnce({
                result: null,
                error: null,
            });

            const response = await request(app).get('/sysclasses/1');

            expect(response.status).toBe(StatusCodes.NOT_FOUND);
            expect(response.body.errors).toContain('not found');
        });

        it('should return 200 and the result if class is found', async () => {
            const result = { id: 1, name: 'Test Class' };

            (sysClassesService.getById as jest.Mock).mockResolvedValueOnce({
                result,
                error: null,
            });

            const response = await request(app).get('/sysclasses/1');

            expect(response.status).toBe(StatusCodes.OK);
            expect(response.body.data).toEqual(result);
        });

        it('should handle service errors', async () => {
            const error = {
                toHTTPResponse: () => ({
                    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                    errors: ['Internal error'],
                }),
            };

            (sysClassesService.getById as jest.Mock).mockResolvedValueOnce({
                result: null,
                error,
            });

            const response = await request(app).get('/sysclasses/1');

            expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
            expect(response.body.errors).toContain('Internal error');
        });
    });
});
