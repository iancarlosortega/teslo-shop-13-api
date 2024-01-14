import { Address } from 'src/addresses/entities/address.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  code: string;

  @Column('text')
  name: string;

  @OneToMany(() => Address, (address) => address.country, {
    cascade: true,
  })
  addresses?: Address[];
}
