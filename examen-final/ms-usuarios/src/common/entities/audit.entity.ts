import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';

export class AuditEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'creation_user', length: 50, select: true, nullable: true })
  creationUser: string;

  @Column({ name: 'update_user', length: 50, select: false, nullable: true })
  updateUser: string;

  @Column({ 
    name: 'creation_time', 
    select: true,
    type: 'datetime',
    nullable: true
  })
  creationTime: Date;

  @Column({ 
    name: 'update_time', 
    select: true,
    type: 'datetime',
    nullable: true
  })
  updateTime: Date;

  @Column({ nullable: false, default: 0 })
  status: number;

  @BeforeInsert()
  setCreationTime() {
    this.creationTime = new Date();
    this.updateTime = new Date();
    this.status = 0;
  }

  @BeforeUpdate()
  setUpdateTime() {
    this.updateTime = new Date();
  }
}