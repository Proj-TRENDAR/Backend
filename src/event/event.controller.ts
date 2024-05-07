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
import { Event } from 'models'
import { EventService } from 'src/event/event.service'
import { CreateEventDto } from 'src/event/dto/create-event.dto'
import { UpdateEventDto } from 'src/event/dto/update-event.dto'
import { JwtAuthGuard } from 'src/auth/authentication/jwt-auth.guard'
import { IUserReq } from 'src/user/interface/user-req.interface'
import { EventResponseDto } from './dto/event-response.dto'

@Controller('event')
@ApiTags('Event API')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Get()
  @ApiBearerAuth()
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
    const event = await this.eventService.getMonthlyEvent(req.user.id, year, month)
    return event.map(row => row.map(item => new EventResponseDto(item)))
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '일정 생성', description: '일정 생성 API' })
  @ApiCreatedResponse({
    type: EventResponseDto,
    description: '일정 생성 성공',
    schema: {
      $ref: getSchemaPath(EventResponseDto),
    },
  })
  @UsePipes(ValidationPipe)
  async createEvent(@Body() createEventDto: CreateEventDto, @Req() req: IUserReq): Promise<EventResponseDto> {
    createEventDto.userId = req.user.id
    return new EventResponseDto(await this.eventService.createEvent(createEventDto))
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Put(':eventIdx')
  @ApiBearerAuth()
  @ApiOperation({ summary: '일정 수정', description: '일정 수정 API' })
  @ApiOkResponse({ description: '일정 수정 성공' })
  @ApiNotFoundResponse({ description: '일정 수정 실패' })
  updateEvent(@Param('eventIdx', ParseIntPipe) idx: number, @Body() updateData: UpdateEventDto) {
    return this.eventService.updateEvent(idx, updateData)
  }
}
