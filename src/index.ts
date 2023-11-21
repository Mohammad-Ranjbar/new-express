import express, {Express, Request, Response} from 'express';
import 'dotenv/config'
import mysql, {Pool} from 'mysql2';

const app: Express = express();

app.use(express.json());


const connection: Pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "1111",
    database: "express",
});

app.post("/users", async (req: Request, res: Response) => {
    try {
        const {name, address, country} = req.body;
        const [{insertId}] = await connection.promise().query(
            `INSERT INTO users (name, address, country)
             VALUES (?, ?, ?)`,
            [name, address, country]
        );
        res.status(202).json({
            message: "User Created",
        });
    } catch (err) {
        res.status(500).json({
            message: err,
        });
    }
});


const PORT: string | 3000 = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});