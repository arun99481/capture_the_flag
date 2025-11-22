import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    async signup(
        @Body('email') email: string,
        @Body('password') password: string,
        @Body('name') name: string,
    ) {
        return this.authService.signup(email, password, name);
    }

    @Post('login')
    async login(
        @Body('email') email: string,
        @Body('password') password: string,
    ) {
        return this.authService.login(email, password);
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me(@CurrentUser() user: any) {
        return this.authService.validateUser(user.id);
    }
}
