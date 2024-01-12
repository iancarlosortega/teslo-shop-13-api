import { Category } from 'src/categories/entities/category.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductImage } from './product-image.entity';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  title: string;

  @Column('text', {
    unique: true,
  })
  slug: string;

  @Column('float', {
    default: 0,
  })
  price: number;

  @Column('text', {
    nullable: true,
  })
  description: string;

  @Column('int', {
    default: 0,
  })
  stock: number;

  @Column('enum', {
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
    array: true,
    default: [],
  })
  sizes: string[];

  @Index()
  @Column('enum', {
    enum: ['men', 'women', 'kid', 'unisex'],
  })
  gender: string;

  @Column('text', {
    array: true,
    default: [],
  })
  tags: string[];

  @ManyToOne(() => Category, (category) => category.products, {
    eager: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column('text', {
    select: false,
  })
  categoryId: string;

  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('text', {
    select: false,
  })
  userId: string;

  @OneToMany(() => ProductImage, (productImage) => productImage.product, {
    cascade: true,
    eager: true,
  })
  images?: ProductImage[];

  // @ManyToOne(() => User, (user) => user.product, {
  //   onDelete: 'CASCADE',
  // })
  // user: User;

  @BeforeInsert()
  @BeforeUpdate()
  checkSlugInsert() {
    if (!this.slug) {
      this.slug = this.title;
    }

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
