import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { Category } from "../categories/category.entity";
import { Product } from "./product.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Category, Product])],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService]
})
export class ProductModule{}