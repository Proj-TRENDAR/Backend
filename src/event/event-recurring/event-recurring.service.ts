import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { RecurringEvent } from 'models'
import { Transaction } from 'sequelize'
import { CreateEventDto } from 'src/event/dto/create-event.dto'
import { UpdateEventDto } from 'src/event/dto/update-event.dto'

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

  async getEventRecurringByEndTime(eventIdx: number) {
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
      dateOfMonth,
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
        dayOfWeek: dayOfWeek ? JSON.stringify(dayOfWeek) : null,
        dateOfMonth: dateOfMonth ? JSON.stringify(dateOfMonth) : null,
        weekOfMonth,
        monthOfYear: monthOfYear ? JSON.stringify(monthOfYear) : null,
      },
      { transaction }
    )
  }

  async updateEventRecurring(eventIdx: number, updateEventDto: UpdateEventDto, transaction: Transaction) {
    const {
      recurringType,
      separationCount,
      maxNumOfOccurrances,
      recurringEndTime,
      dayOfWeek,
      dateOfMonth,
      weekOfMonth,
      monthOfYear,
    } = updateEventDto
    return await this.eventRecurringModel.upsert(
      {
        eventIdx,
        recurringType,
        separationCount,
        maxNumOfOccurrances,
        endTime: recurringEndTime,
        dayOfWeek: dayOfWeek ? JSON.stringify(dayOfWeek) : null,
        dateOfMonth: dateOfMonth ? JSON.stringify(dateOfMonth) : null,
        weekOfMonth,
        monthOfYear: monthOfYear ? JSON.stringify(monthOfYear) : null,
      },
      { transaction }
    )
  }

  async deleteEventRecurring(eventIdx: number, transaction: Transaction) {
    return await this.eventRecurringModel.destroy({
      where: {
        eventIdx,
      },
      transaction,
    })
  }
}
