import { Column, Entity, OneToMany } from 'typeorm';

import { UserRoleEntity } from 'src/user/entities/user-role.entity';
import { AuditEntity } from 'src/common/entities/audit.entity';

@Entity('roles')
export class RoleEntity extends AuditEntity {
  @Column({ length: 100, nullable: false, unique: true })
  name: string;

  @Column({ length: 250, nullable: false })
  description: string;

  @OneToMany(() => UserRoleEntity, userRoles => userRoles.role)
  userRoles: UserRoleEntity[];
}