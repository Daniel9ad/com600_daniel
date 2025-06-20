import { 
  BeforeInsert, 
  Column, 
  Entity, 
  OneToMany, 
} from 'typeorm';
import { hash } from 'bcrypt';

import { AuditEntity } from 'src/common/entities/audit.entity';
import { UserRoleEntity } from 'src/user/entities/user-role.entity';

@Entity('users')
export class UserEntity extends AuditEntity {
  @Column({ nullable: false, length: 70, unique: true })
  email: string;

  @Column({ length: 600, nullable: false, select: false })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, parseInt(process.env.JWT_ROUNDS_SECURITY || "10"));
  }

  @OneToMany(() => UserRoleEntity, (userRoles) => userRoles.user)
  userRoles: UserRoleEntity[];
}
