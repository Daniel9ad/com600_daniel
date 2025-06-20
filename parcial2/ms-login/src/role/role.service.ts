import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MessageResponse } from 'src/common/message.response';
import { RoleEntity } from 'src/role/entities/role.entity';
import { CreateRoleDto } from 'src/role/dto/create-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
  ) { }

  async create(createRoleDto: CreateRoleDto): Promise<MessageResponse> {
    const role = this.roleRepository.create(createRoleDto);
    await this.roleRepository.save(role);
    return new MessageResponse({
      status: true,
      statusCode: 201,
      message: 'Role created successfully',
      data: role
    });
  }
}
