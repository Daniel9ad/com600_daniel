import { 
  Column, 
  Entity, 
  JoinColumn, 
  ManyToOne 
} from 'typeorm';

import { AuditEntity } from 'src/common/entities/audit.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { RoleEntity } from 'src/role/entities/role.entity';

@Entity('user_roles')
export class UserRoleEntity extends AuditEntity {
  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId: string;

  @ManyToOne(() => UserEntity, user => user.id, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @Column({ name: 'role_id', type: 'uuid', nullable: false })
  roleId: string;

  @ManyToOne(() => RoleEntity, role => role.id, { nullable: false })
  @JoinColumn({ name: 'role_id', referencedColumnName: 'id' })
  role: RoleEntity;
}
