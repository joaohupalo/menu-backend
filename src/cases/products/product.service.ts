import { Repository } from "typeorm";
import { Product } from "./guest-check.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product";
import { UpdateProductDto } from "./dto/update-product";
import { Category } from "../categories/category.entity";

@Injectable()
export class ProductService {
    
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,

        @InjectRepository(Product)
        private readonly productRepository: Repository<Product>) {
        
    }

    findAll(): Promise<Product[]>{
        return this.productRepository.find({
            order: {name: 'ASC'},
            relations: {category: true}
        });
    }

    async findOne(id: string): Promise<Product>{
        const product = await this.productRepository.findOne({ 
            where: {id},
            relations: {category: true}
         })    

        if(!product) {
            throw new NotFoundException('Produto não encontrada!');
        }

        return product;
    }

    async create(dto: CreateProductDto): Promise<Product> {

        const category = dto.categoryID ? await this.getActiveCategory(dto.categoryID): null;

        const product = this.productRepository.create({
            name: dto.name.trim(),
            description: dto.description,
            price: dto.price, 
            picture: dto.picture,
            active: true,
            category: category
        });

        return this.productRepository.save(product);

    }

    async update(id: string, dto: UpdateProductDto): Promise<Product> {

        const product = await this.findOne(id);

        if (dto.name !== undefined) {
            product.name = dto.name;
        }

        if (dto.active !== undefined) {
            product.active = dto.active;
        }

        if (dto.description !== undefined) {
            product.description = dto.description;
        }

        if (dto.price !== undefined) {
            product.price = dto.price;
        }

        if (dto.picture !== undefined) {
            product.picture = dto.picture;
        }

        if (dto.categoryID !== undefined) {
        product.category = dto.categoryID ? await this.getActiveCategory(dto.categoryID): null;
        }

        return this.productRepository.save(product);
    }

    async remove(id: string): Promise<void>{
        const product = await this.findOne(id);
        await this.productRepository.remove(product)
    }

    private async getActiveCategory(id: string): Promise<Category> {
        const category = await this.categoryRepository.findOneBy({
            id,
            active: true
        })

        if (!category) {
            throw new NotFoundException('Nenhuma categoria ativa foi encontrada!')
        }

        return category;
    }

}