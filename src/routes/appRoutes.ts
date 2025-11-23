import { Router } from "express";
import RequestController from "../controller/RequestController";
import { validateAddRequestEntityPipe } from "../schemas/CreateRequestValidationSchema";
import { validateUpdateRequestEntityPipe } from "../schemas/UpdateRequestValidationSchema";
import { validadteUpdateStatusRequestEntityPipe } from "../schemas/UpdateStatusValidationSchema";
import { validateRequestPaginationPipe } from "../schemas/GetAllRequestEntityValidationSchema";
import { validateGetRequestEntityPipe } from "../schemas/GetRequestEntityValidationSchema";
import UserController from "../controller/UserController";
import EventDetailController from "../controller/EventDetailController";

const appRouter = Router();
const requestController = new RequestController();
const userController = new UserController();
const eventDetailController = new EventDetailController();

appRouter.post('/requests', (req, res, next) => validateAddRequestEntityPipe(req, res, next), (req, res) => requestController.addRequest(req, res));
appRouter.get('/requests', (req, res, next) => validateRequestPaginationPipe(req, res, next), (req, res) => requestController.getAllRequests(req, res)); //al ser requestController una clase se debe usar la arrow function
appRouter.get('/requests/:id', (req, res, next) => validateGetRequestEntityPipe(req, res, next), (req, res) => requestController.getRequestById(req, res));
appRouter.put('/requests/:id', (req, res, next) => validateUpdateRequestEntityPipe(req, res, next), (req, res) => requestController.updateRequest(req, res));
appRouter.patch('/requests/:id', (req, res, next) => validadteUpdateStatusRequestEntityPipe(req, res, next), (req, res) => requestController.updateStatus(req, res));

appRouter.get('/users', (req, res) => userController.getAllUsers(req, res));
appRouter.put('/users/:id', (req, res) => userController.updateUser(req, res));
appRouter.patch('/users/:id', (req, res) => userController.establishUserPassword(req, res));

appRouter.get('/profiles', (req, res) => userController.getAllUsersProfiles(req, res));
appRouter.put('/profiles/:id', (req, res) => userController.updateUserProfile(req, res));

appRouter.post('/events/:id', (req, res) => eventDetailController.addEventDetail(req, res));
appRouter.put('/events/:id', (req, res) => eventDetailController.updateEventDetail(req, res));
appRouter.get('/events', (req, res) => eventDetailController.getAllEvents(req, res));

export { appRouter };