import { CreateUserDto } from '@core/application/dtos/create-user-dto';
import { randomUUID } from 'crypto';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserInterface } from '../interfaces/user-entity.interface';

@Entity({ name: 'users' })
export class User implements UserInterface {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar', length: 100 })
  public firstName: string;

  @Column({ type: 'varchar', length: 100 })
  public lastName: string;

  @Column({ type: 'varchar', length: 100 })
  public email: string;

  @Column({ type: 'varchar', length: 100 })
  public password: string;

  @Column({ type: 'varchar', nullable: true })
  public photo: string;

  constructor(props: CreateUserDto, id?: string) {
    Object.assign(this, props);
    this.id = id || randomUUID();
  }
}
