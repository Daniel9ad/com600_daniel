import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { MessageResponse } from 'src/common/message.response';
import { UserEntity } from 'src/user/entities/user.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Status } from 'src/common/enums/status.enum';
import { AssignRolesToUserDto } from 'src/user/dto/assign-roles-to-user.dto';
import { RoleEntity } from 'src/role/entities/role.entity';
import { UserRoleEntity } from 'src/user/entities/user-role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(UserRoleEntity)
    private readonly userRoleRepository: Repository<UserRoleEntity>,
  ) { }

  async create(createUserDto: CreateUserDto): Promise<MessageResponse> {
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    return new MessageResponse({
      status: true,
      statusCode: 201,
      message: 'User created successfully',
      data: user
    });
  }

  async findOne(id: string): Promise<MessageResponse> {
    const usuario = await this.userRepository.findOne({
      where: { id, status: Status.ACTIVE },
    });
    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return new MessageResponse({
      status: true,
      statusCode: 200,
      message: 'Usuario encontrado con éxito',
      data: usuario,
    });
  }

  async assign(id: string, assignRolesToUserDto: AssignRolesToUserDto): Promise<MessageResponse> {
    // Verify the user exists
    const user = await this.userRepository.findOne({
      where: {
        id: id,
        status: Status.ACTIVE
      }
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    // Verify all roles exist
    const roles = await this.roleRepository.find({
      where: {
        id: In(assignRolesToUserDto.rolesId),
        status: Status.ACTIVE
      }
    });
    if (roles.length !== assignRolesToUserDto.rolesId.length) {
      throw new BadRequestException('Some roles do not exist');
    }

    // Check for already assigned roles
    const existingRelations = await this.userRoleRepository.find({
      where: {
        userId: id,
        status: Status.ACTIVE
      },
    });
    const existingRoleIds = new Set(existingRelations.map(rel => rel.roleId));
    const alreadyAssigned = assignRolesToUserDto.rolesId.filter(roleId =>
      existingRoleIds.has(roleId),
    );
    if (alreadyAssigned.length > 0) {
      throw new BadRequestException('Some role is already assigned');
    }

    // Create all relations
    let createdRelations;
    await Promise.all([
      await this.userRoleRepository.manager.transaction(async transaction => {
        const userRoles = assignRolesToUserDto.rolesId.map(roleId => ({
          userId: id,
          roleId: roleId
        }));
        createdRelations = await transaction.save(
          this.userRoleRepository.create(userRoles)
        );
      })
    ]);

    return new MessageResponse({
      status: true,
      statusCode: 201,
      message: 'Roles assigned successfully',
      data: {
        userId: id,
        assignedRoles: createdRelations.map(rel => rel.roleId),
      },
    });
  }
}
