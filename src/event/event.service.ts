import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { CreateEventDto } from 'src/event/dto/create-event.dto'
import { Event } from 'models'
import { Transaction } from 'sequelize'
@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event)
    private eventModel: typeof Event
  ) {}

  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
    const createdEvnet = this.eventModel.create({
      title: createEventDto.title,
      userId: createEventDto.userId,
      isAllDay: createEventDto.isAllDay,
      startTime: createEventDto?.startTime,
      endTime: createEventDto?.endTime,
      color: createEventDto?.color,
      place: createEventDto?.place,
      description: createEventDto?.description,
      isRecurring: createEventDto.isRecurring,
    })
    return createdEvnet
  }
}
