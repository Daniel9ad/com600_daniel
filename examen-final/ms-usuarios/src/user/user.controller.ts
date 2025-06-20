import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiTags, 
  ApiBearerAuth 
} from '@nestjs/swagger';

import { MessageResponse } from 'src/common/message.response';
import { UserService } from 'src/user/user.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { AssignRolesToUserDto } from 'src/user/dto/assign-roles-to-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({ summary: 'Create user' })
  @ApiResponse({
    status: 201,
    description: 'Response based on MessageResponse.',
    type: MessageResponse,
  })
  @ApiResponse({ status: 401, description: 'Not authorized!' })
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createUserDto: CreateUserDto
  ): Promise<MessageResponse> {
    return await this.userService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Obtener usuairo por id' })
  @ApiResponse({
    status: 200,
    description: 'Respuesta basada en MessageResponse.',
    type: MessageResponse
  })
  @ApiResponse({ status: 401, description: '¡No autorizado!' })
  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<MessageResponse> {
    return await this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Assign roles to a user' })
  @ApiResponse({
    status: 201,
    description: 'Response based on MessageResponse.',
    type: MessageResponse,
  })
  @ApiResponse({ status: 401, description: 'Not authorized!' })
  @UseGuards(AuthGuard)
  @Post('assign-roles/:id')
  async assign(
    @Param('id') id: string,
    @Body() assignRolesToUserDto: AssignRolesToUserDto
  ): Promise<MessageResponse> {
    return await this.userService.assign(id, assignRolesToUserDto);
  }
}
