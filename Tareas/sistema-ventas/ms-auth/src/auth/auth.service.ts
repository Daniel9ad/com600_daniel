import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { isEqual } from 'lodash';

import { LoginDto } from 'src/auth/dto/login.dto';
import { MessageResponse } from 'src/common/message.response';
import { UserEntity } from 'src/user/entities/user.entity';
import { Status } from 'src/common/enums/status.enum';
import { TokenPayload } from 'src/auth/interfaces/token-payload';
import { TransformedUserData } from 'src/auth/interfaces/transformed-user-data';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService
  ) { }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto);

    const payload: TokenPayload = {
      sub: user.userId,
      email: user.email,
      roles: user.roles,
    };
    
    const responseData: any = {
      user: {
        userId: user.userId,
        email: user.email,
      },
      roles: user.roles,
    };

    responseData.accessToken = await this.jwtService.signAsync(payload);

    return new MessageResponse({
      status: true,
      statusCode: 200,
      message: 'Login successful',
      data: responseData
    });
  }

  async validateUser(loginDto: LoginDto) {
    const user = await this.find(loginDto.email);
    const passwordMatches = await compare(loginDto.password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Incorrect password');
    }
    
    return user;
  }

  async verify(payload: TokenPayload){
    const user = await this.find(payload.email, payload.sub);

    const rolesMatch = isEqual(user.roles, payload.roles);

    if (!rolesMatch){
      throw new UnauthorizedException("Error, roles or permisson do not match");
    }
  }

  async find(email: string, id?: string) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
        email: email,
        status: Status.ACTIVE
      },
      relations: {
        userRoles: {
          role: true
        }
      },
      select: {
        id: true,
        email: true,
        password: true,
        userRoles: {
          id: true,
          role: true
        }
      }
    });
    if (!user) {
      throw new UnauthorizedException(`User not found`);
    }
    const transformed = this.transformUserData(user);
    return transformed;
  }

  transformUserData(userData: UserEntity): TransformedUserData {
    const transformedData: TransformedUserData = {
      userId: userData.id,
      email: userData.email,
      password: userData.password,
      roles: [],
    };
    
    userData.userRoles.forEach(userRole => {
      // Añadir rol
      transformedData.roles.push({
        id: userRole.role.id,
        name: userRole.role.name
      });
    });
    
    return transformedData;
  }
}
