import {
  Controller,
  Post,
  Body,
  HttpStatus,
  Res,
  Delete,
  Req,
  Patch,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from '../dto/login-user.dto';
import { LogoutDto } from '../dto/logout-user.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() loginDto: LoginUserDto, @Res() res) {
    const token = await this.authService.login(loginDto);
    if (!token) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid credentials' });
    }
    return res.status(HttpStatus.OK).json({ token });
  }

  @Post('/register')
  async register(@Body() registerDto: CreateUserDto, @Res() res) {
    const user = await this.authService.register(registerDto);
    return res.status(HttpStatus.CREATED).json(user);
  }

  @Delete('/logout')
  async logout(@Req() req, @Res() res) {
    const logoutDto: LogoutDto = req.body;
    await this.authService.logout(logoutDto);
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Logged out successfully' });
  }

  @Patch('/update/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Res() res,
  ) {
    const updatedUser = await this.authService.updateUser(id, updateUserDto);
    if (!updatedUser) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'User not found' });
    }
    return res.status(HttpStatus.OK).json(updatedUser);
  }
}
