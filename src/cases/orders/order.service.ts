import { Injectable } from "@nestjs/common";
import { CreateOrderDto, CreateOrderItemDto } from "./dto/create-order";
import { Order, OrderStatus } from "./entities/order-entity";
import { OrderItem } from "./entities/order-item.entity";
import { GuestCheckService } from "../guest-checks/guest-check.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductService } from "../products/product.service";

@Injectable()
export class OrderService {
    constructor(
    private readonly guestCheckService: GuestCheckService,
    private readonly productService: ProductService,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>
    )
    {
    }

    private async prepareItems (dto: CreateOrderItemDto): Promise<OrderItem> {
        const product = await this.productService.findOne(dto.productId);
        const subtotal = dto.quantity * Number(product.price);
        
        return this.orderItemRepository.create({
            product,
            quantity: dto.quantity,
            subtotal
        })
    }

    //private saveItems(order: Order, items: OrderItem): Promise<void> {}


    async create(dto: CreateOrderDto): Promise<Order> {
        // Regra #1: Verificar se tem comanda aberta para a mesa
        const guestCheck = await this.guestCheckService.findOrCreateOpened(dto.spotId);

        // Monta o totalizador do pedido
        const items: OrderItem[] = [];
        let total = 0;

        for (const itemDto of dto.items) {
            const item = await this.prepareItems(itemDto); //ERRO - prepara pra inserir no banco
            items.push(item);
            total += Number(item.subtotal);
        }

        // Monta o pedido
        const order = this.orderRepository.create({
            guestCheck,
            status: OrderStatus.NEW,
            total
        })

        // Grava o pedido no banco
        return this.orderRepository.save(order);
    }
    //findAll(): Promise<Order[]> {}
    //findOne(): Promise<Order> {}

}