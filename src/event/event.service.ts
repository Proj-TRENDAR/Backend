import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { CreateEventDto } from 'src/event/dto/create-event.dto'
import { UpdateEventDto } from 'src/event/dto/update-event.dto'
import { Event } from 'models'
import sequelize from 'sequelize'

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event)
    private eventModel: typeof Event
  ) {}

  async getEventUsingMonth(userId: string, year: string, month: string): Promise<Event[]> {
    return await this.eventModel.findAll({
      where: {
        userId: userId,
        [sequelize.Op.or]: [
          {
            startTime: {
              [sequelize.Op.and]: [
                sequelize.literal(`YEAR(start_time) = ${year}`),
                sequelize.literal(`MONTH(start_time) = ${month}`),
              ],
            },
          },
          {
            endTime: {
              [sequelize.Op.and]: [
                sequelize.literal(`YEAR(end_time) = ${year}`),
                sequelize.literal(`MONTH(end_time) = ${month}`),
              ],
            },
          },
        ],
      },
    })
  }

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

  async updateEvent(eventIdx: number, updateEventDto: UpdateEventDto) {
    const updatedEvent = await this.eventModel.update(
      {
        title: updateEventDto?.title,
        isAllDay: updateEventDto?.isAllDay,
        startTime: updateEventDto?.startTime,
        endTime: updateEventDto?.endTime,
        color: updateEventDto?.color,
        place: updateEventDto?.place,
        description: updateEventDto?.description,
        isRecurring: updateEventDto?.isRecurring,
      },
      {
        where: {
          eventIdx,
        },
      }
    )
    if (updatedEvent[0]) {
      return { success: true, message: '업데이트 성공' }
    } else {
      return { success: false, message: '업데이트 실패' }
    }
  }
}
