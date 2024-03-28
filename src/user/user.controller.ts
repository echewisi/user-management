import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Req,
  Res,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { LogoutDto } from '../dto/logout.dto'; // Import the LogoutDto

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('/signup')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return user; // Assuming the user is returned after creation
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto, @Res() res) {
    const user = await this.userService.login(loginUserDto);
    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ message: 'Invalid credentials' });
    }
    const token = this.jwtService.sign({ email: user.email }); // Generate JWT token
    return res.status(HttpStatus.OK).json({ token }); // Send JWT token to client
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete('/logout') // Change the route to include a leading slash
  async logout(@Body() logoutDto: LogoutDto, @Res() res) {
    // Inject the LogoutDto
    await this.userService.logout(logoutDto); // Call the logout method from the user service
    return res
      .status(HttpStatus.OK)
      .json({ message: 'Logged out successfully' });
  }
}
