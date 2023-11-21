import express, {Express, Request, Response} from 'express';
import 'dotenv/config'

const app:Express = express();

app.get('/', (req: Request, res: Response):void => {
    res.send('Hello, World!');
});

const PORT: string | 3000 = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});