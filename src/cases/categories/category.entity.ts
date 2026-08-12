import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('categoria')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({length: 60, nullable: false})
    name: string;

    @Column({ type: 'boolean', default: true})
    active: boolean;

}