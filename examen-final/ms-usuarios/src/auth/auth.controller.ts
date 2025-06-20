import { 
  Body, 
  Controller, 
  HttpCode, 
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AuthService } from 'src/auth/auth.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { MessageResponse } from 'src/common/message.response';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService
  ) { }

  @ApiOperation({ summary: 'Login in system' })
  @ApiResponse({
    status: 200,
    description: 'Response based on MessageResponse.',
    type: MessageResponse,
  })
  @ApiResponse({ status: 401, description: 'Not authorized!' })
  @HttpCode(200)
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto)
  }
}