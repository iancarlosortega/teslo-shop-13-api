import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Country } from 'src/countries/entities/country.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Address {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  firstName: string;

  @Column('text')
  lastName: string;

  @Column('text')
  address: string;

  @Column('text', {
    nullable: true,
  })
  address2: string;

  @Column('text')
  postalCode: string;

  @Column('text')
  city: string;

  @Column('text')
  phone: string;

  // Relations
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @ManyToOne(() => Country, (Country) => Country.addresses, {
    onDelete: 'CASCADE',
    eager: true,
  })
  country: Country;
}
