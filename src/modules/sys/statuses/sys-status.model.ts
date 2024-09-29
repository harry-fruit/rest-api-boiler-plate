import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { SysClasses } from "../classes/sys-class.entity";

@Entity('SysClassStatus')
export class SysStatus {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, name: 'UniqueCode' })
  uniqueCode!: string;

  @Column({ name: 'Description' })
  description!: string;

  @ManyToOne(() => SysClasses, (sysClass) => sysClass.sysStatuses)
  @JoinColumn({ name: 'IdSysClass' })
  sysClass!: SysClasses;

  // @OneToMany(() => User, (user) => user.sysStatus)
  // users: User[];
}