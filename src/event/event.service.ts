import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import sequelize, { Transaction } from 'sequelize'
import { InjectModel } from '@nestjs/sequelize'
import { Event } from 'models'
import { CreateEventDto } from 'src/event/dto/create-event.dto'
import { UpdateEventDto } from 'src/event/dto/update-event.dto'
import { EventResponseDto } from 'src/event/dto/event-response.dto'
import { EventRecurringService } from './event-recurring/event-recurring.service'
import { EventNotFoundException } from './event.errors'

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event)
    private eventModel: typeof Event,

    private eventRecurringService: EventRecurringService
  ) {}

  /**
   * Compare two dates.
   *
   * @param {Date} date1 First date
   * @param {Date} date2 Second date
   * @returns {number}
   * - 1: The first date is later.
   * - 0: The dates are equal.
   * - -1: The first argument is earlier.
   */
  private compareDate(date1: Date, date2: Date): number {
    const convertDate1 = new Date(date1).setHours(0, 0, 0, 0)
    const convertDate2 = new Date(date2).setHours(0, 0, 0, 0)
    if (convertDate1 > convertDate2) return 1
    if (convertDate1 < convertDate2) return -1
    return 0
  }

  /**
   * Calculates the difference in days between two dates.
   *
   * @param {Date} date1 The first date
   * @param {Date} date2 The second date
   * @returns {number} The difference in days between the two dates
   */
  private getDaysDiff(date1: Date, date2: Date): number {
    const time1 = date1.getTime()
    const time2 = date2.getTime()
    const timeDiff = Math.abs(time2 - time1)
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  }

  /**
   * Calculates the week number of the month for the given date.
   *
   * @param {Date} date The date
   * @returns {number} The week number of the month
   */
  private getWeekly(date: Date): number {
    const currentDate = date.getDate()
    const firstDay = new Date(new Date(date).setDate(1)).getDay() // 1 -> 0로 교체 시 월요일 시작
    return Math.ceil((currentDate + firstDay) / 7)
  }

  private calculateBeing(event: EventResponseDto, startOfWeek: Date, endOfWeek: Date) {
    let tempStartDate = new Date(event.startTime)
    let tempEndDate = new Date(event.endTime)
    // 날짜 차이가 있다면 being 계산
    if (this.compareDate(event.endTime, event.startTime)) {
      // startTime과 weeklyDate[0] 비교해서 start가 더 빠르면 앞에 자름
      if (this.compareDate(event.startTime, startOfWeek) === -1) {
        console.log('start Time이 빨라')
        tempStartDate = startOfWeek
      }
      // endTime과 weeklyDate[6] 비교해서 end가 더 느리면 자름
      if (this.compareDate(event.endTime, endOfWeek) === 1) {
        tempEndDate = endOfWeek
        console.log('endTime이 느려', event.endTime, endOfWeek)
      }
      // 날짜 계산
      event.being = this.getDaysDiff(tempStartDate, tempEndDate) + 1
    }
    return { eventResult: event, tempStartDate }
  }

  private checkDateInRange(event, recurringEvent, startOfWeek: Date, endOfWeek: Date) {
    const start = new Date(event.startTime)
    const end = new Date(event.endTime)
    const recurringEnd = new Date(recurringEvent.endTime)
    const result = []

    const daysOfWeek = recurringEvent.dayOfWeek?.length
      ? JSON.parse(recurringEvent.dayOfWeek).map(day => parseInt(day))
      : null
    // throw new Error(`Invalid recurring`)
    const daysOfMonth = recurringEvent.dayOfMonth
      ? JSON.parse(recurringEvent.dayOfMonth).map(day => parseInt(day))
      : null
    const monthsOfYear = recurringEvent.monthOfYear
      ? JSON.parse(recurringEvent.monthOfYear).map(month => parseInt(month))
      : null
    while (start <= recurringEnd) {
      const interval = recurringEvent.separationCount + 1
      switch (recurringEvent.recurringType) {
        case 'D':
          if (startOfWeek <= start && start <= endOfWeek) {
            const eventForm = {
              idx: event.idx,
              title: event.title,
              isAllDay: !!event.isAllDay,
              color: event.color,
              being: null,
              startTime: new Date(start),
              endTime: new Date(end),
              isRecurringData: true,
            }
            result.push(eventForm)
          }
          start.setDate(start.getDate() + interval)
          end.setDate(end.getDate() + interval)
          break
        case 'W':
          for (const day of daysOfWeek) {
            const currentDay = new Date(start)
            currentDay.setDate(currentDay.getDate() - currentDay.getDay()) // 일요일로 변경
            currentDay.setDate(currentDay.getDate() + ((day - currentDay.getDay() + 7) % 7))
            if (currentDay >= startOfWeek && currentDay <= endOfWeek && currentDay <= recurringEnd) {
              const eventForm = {
                idx: event.idx,
                title: event.title,
                isAllDay: !!event.isAllDay,
                color: event.color,
                being: null,
                startTime: new Date(currentDay),
                endTime: new Date(currentDay.getTime() + (end.getTime() - start.getTime())),
                isRecurringData: true,
              }
              result.push(eventForm)
            }
          }
          // 다음 주로 이동
          start.setDate(start.getDate() + 7 * interval)
          end.setDate(end.getDate() + 7 * interval)
          break
        case 'M':
          if (daysOfMonth) {
            for (const day of daysOfMonth) {
              const currentMonthDay = new Date(start.getFullYear(), start.getMonth(), day)
              if (currentMonthDay >= startOfWeek && currentMonthDay <= endOfWeek && currentMonthDay <= recurringEnd) {
                const eventForm = {
                  idx: event.idx,
                  title: event.title,
                  isAllDay: !!event.isAllDay,
                  color: event.color,
                  being: null,
                  startTime: new Date(currentMonthDay),
                  endTime: new Date(currentMonthDay.getTime() + (end.getTime() - start.getTime())),
                  isRecurringData: true,
                }
                result.push(eventForm)
              }
            }
          } else if (daysOfWeek && recurringEvent.weekOfMonth !== null) {
            const weekOfMonth = recurringEvent.weekOfMonth
            for (const day of daysOfWeek) {
              const firstDayOfMonth = new Date(start.getFullYear(), start.getMonth(), 1)
              const firstDayOfWeek = firstDayOfMonth.getDay()
              const currentMonthWeekDay = new Date(firstDayOfMonth)
              currentMonthWeekDay.setDate(currentMonthWeekDay.getDate() + ((day - firstDayOfWeek + 7) % 7))
              currentMonthWeekDay.setDate(currentMonthWeekDay.getDate() + (weekOfMonth - 1) * 7)
              if (
                currentMonthWeekDay >= startOfWeek &&
                currentMonthWeekDay <= endOfWeek &&
                currentMonthWeekDay <= recurringEnd
              ) {
                const eventForm = {
                  idx: event.idx,
                  title: event.title,
                  isAllDay: !!event.isAllDay,
                  color: event.color,
                  being: null,
                  startTime: new Date(currentMonthWeekDay),
                  endTime: new Date(currentMonthWeekDay.getTime() + (end.getTime() - start.getTime())),
                  isRecurringData: true,
                }
                result.push(eventForm)
              }
            }
          }
          start.setMonth(start.getMonth() + interval)
          end.setMonth(end.getMonth() + interval)
          break
        case 'Y':
          if (monthsOfYear) {
            for (const month of monthsOfYear) {
              if (daysOfMonth) {
                for (const day of daysOfMonth) {
                  const currentYearDay = new Date(start.getFullYear(), month - 1, day)
                  if (currentYearDay >= startOfWeek && currentYearDay <= endOfWeek && currentYearDay <= recurringEnd) {
                    const eventForm = {
                      idx: event.idx,
                      title: event.title,
                      isAllDay: !!event.isAllDay,
                      color: event.color,
                      being: null,
                      startTime: new Date(currentYearDay),
                      endTime: new Date(currentYearDay.getTime() + (end.getTime() - start.getTime())),
                      isRecurringData: true,
                    }
                    result.push(eventForm)
                  }
                }
              }
            }
          }
          start.setFullYear(start.getFullYear() + interval)
          end.setFullYear(end.getFullYear() + interval)
          break
      }
    }
    return result
  }

  private async checkRecurringEvent(userId, weeklyDate: Date[]) {
    const result = []
    const startDate = weeklyDate[0]
    const endDate = new Date(weeklyDate[6].getTime() + 24 * 60 * 60 * 1000)
    const userRecurringEvents = await this.eventModel.findAll({
      where: {
        userId: userId,
        isRecurring: true,
      },
    })

    for await (const event of userRecurringEvents) {
      const recurringEvent = await this.eventRecurringService.getEventRecurring(event.idx)
      // TODO: separationCount가 직관성이 떨어지는 것 같음..
      const rangeResult = this.checkDateInRange(event, recurringEvent, startDate, endDate)
      result.push(...rangeResult)
    }
    return result
  }

  async getWeeklyEvent(userId: string, year: number, month: number, date: number): Promise<EventResponseDto[][]> {
    const result = Array.from(Array(7), () => [])
    // 파라미터로 일~토 date 뽑기
    const dateTime = new Date(year, month - 1, date)
    const dayOfWeek = dateTime.getDay()
    const sunday = new Date(dateTime)
    sunday.setDate(dateTime.getDate() - dayOfWeek)
    const weeklyDate: Date[] = [new Date(sunday)] // FIXME: 나중에 필요없으면 일, 토만 빼기
    for (let i = 1; i < 7; i++) {
      const nextDay = new Date(sunday)
      nextDay.setDate(sunday.getDate() + i)
      weeklyDate.push(nextDay)
    }
    const lastTimeOfWeek = new Date(weeklyDate[6].getTime() + 24 * 60 * 60 * 1000 - 1000)
    const weeklyEvent = await this.eventModel.findAll({
      where: {
        userId: userId,
        isRecurring: false,
        [sequelize.Op.or]: [
          {
            startTime: {
              [sequelize.Op.between]: [weeklyDate[0], lastTimeOfWeek],
            },
          },
          {
            endTime: {
              [sequelize.Op.between]: [weeklyDate[0], lastTimeOfWeek],
            },
          },
          {
            [sequelize.Op.and]: [
              { startTime: { [sequelize.Op.lt]: weeklyDate[0] } }, // startTime < weeklyDate[0]
              { endTime: { [sequelize.Op.gte]: new Date(weeklyDate[6].getTime() + 24 * 60 * 60 * 1000) } }, // endTime >= weeklyDate[6] + 1
            ],
          },
        ],
      },
    })
    const recurringData = await this.checkRecurringEvent(userId, weeklyDate)
    recurringData.map(item => {
      const { eventResult, tempStartDate } = this.calculateBeing(item, weeklyDate[0], weeklyDate[6])
      result[tempStartDate.getDay()].push(eventResult)
    })

    weeklyEvent.map(item => {
      const eventForm = {
        idx: item.idx,
        title: item.title,
        isAllDay: !!item.isAllDay,
        color: item.color,
        being: null,
        startTime: item.startTime,
        endTime: item.endTime,
        isRecurringData: false,
      }
      const { eventResult, tempStartDate } = this.calculateBeing(eventForm, weeklyDate[0], weeklyDate[6])
      // startTime의 요일에 따라서 배열에 넣어주기
      result[tempStartDate.getDay()].push(eventResult)
    })

    result.map(arr => {
      arr.sort((a, b) => {
        // isAllDay가 true인 경우 startTime으로 정렬
        if (a.isAllDay && b.isAllDay) {
          return a.startTime - b.startTime
        }
        // isAllDay가 false인 경우
        if (!a.isAllDay && !b.isAllDay) {
          // being이 숫자인 경우 우선
          const aBeingNum = typeof a.being === 'number'
          const bBeingNum = typeof b.being === 'number'
          if (aBeingNum !== bBeingNum) {
            return aBeingNum ? -1 : 1 // being이 숫자인 항목 우선
          }
          return a.startTime - b.startTime // startTime으로 정렬
        }
        // isAllDay가 섞여있는 경우
        return a.isAllDay ? -1 : 1 // isAllDay true가 우선
      })
    })

    return result
  }
  async getMonthlyEvent(userId: string, year: number, month: number): Promise<EventResponseDto[][]> {
    const weeklyDate = []
    const firstDayOfMonth = new Date(year, month - 1, 1)
    const lastDayOfMonth = new Date(year, month, 0)
    const currentDate = new Date(firstDayOfMonth)
    const lastWeekNum = this.getWeekly(lastDayOfMonth)

    while (currentDate <= lastDayOfMonth) {
      if (this.getWeekly(currentDate) < lastWeekNum && currentDate.getMonth() + 1 === month) {
        weeklyDate.push(currentDate.getDate())
      }
      currentDate.setDate(currentDate.getDate() + 7)
      // 마지막 주에서 월이 넘어간 경우
      if (currentDate.getMonth() !== month - 1) {
        weeklyDate.push(lastDayOfMonth.getDate())
      }
    }

    return await Promise.all(
      weeklyDate.map(async date => {
        const weeklyEvent = await this.getWeeklyEvent(userId, year, month, date)
        return weeklyEvent.flatMap(row => row.map(item => new EventResponseDto(item)))
      })
    )
  }

  private async getEvent(idx: number, transaction: Transaction) {
    const event = await this.eventModel.findOne({
      where: { idx },
      transaction,
    })
    if (!event) throw new EventNotFoundException()

    return new EventResponseDto({
      ...event.get({ plain: true }), // Sequelize 인스턴스를 plain 객체로 변환
      isAllDay: Boolean(event.isAllDay),
      isRecurringData: !!event.isRecurring,
    })
  }

  async createEvent(createEventDto: CreateEventDto, transaction: Transaction): Promise<EventResponseDto> {
    const { userId, title, isAllDay, startTime, endTime, color, place, description, isRecurring } = createEventDto
    const createdEvent = await this.eventModel.create(
      {
        userId,
        title,
        isAllDay,
        startTime,
        endTime,
        color,
        place,
        description,
        isRecurring,
      },
      { transaction }
    )

    if (isRecurring) {
      await this.eventRecurringService.createEventRecurring(createdEvent.idx, createEventDto, transaction)
    }
    return await this.getEvent(createdEvent.idx, transaction)
  }

  async updateEvent(idx: number, updateEventDto: UpdateEventDto, transaction: Transaction) {
    const { title, isAllDay, startTime, endTime, color, place, description, isRecurring } = updateEventDto
    await this.eventModel.update(
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
          idx,
        },
        transaction,
      }
    )

    if (isRecurring) {
      await this.eventRecurringService.updateEventRecurring(idx, updateEventDto, transaction)
    } else {
      await this.eventRecurringService.deleteEventRecurring(idx, transaction)
    }
    return await this.getEvent(idx, transaction)
  }
}
