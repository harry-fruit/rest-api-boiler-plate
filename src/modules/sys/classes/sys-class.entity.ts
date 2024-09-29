import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SysTypes } from "../types/sys-type.model";
import { SysCategory } from "../categories/sys-category.model";
import { SysStatus } from "../statuses/sys-status.model";

@Entity('SysClasses')
export class SysClasses {
  @PrimaryGeneratedColumn({ name: 'Id' })
  id!: number;

  @Column({ unique: true, name: 'UniqueCode' })
  uniqueCode!: string;

  @Column({ nullable: true, name: 'Description' })
  description!: string;

  @CreateDateColumn({ type: 'timestamp', name: 'CreatedAt' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'UpdatedAt' })
  updatedAt!: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'DeletedAt', nullable: true })
  deletedAt?: Date;

  @OneToMany(() => SysCategory, (category) => category.sysClass)
  sysCategories!: SysCategory[];

  @OneToMany(() => SysTypes, (sysType) => sysType.sysClass)
  sysTypes!: SysTypes[];

  @OneToMany(() => SysStatus, (sysStatus) => sysStatus.sysClass)
  sysStatuses!: SysStatus[];
}