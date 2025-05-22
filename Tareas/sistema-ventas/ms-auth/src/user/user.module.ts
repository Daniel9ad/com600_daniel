import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from 'src/user/entities/user.entity';
import { UserController } from 'src/user/user.controller';
import { UserService } from 'src/user/user.service';
import { AuthModule } from 'src/auth/auth.module';
import { RoleEntity } from 'src/role/entities/role.entity';
import { UserRoleEntity } from 'src/user/entities/user-role.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      RoleEntity,
      UserRoleEntity
    ]),
    AuthModule
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }