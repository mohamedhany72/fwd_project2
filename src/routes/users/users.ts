import express from "express";
import { User, UserModel } from "../../models/user";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const users = express.Router();
const model = new UserModel();

const register = async (
    _req: express.Request,
    res: express.Response
): Promise<void> => {
    const user: User = {
        firstname: _req.body.firstname as string,
        lastname: _req.body.lastname as string,
        password: _req.body.password as string
    };
    try {
        const result = await model.create(user);
        const newUser = {
            id: result.id,
            firstname: result.firstname,
            lastname: result.firstname
        };
        const token = jwt.sign(newUser, process.env.TOKEN_SECRET as string);
        res.status(200);
        res.json(token);
        return;
    } catch (err) {
        res.status(500);
        res.json("error adding the user");
        return;
    }
};

const index = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    let token: string;
    try {
        const authorizationHeader = req.headers.authorization;

        token = (authorizationHeader as string).split(" ")[1];
        jwt.verify(token, process.env.TOKEN_SECRET as string);
    } catch (err) {
        res.status(401);
        res.json("Access denied, invalid token");
        return;
    }

    try {
        const result = await model.index();
        res.status(200);
        res.json({
            success: 1,
            users: result,
            token: token
        });
        return;
    } catch (err) {
        res.status(500);
        res.json({
            success: 0,
            msg: "server side error"
        });
        return;
    }
};

const show = async (
    req: express.Request,
    res: express.Response
): Promise<void> => {
    let token: string;
    try {
        const authorizationHeader = req.headers.authorization;
        token = (authorizationHeader as string).split(" ")[1];
        jwt.verify(token, process.env.TOKEN_SECRET as string);
    } catch (err) {
        // console.log(token);
        res.status(401);
        res.json("Access denied, invalid token");
        return;
    }

    const id = req.params.id;

    try {
        const result = await model.show(id as string);
        if (result.success) {
            res.status(200);
            res.json({
                success: 1,
                user_id: (result.user as User).id,
                first_name: (result.user as User).firstname,
                last_name: (result.user as User).lastname,
                token: token
            });
        } else {
            res.status(404);
            res.json({
                success: 0,
                msg: "user not found"
            });
        }
        return;
    } catch (err) {
        res.status(500);
        res.json({
            success: 0,
            msg: "error getting the user"
        });
        return;
    }
};


users.post("/signup", register);
users.get("/:id", show);
users.get("/", index);
export default users;
