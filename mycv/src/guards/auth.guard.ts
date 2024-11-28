import { CanActivate, ExecutionContext } from "@nestjs/common";

export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext) { // again, context - smthng like coming http request
        const request = context.switchToHttp().getRequest();

        // if userId is exists, we send true. it give an access to handler or controller
        return request.session.userId;
    }
}