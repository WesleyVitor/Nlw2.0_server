import express from 'express';
import routes from './routes';
import cors from 'cors';
const app = express();

/*O Express não reconhece json então é necessário para reconhecer o req.body importar essa função */
app.use(express.json());
app.use(cors());

app.use(routes)



//Padrão porta 80
app.listen(3333);