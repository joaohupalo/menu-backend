import { Body, Controller, Get, Param, ParseEnumPipe, ParseUUIDPipe, Patch, Post, Query } from "@nestjs/common";
import { GuestCheckService, GuestCheckWithTotal } from "./guest-check.service";
import { GuestCheck, GuestCheckStatus } from "./guest-check.entity";
import { CreateGuestCheckDto } from "./dto/create-guest-check";

@Controller('guest-checks')
export class GuestCheckController {

  constructor(private readonly service: GuestCheckService) {}

  // GET /guest-checks?status=OPENED  -> só as comandas abertas
  @Get()
  findAll(
    @Query('status', new ParseEnumPipe(GuestCheckStatus, { optional: true }))
    status?: GuestCheckStatus
  ): Promise<GuestCheckWithTotal[]> {
    return this.service.findAll(status);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe)
    id: string): Promise<GuestCheckWithTotal> {
    return this.service.findDetail(id);
  }

  @Post()
  create(@Body() dto: CreateGuestCheckDto): Promise<GuestCheck> {
    return this.service.create(dto);
  }

  @Patch(':id/close')
  close(
    @Param('id', ParseUUIDPipe)
    id: string): Promise<GuestCheck> {
    return this.service.close(id);
  }


}