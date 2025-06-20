import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiTags, 
  ApiBearerAuth 
} from '@nestjs/swagger';

import { MessageResponse } from 'src/common/message.response';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { CreateRoleDto } from 'src/role/dto/create-role.dto';
import { RoleService } from 'src/role/role.service';

@ApiBearerAuth()
@ApiTags('Roles')
@Controller('roles')
export class RoleController {
  constructor(private readonly rolesService: RoleService) { }

  @ApiOperation({ summary: 'Create role' })
  @ApiResponse({
    status: 201,
    description: 'Response based on MessageResponse.',
    type: MessageResponse,
  })
  @ApiResponse({ status: 401, description: 'Not authorized!' })
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @Body() createRoleDto: CreateRoleDto
  ): Promise<MessageResponse> {
    return await this.rolesService.create(createRoleDto);
  }
}
