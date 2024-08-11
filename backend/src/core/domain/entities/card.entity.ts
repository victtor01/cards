import { Column, PrimaryColumn } from 'typeorm';
import { nanoid } from 'nanoid';
import { CreateCardDto } from '@core/application/dtos/create-card-dto';

export class Card {
  @PrimaryColumn({ type: 'string' })
  id: string;

  @Column({ type: "varchar" })
  title: string;
  
  @Column({ type: 'text', nullable: true })
  content: string;

  constructor({ name }: CreateCardDto, id?: string) {
    this.id = id || nanoid(12);
    Object.assign(this, {
      name,
    });
  }
}
