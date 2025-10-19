import { Router } from "express";
import RequestController from "../controller/RequestController";

const appRouter = Router();
const requestController = new RequestController();

appRouter.post('/requests', (req, res) => requestController.addRequest(req, res));
appRouter.get('/requests', (req, res) => requestController.getAllRequests(req, res)); //al ser requestController una clase se debe usar la arrow function
appRouter.get('/requests/:id', (req, res) => requestController.getRequest(req, res)); 
appRouter.put('/requests/:id', (req, res) => requestController.updateRequest(req, res));
appRouter.patch('/requests/:id', (req, res) => requestController.updateStatus(req, res));

export { appRouter };