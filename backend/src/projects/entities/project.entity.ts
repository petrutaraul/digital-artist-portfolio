import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  imageUrl: string;

  @Column({ nullable: true })
  clientUrl: string;

  @Column({ default: true })
  isVisible: boolean;

  @Column('simple-array')
  tags: string[];

  @CreateDateColumn()
  createdAt: Date;
}