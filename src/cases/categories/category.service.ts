import { Repository } from "typeorm";
import { Category } from "./category.entity";
import { InjectRepository } from "@nestjs/typeorm";

export class CategoryService {
    @InjectRepository(Category)
    constructor(private readonly categoryRepository: Repository<Category>) {
        
    }

    findAll(): Promise<Category[]>{

    }

    findOne(): Promise<Category>{

    }

    create(): Promise<Category> {

    }

    update(): Promise<Category> {

    }

    remove(): Promise<void>{
        
    }

}