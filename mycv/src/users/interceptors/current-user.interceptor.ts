import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { UsersService } from '../users.service';

// We don't use this interceptor anymore, because we need to apply to request.currentUser before Guard.
// So we rewtire it in middleware (see middleware folder)

@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
    constructor(private usersService: UsersService) {}

    async intercept(context: ExecutionContext, handler: CallHandler) {
        const request = context.switchToHttp().getRequest();
        const { userId } = request.session || {};
        if (userId) {
            const user = await this.usersService.findOne(userId); // we create a new intercepor, cause we cant call UserService from out custom decorator
            request.currentUser = user;
        }

        return handler.handle(); // just to run the actual route handler
    }
}
