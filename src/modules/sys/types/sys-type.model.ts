import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SysCategory } from "../categories/sys-category.model";
import { SysClasses } from "../classes/sys-class.entity";

@Entity('SysClassTypes')
export class SysTypes {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, name: 'UniqueCode' })
  uniqueCode!: string;

  @Column()
  description!: string;

  @ManyToOne(() => SysClasses, (sysClass) => sysClass.sysTypes)
  @JoinColumn({ name: 'IdSysClass' })
  sysClass!: SysClasses;

  @ManyToOne(() => SysCategory, (sysCategory) => sysCategory.sysTypes)
  @JoinColumn({ name: 'IdSysCategory' })
  sysCategory!: SysCategory;
}