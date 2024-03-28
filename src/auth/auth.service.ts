import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { LoginUserDto } from '../dto/login-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { LogoutDto } from 'src/dto/logout-user.dto';
import { User } from '../user/user.entity';
import { TokenBlacklistService } from './token-blacklist.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  async login(LoginUserDto: LoginUserDto): Promise<string | null> {
    const { email, password } = LoginUserDto;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return null;
    }
    const isValidCredentials = await this.userService.verifyUserCredentials(
      email,
      password,
    );
    if (!isValidCredentials) {
      return null;
    }
    return this.jwtService.sign({ email });
  }
  async register(registerDto: CreateUserDto): Promise<User> {
    return this.userService.create(registerDto);
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    const existingUser = await this.userService.findById(id);
    if (!existingUser) {
      return null;
    }
    const updatedUser = await this.userService.update(id, updateUserDto);
    return updatedUser;
  }

  async logout(logoutDto: LogoutDto): Promise<void> {
    const { token } = logoutDto;
    try {
      const decodedToken = this.jwtService.decode(token);
      if (decodedToken) {
        await this.tokenBlacklistService.blacklistToken(
          JSON.stringify(decodedToken),
        );
      } else {
        throw new UnauthorizedException('Invalid token');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  //   async verifyUserCredentials(
  //     email: string,
  //     password: string,
  //   ): Promise<boolean> {
  //     const user = await this.userService.findByEmail(email);
  //     if (!user) {
  //       return false;
  //     }
  //     return await bcrypt.compare(password, user.password);
  //   }
}
