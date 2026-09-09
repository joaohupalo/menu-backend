import { Repository } from "typeorm";
import { GuestCheck, GuestCheckStatus } from "./guest-check.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateGuestCheckDto } from "./dto/create-guest-check";
import { Spot } from "../spots/spot.entity";

@Injectable()
export class GuestCheckService {
    
    constructor(
        @InjectRepository(GuestCheck)
        private readonly GuestCheckRepository: Repository<GuestCheck>,

        @InjectRepository(Spot)
        private readonly spotRepository: Repository <Spot>
    ) 
        {
        
    }

    async create(dto: CreateGuestCheckDto): Promise<GuestCheck> {

        // Regra #1: Não se abre comanda em mesa inexistente 
        const spot = await this.spotRepository.findOneBy({
            id: dto.spotId,
            active: true
        });

        if (!spot) {
            throw new NotFoundException('Não foi encontrada uma mesa ativa com este ID');
        }

        // Regra #2: Não se abre comanda em mesa com comanda aberta.
        const opened = await this.GuestCheckRepository.exists({
            where: { spot : { id: dto.spotId}, status: GuestCheckStatus.OPENED}
        });
        if (opened) {
            throw new ConflictException('A mesa já possui uma comanda em aberto');
        }

        // Se chegou aqui deu certo, vai gravar o registro
        const GuestCheck = this.GuestCheckRepository.create({
            spot,
            status: GuestCheckStatus.OPENED
        })

        return this.GuestCheckRepository.save(GuestCheck)
    }

    async findOne(id: string): Promise<GuestCheck>{
            const GuestCheck = await this.GuestCheckRepository.findOneBy({ id })    
    
            if(!GuestCheck) {
                throw new NotFoundException('Comanda não encontrada!');
            }
    
            return GuestCheck;
        }

    async close(id: string): Promise<GuestCheck> {
        const guestCheck = await this.findOne(id);

        //Regra #1: Só posso fechar uma comanda aberta
        if(guestCheck?.status === GuestCheckStatus.CLOSED) {
            throw new BadRequestException('A comanda já está fechada');
        }

        //Regra #2: Não posso fechar uma comanda com pedidos que já foram entregues
        //TO_DO: IMPLEMENTAR DEPOIS, DÍVIDA TÉCNICA.

        // Se chegou aqui deu certo!
        guestCheck.status = GuestCheckStatus.CLOSED;

        return this.GuestCheckRepository.save(guestCheck);
    }

    

}