import {
    Body,
    Controller,
    Delete,
    Get,
    Patch,
    Post,
    Param,
    Query,
    NotFoundException,
    Session,
    UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dto/user.dto';
import { CurrentUserDecorator } from './decorators/current-user.decorator';
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { UserEntity } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto) // to no uninclude smth, for example: password
// @UseInterceptors(CurrentUserInterceptor) if few interceptor
export class UsersController {
    constructor(
        private userService: UsersService,
        private authService: AuthService,
    ) {}

    // EXAMPLE OF HOW COOKIES SESSIAN WORK
    // @Get('/colors/:color')
    // setColor(@Param('color') color: string, @Session() session: any) {
    //     add a new property in session object:
    //     session.color = color;
    // }

    // @Get('/colors')
    // getColor(@Session() session: any) {
    //     geting an session property from cookies session object:
    //     return session.color;
    // }

    // @Get('whoami')
    // whoAmI(@Session() session: any) {
    //     return this.userService.findOne(session.userId);
    // }

    //  @UseGuards(AuthGuard) - you can only access if you`r loged in. If not, client will get 403 error
    @Get('/whoami')
    @UseGuards(AuthGuard)
    whoAmI(@CurrentUserDecorator() user: UserEntity) {
        // user - what CurrentUserDecorator is return
        return user;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        // Why can without async/await
        const user = await this.authService.signup(body.email, body.password);
        session.userId = user.id;
        return user;
    }

    @Post('/signin')
    async signin(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signin(body.email, body.password);
        session.userId = user.id;
        console.log(session);
        return user;
    }

    @Post('/signout')
    async signout(@Session() session: any) {
        session.userId = null;
    }

    //@UseInterceptors(new SerializeInterceptor(UserDto)) // to no include smth, for example: password
    @Get('/:id')
    async findUser(@Param('id') id: string) {
        console.log('handler is running');
        const user = await this.userService.findOne(parseFloat(id));
        if (!user) {
            throw new NotFoundException('user not found');
        }
        return user;
    }

    @Get()
    findAllUsers(@Query('email') email: string) {
        return this.userService.find(email);
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        console.log(body);
        return this.userService.update(parseInt(id), body);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.userService.remove(parseInt(id));
    }
}
