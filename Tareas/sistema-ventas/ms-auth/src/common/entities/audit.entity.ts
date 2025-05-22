import {
  BaseEntity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class AuditEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'creation_user', length: 50, select: true })
  creationUser: string;

  @Column({ name: 'update_user', length: 50, select: false })
  updateUser: string;

  @CreateDateColumn({ name: 'creation_time', select: true })
  creationTime: Date;

  @UpdateDateColumn({ name: 'update_time', select: true })
  updateTime: Date;

  @Column({ nullable: false, default: 0 })
  status: number;
}
