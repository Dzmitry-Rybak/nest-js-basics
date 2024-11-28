import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUserDecorator = createParamDecorator((data: never, context: ExecutionContext) => { // data - first argument incoming in out custom decorator ; context - wrapper around the incoming request
    const request = context.switchToHttp().getRequest() // it`s give us the underlying request that is coming into app
    return request.currentUser;
    }
)