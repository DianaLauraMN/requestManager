import * as express from "express";
import { Request, Response, urlencoded, json } from "express";
import { appRouter } from "./routes/appRoutes";

const PORT = 3000;
const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(appRouter);

const startServer = () => {
    try {
        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        })

        // Ruta principal
        app.get('/', (req, res) => {
            res.send('¡Hola soy Servercito Node.js y Express!');
        });
    } catch (error) {
        console.log("Error while starting the server");

    }
}

startServer();