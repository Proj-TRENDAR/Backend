import { Body, Controller, Post, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger'
import { Transaction } from 'sequelize'
import { TransactionParam } from 'src/share/transaction/param'
import { TransactionInterceptor } from 'src/share/transaction/interceptor'
import { Event } from 'models'
import { EventService } from 'src/event/event.service'
import { CreateEventDto } from 'src/event/dto/create-event.dto'
import { JwtAuthGuard } from 'src/auth/authentication/jwt-auth.guard'

@Controller('event')
@ApiTags('Event API')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post()
  @ApiOperation({ summary: '이벤트 생성', description: '이벤트 생성 API' })
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
}
