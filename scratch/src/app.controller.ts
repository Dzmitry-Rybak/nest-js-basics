import { Controller, Get } from '@nestjs/common';

@Controller('/app')
export class AppController {
    @Get('/asdf')
    getRootRoute() {
        return 'he there!';
    }

    @Get('/bye')
    getByeThere() {
        return 'bye there!'
    }
}