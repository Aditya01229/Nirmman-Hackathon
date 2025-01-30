import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from 'src/database/database.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    constructor(private readonly databaseService: DatabaseService,
                private readonly usersService: UsersService,
                private readonly jwtservice:JwtService) {}

                async login(email: string, password: string) {
                    const user = await this.usersService.login(email, password);
            
                    if (!user) {
                        throw new UnauthorizedException('Invalid credentials');
                    }
            
                    const payload = { email: user.email, role: user.role };
                    const accessToken = this.jwtservice.sign(payload);
            
                    return { accessToken, user }; // Return both the token and user info
                }
                
                  // For admin login
                  async adminLogin(email: string, password: string) {
                    const admin = await this.usersService.adminLogin(email, password);
            
                    if (!admin) {
                        throw new UnauthorizedException('Invalid credentials');
                    }
            
                    const payload = { email: admin.email, role: admin.role };
                    const accessToken = this.jwtservice.sign(payload);
            
                    return { accessToken, admin }; // Return both the token and admin info
                }
                
                  // Validate token (if necessary)
                  async validateToken(token: string): Promise<any> {
                    try {
                      return this.jwtservice.verify(token);
                    } catch (error) {
                      throw new UnauthorizedException('Invalid token');
                    }
                  }
                  
                  // You can also create a method for validating user role from the token.
                  async validateUser(payload: any) {
                    const user = await this.databaseService.user.findUnique({
                      where: { email: payload.email },
                    });
                    
                    if (!user) {
                      throw new UnauthorizedException();
                    }
                    
                    return user;
                  }
}
