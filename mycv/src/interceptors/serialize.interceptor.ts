import {
    UseInterceptors,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { plainToClass } from 'class-transformer';

interface ClassConstructor {
    // any class, but class!
    new (...args: any[]): {};
}

export function Serialize(dto: ClassConstructor) {
    return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
    constructor(private dto: any) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        // context - Run something before a request is handled by the request handler
        //console.log('Before the handler',context);

        return next.handle().pipe(
            map((data: any) => {
                // data - data that we`re going to send back in the outgoing response
                // Run something before the response is sent out with the outgoing data
                //console.log('before respone is send out',data);
                return plainToClass(this.dto, data, {
                    excludeExtraneousValues: true, // disable to share with the other properies. only UserDTO
                });
            }),
        );
    }
}
