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
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger'
import { TransactionInterceptor } from 'src/share/transaction/interceptor'
import { Event } from 'models'
import { EventService } from 'src/event/event.service'
import { CreateEventDto } from 'src/event/dto/create-event.dto'
import { UpdateEventDto } from 'src/event/dto/update-event.dto'
import { JwtAuthGuard } from 'src/auth/authentication/jwt-auth.guard'
import { Request } from 'express'

interface RequestWithUser extends Request {
  user: object // FIXME: 추후 validate해서 넘기는 사용자 정보 제한
}

@Controller('event')
@ApiTags('Event API')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getEventUsingMonth(
    @Req() req: RequestWithUser,
    @Query('year') year: string,
    @Query('month') month: string
  ): Promise<Event> {
    return this.eventService.getEventUsingMonth(req.user, year, month)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post()
  @ApiOperation({ summary: '일정 생성', description: '일정 생성 API' })
  @ApiCreatedResponse({
    description: '성공 시(example)',
    schema: {
      example: {
        createdAt: '2024-01-22T11:45:55.564Z',
        updatedAt: '2024-01-22T11:45:55.564Z',
        eventIdx: 1,
        title: 'test',
        userId: '123',
        isAllDay: 0,
        startTime: '2024-01-11T02:20:00.000Z',
        endTime: '2024-01-11T02:25:00.000Z',
        color: 1,
        description: '테스트 중!',
        isRecurring: 0,
      },
    },
  })
  @UsePipes(ValidationPipe)
  createEvent(@Body() createEventDto: CreateEventDto): Promise<Event> {
    return this.eventService.createEvent(createEventDto)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Put(':eventIdx')
  @ApiOperation({ summary: '일정 수정', description: '일정 수정 API' })
  @ApiOkResponse({ description: '일정 수정' })
  updateEvent(@Param('eventIdx', ParseIntPipe) eventIdx: number, @Body() updateData: UpdateEventDto) {
    return this.eventService.updateEvent(eventIdx, updateData)
  }
}
