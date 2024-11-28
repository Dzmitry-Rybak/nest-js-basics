import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { UserEntity } from '../user.entity';

// this code below, might to update an additional propertu to an existing interfase
// in my case, we add currentUser type to our request
declare global {
    // 1) Go and find the Express library
    namespace Express {
        // 2) Find the interface called Request
        interface Request {
            // 3) and add in one more property to that interface
            currentUser?: UserEntity;
        }
    }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
    constructor(private userService: UsersService) {}

    // next - reference to the next middleware in the chain
    async use(req: Request, res: Response, next: NextFunction) {
        const { userId } = req.session || {}; // if no session object, create an empty object

        if (userId) {
            const user = await this.userService.findOne(userId);

            req.currentUser = user;
        }

        next(); // next - thats all for this middleware, run whatever orher middleware
    }
}
