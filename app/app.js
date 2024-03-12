import express, { json, urlencoded } from 'express';
import { connect } from 'mongoose';
import routes from './routers';

const app = express();

// On set up les middlewares
app.use(json());
app.use(urlencoded({ extended: true }));

// On set up la base de données
connect('mongodb://localhost/myapp', { useNewUrlParser: true });

// On set up le router
app.use('/', routes);

export default app;