import { Router } from "express";
import RequestController from "../controller/RequestController";
import { validateAddRequestEntityPipe } from "../schemas/CreateRequestValidationSchema";
import { validateUpdateRequestEntityPipe } from "../schemas/UpdateRequestValidationSchema";
import { validadteUpdateStatusRequestEntityPipe } from "../schemas/UpdateStatusValidationSchema";
import { validateRequestPaginationPipe } from "../schemas/GetAllRequestEntityValidationSchema";
import { validateGetRequestEntityPipe } from "../schemas/GetRequestEntityValidationSchema";

const appRouter = Router();
const requestController = new RequestController();

appRouter.post('/requests', (req, res, next) => validateAddRequestEntityPipe(req, res, next), (req, res) => requestController.addRequest(req, res));
appRouter.get('/requests', (req, res, next) => validateRequestPaginationPipe(req, res, next), (req, res) => requestController.getAllRequests(req, res)); //al ser requestController una clase se debe usar la arrow function
appRouter.get('/requests/:id', (req, res, next) => validateGetRequestEntityPipe(req, res, next), (req, res) => requestController.getRequestById(req, res));
appRouter.put('/requests/:id', (req, res, next) => validateUpdateRequestEntityPipe(req, res, next), (req, res) => requestController.updateRequest(req, res));
appRouter.patch('/requests/:id', (req, res, next) => validadteUpdateStatusRequestEntityPipe(req, res, next), (req, res) => requestController.updateStatus(req, res));

export { appRouter };