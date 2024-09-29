import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SysTypes } from "../types/sys-type.model";
import { SysClasses } from "../classes/sys-class.entity";

@Entity('SysClassCategory')
export class SysCategory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, name: 'UniqueCode' })
  uniqueCode!: string;

  @Column({ name: 'Description' })
  description!: string;

  @ManyToOne(() => SysClasses, (sysClass) => sysClass.sysCategories)
  @JoinColumn({ name: 'IdSysClass' })
  sysClass!: SysClasses;

  @OneToMany(() => SysTypes, (sysType) => sysType.sysCategory)
  sysTypes!: SysTypes[];
}