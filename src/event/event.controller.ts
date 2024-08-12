import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import {
  ApiTags,
  ApiOperation,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBearerAuth,
  getSchemaPath,
} from '@nestjs/swagger'
import { TransactionInterceptor } from 'src/share/transaction/interceptor'
import { EventService } from 'src/event/event.service'
import { CreateEventDto } from 'src/event/dto/create-event.dto'
import { UpdateEventDto } from 'src/event/dto/update-event.dto'
import { EventResponseDto } from 'src/event/dto/event-response.dto'
import { JwtAuthGuard } from 'src/auth/authentication/jwt-auth.guard'
import { IUserReq } from 'src/user/interface/user-req.interface'
import { TransactionParam } from 'src/share/transaction/param'
import { Transaction } from 'sequelize'

@Controller('event')
@ApiTags('Event API')
@ApiBearerAuth('accessToken')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: '일정 조회', description: '일정 조회 API' })
  @ApiOkResponse({
    type: EventResponseDto,
    description: '일정 조회 성공',
    schema: {
      $ref: getSchemaPath(EventResponseDto),
    },
  })
  async getEventUsingMonth(
    @Req() req: IUserReq,
    @Query('year') year: number,
    @Query('month') month: number
  ): Promise<EventResponseDto[][]> {
    return await this.eventService.getMonthlyEvent(req.user.id, year, month)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post()
  @ApiOperation({ summary: '일정 생성', description: '일정 생성 API' })
  @ApiCreatedResponse({
    type: EventResponseDto,
    description: '일정 생성 성공',
    schema: {
      $ref: getSchemaPath(EventResponseDto),
    },
  })
  @UsePipes(ValidationPipe)
  async createEvent(
    @Body() createEventDto: CreateEventDto,
    @Req() req: IUserReq,
    @TransactionParam() transaction: Transaction
  ): Promise<EventResponseDto> {
    createEventDto.userId = req.user.id
    return await this.eventService.createEvent(createEventDto, transaction)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Put(':eventIdx')
  @ApiOperation({ summary: '일정 수정', description: '일정 수정 API' })
  @ApiOkResponse({ description: '일정 수정 성공' })
  @ApiNotFoundResponse({ description: '존재하지 않는 일정' })
  async updateEvent(
    @Param('eventIdx', ParseIntPipe) idx: number,
    @Body() updateData: UpdateEventDto,
    @TransactionParam() transaction: Transaction
  ): Promise<EventResponseDto> {
    return await this.eventService.updateEvent(idx, updateData, transaction)
  }
}
