import { Body, Controller, Delete, Get, Param, Post, Request, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './user_dto/create-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService,
      private readonly authService: AuthService) {}

        @Post('signup')
        async signup(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
          }

          @Post('login')
          async login(@Body() body: { email: string; password: string}) {
            const { email, password } = body;
            const {accessToken, user} = await this.authService.login(email, password);
        
            if (!user) {
              throw new UnauthorizedException('Invalid credentials'); 
            }
        
            return {accessToken,user}; 
          }
        
          @Post('admin/login')
    async adminLogin(@Body() body: { email: string; password: string }) {
        const { email, password } = body;

        try {
            const { accessToken, admin } = await this.authService.adminLogin(email, password);
            return { accessToken, admin }; // Return token and user info
        } catch (error) {
            throw new UnauthorizedException(error.message);
        }
    }

        @UseGuards(JwtAuthGuard)
  @Get('getallusers')
  async getAllUsers(@Request() req) {
    if (req.user.role !== 'ADMIN') {
      throw new UnauthorizedException('Access restricted to admins');
    }
    return this.usersService.getAllUsers();
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteUser(@Request() req, @Param('id') id: string) {
    if (req.user.role !== 'ADMIN') {
      throw new UnauthorizedException('Access restricted to admins');
    }
    return this.usersService.deleteUser(id);
  }
}
