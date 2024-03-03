import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
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
    const { userId, title, isAllDay, startTime, endTime, color, place, description, isRecurring } = createEventDto
    return this.eventModel.create({
      userId,
      title,
      isAllDay,
      startTime,
      endTime,
      color,
      place,
      description,
      isRecurring,
    })
  }

  async updateEvent(eventIdx: number, updateEventDto: UpdateEventDto) {
    const { title, isAllDay, startTime, endTime, color, place, description, isRecurring } = updateEventDto
    const updatedEvent = await this.eventModel.update(
      {
        title,
        isAllDay,
        startTime,
        endTime,
        color,
        place,
        description,
        isRecurring,
      },
      {
        where: {
          eventIdx,
        },
      }
    )
    if (updatedEvent[0]) {
      return { success: true, message: '일정 수정 성공' }
    } else {
      throw new HttpException({ success: false, message: '일정 수정 실패' }, HttpStatus.BAD_REQUEST)
    }
  }
}
