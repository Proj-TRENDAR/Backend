import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { RecurringEvent } from 'models'
import { CreateEventDto } from 'src/event/dto/create-event.dto'
import { Transaction } from 'sequelize'

@Injectable()
export class EventRecurringService {
  constructor(
    @InjectModel(RecurringEvent)
    private eventRecurringModel: typeof RecurringEvent
  ) {}

  async getEventRecurring(eventIdx: number) {
    return await this.eventRecurringModel.findOne({
      where: {
        eventIdx,
      },
    })
  }

  async createEventRecurring(eventIdx: number, createEventDto: CreateEventDto, transaction: Transaction) {
    const {
      recurringType,
      separationCount,
      maxNumOfOccurrances,
      recurringEndTime,
      dayOfWeek,
      dayOfMonth,
      weekOfMonth,
      monthOfYear,
    } = createEventDto
    return await this.eventRecurringModel.create(
      {
        eventIdx,
        recurringType,
        separationCount,
        maxNumOfOccurrances,
        endTime: recurringEndTime,
        dayOfWeek: JSON.stringify(dayOfWeek),
        dayOfMonth: JSON.stringify(dayOfMonth),
        weekOfMonth,
        monthOfYear: JSON.stringify(monthOfYear),
      },
      { transaction }
    )
  }
}
