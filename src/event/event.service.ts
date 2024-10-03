import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Op, Transaction } from 'sequelize'
import { InjectModel } from '@nestjs/sequelize'
import { Event } from 'models'
import { CreateEventDto } from 'src/event/dto/create-event.dto'
import { UpdateEventDto } from 'src/event/dto/update-event.dto'
import { EventResponseDto } from 'src/event/dto/event-response.dto'
import { EventRecurringService } from './event-recurring/event-recurring.service'
import { EventNotFoundException } from './event.errors'
import {
  startOfWeek,
  endOfWeek,
  differenceInCalendarDays,
  startOfMonth,
  endOfMonth,
  addDays,
  isSameMonth,
  addMilliseconds,
  addWeeks,
  addMonths,
  addYears,
} from 'date-fns'
import { convertToKST } from 'src/common/date-time'

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
    return Math.abs(differenceInCalendarDays(date2, date1))
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

  private calculateBeing(event: EventResponseDto, startOfWeek: Date, endOfWeek: Date): EventResponseDto {
    let tempStartDate = new Date(event.startTime)
    let tempEndDate = new Date(event.endTime)
    // 날짜 차이가 있다면 being 계산
    if (this.compareDate(event.endTime, event.startTime)) {
      // startTime과 startOfWeek 비교해서 start가 더 빠르면 앞에 자름
      if (this.compareDate(event.startTime, startOfWeek) === -1) {
        console.log('start Time이 빨라')
        tempStartDate = startOfWeek
      }
      // endTime과 endOfWeek 비교해서 end가 더 느리면 자름
      if (this.compareDate(event.endTime, endOfWeek) === 1) {
        tempEndDate = endOfWeek
        console.log('endTime이 느려', event.endTime, endOfWeek)
      }
      // 날짜 계산
      event.being = this.getDaysDiff(tempStartDate, tempEndDate) + 1
    } else if (event.isAllDay) {
      event.being = 1
    }
    return event
  }

  // 공통적으로 이벤트가 현재 주 내에 있는지 확인하는 함수
  private isEventInCurrentWeek(eventStart: Date, eventEnd: Date, startOfTheWeek: Date, endOfTheWeek: Date): boolean {
    return (
      (startOfTheWeek <= eventStart && eventStart <= endOfTheWeek) ||
      (startOfTheWeek <= eventEnd && eventEnd <= endOfTheWeek) ||
      (eventStart < startOfTheWeek && endOfTheWeek < eventEnd)
    )
  }

  // 이벤트의 실제 시작 및 종료 시간을 조정하는 함수
  private adjustEventTimeToWeek(
    eventStart: Date,
    eventEnd: Date,
    startOfTheWeek: Date,
    endOfTheWeek: Date
  ): { adjustedStart: Date; adjustedEnd: Date } {
    return {
      adjustedStart: eventStart < startOfTheWeek ? startOfTheWeek : eventStart,
      adjustedEnd: eventEnd > endOfTheWeek ? endOfTheWeek : eventEnd,
    }
  }

  // 기본 이벤트 폼을 생성하는 함수 (반복 여부에 따라 다른 필드 생성)
  private createEventForm(
    event: any,
    eventStart: Date,
    eventEnd: Date,
    isRecurring: boolean,
    recurringEvent: any = null,
    originStartTime: string,
    originEndTime: string
  ): any {
    const baseForm = {
      idx: event.idx,
      title: event.title,
      isAllDay: !!event.isAllDay,
      color: event.color,
      place: event.place,
      description: event.description,
      being: null,
      startTime: convertToKST(eventStart),
      endTime: convertToKST(eventEnd),
      isRecurringData: isRecurring,
      originStartTime,
      originEndTime,
    }

    // 반복 이벤트일 경우에만 추가 필드를 포함
    if (isRecurring && recurringEvent) {
      return {
        ...baseForm,
        recurringType: recurringEvent.recurringType,
        separationCount: recurringEvent.separationCount,
        maxNumOfOccurrances: recurringEvent.maxNumOfOccurrances,
        recurrenceFinalEndTime: recurringEvent.endTime,
        recurringStartTime: convertToKST(new Date(eventStart)),
        recurringEndTime: convertToKST(new Date(eventEnd)),
      }
    }

    // 반복이 아닐 경우 baseForm만 반환
    return baseForm
  }

  // 반복 이벤트 처리의 공통 로직
  private processRecurringEvent(
    event: any,
    recurringEvent: any,
    start: Date,
    end: Date,
    currentStart: Date,
    startOfTheWeek: Date,
    endOfTheWeek: Date,
    result: any[]
  ) {
    currentStart.setHours(start.getHours(), start.getMinutes(), start.getSeconds(), start.getMilliseconds())
    const timeDifference = end.getTime() - start.getTime()
    const currentEnd = addMilliseconds(currentStart, timeDifference)

    if (this.isEventInCurrentWeek(currentStart, currentEnd, startOfTheWeek, endOfTheWeek)) {
      const { adjustedStart, adjustedEnd } = this.adjustEventTimeToWeek(
        currentStart,
        currentEnd,
        startOfTheWeek,
        endOfTheWeek
      )
      result.push(
        this.createEventForm(
          event,
          adjustedStart,
          adjustedEnd,
          true,
          recurringEvent,
          convertToKST(new Date(event.startTime)),
          convertToKST(new Date(event.endTime))
        )
      )
    }
  }

  // 주기별 반복 처리 로직
  private handleRecurringEvent(
    event: any,
    recurringEvent: any,
    startOfTheWeek: Date,
    endOfTheWeek: Date,
    result: any[],
    getNextStartFn: (date: Date, interval: number) => Date,
    dateHandlerFn: (start: Date, recurringEvent: any) => Date[]
  ) {
    const recurringEnd = new Date(recurringEvent.endTime)
    let start = new Date(event.startTime)
    let end = new Date(event.endTime)
    const interval = recurringEvent.separationCount + 1

    while (start <= recurringEnd) {
      const dates = dateHandlerFn(start, recurringEvent)

      for (const currentStart of dates) {
        this.processRecurringEvent(
          event,
          recurringEvent,
          start,
          end,
          currentStart,
          startOfTheWeek,
          endOfTheWeek,
          result
        )
      }

      start = getNextStartFn(start, interval)
      end = getNextStartFn(end, interval)
    }
  }

  // 주간 반복 이벤트 처리 로직
  private handleWeeklyRecurring(
    event: any,
    recurringEvent: any,
    startOfTheWeek: Date,
    endOfTheWeek: Date,
    result: any[]
  ) {
    this.handleRecurringEvent(
      event,
      recurringEvent,
      startOfTheWeek,
      endOfTheWeek,
      result,
      addWeeks,
      (start, recurringEvent) => {
        // 요일 설정한 경우
        const daysOfWeek = JSON.parse(recurringEvent.dayOfWeek || '[]').map((day: string) => parseInt(day))
        return daysOfWeek.map((day: number) => addDays(startOfWeek(start), day))
      }
    )
  }

  // 월간 반복 이벤트 처리 로직
  private handleMonthlyRecurring(
    event: any,
    recurringEvent: any,
    startOfTheWeek: Date,
    endOfTheWeek: Date,
    result: any[]
  ) {
    this.handleRecurringEvent(
      event,
      recurringEvent,
      startOfTheWeek,
      endOfTheWeek,
      result,
      addMonths,
      (start, recurringEvent) => {
        // 월의 특정 일 설정한 경우
        const datesOfMonth = JSON.parse(recurringEvent.dateOfMonth || '[]').map((date: string) => parseInt(date))
        const weekOfMonth = recurringEvent.weekOfMonth
        if (datesOfMonth.length) {
          return datesOfMonth.map((date: number) => new Date(start.getFullYear(), start.getMonth(), date))
        } else if (weekOfMonth) {
          const daysOfWeek = JSON.parse(recurringEvent.dayOfWeek || '[]').map((day: string) => parseInt(day))
          return daysOfWeek.map((day: number) => {
            const firstDateOfMonth = new Date(start.getFullYear(), start.getMonth(), 1)
            const firstDayOfWeek = firstDateOfMonth.getDay()
            const calDay =
              firstDayOfWeek <= 3
                ? day - firstDayOfWeek + (weekOfMonth - 1) * 7
                : day - firstDayOfWeek + weekOfMonth * 7
            return addDays(firstDateOfMonth, calDay)
          })
        }
        return []
      }
    )
  }

  // 연간 반복 이벤트 처리 로직
  private handleYearlyRecurring(
    event: any,
    recurringEvent: any,
    startOfTheWeek: Date,
    endOfTheWeek: Date,
    result: any[]
  ) {
    this.handleRecurringEvent(
      event,
      recurringEvent,
      startOfTheWeek,
      endOfTheWeek,
      result,
      addYears,
      (start, recurringEvent) => {
        // 월의 특정 일 설정한 경우
        const datesOfMonth = JSON.parse(recurringEvent.dateOfMonth || '[]').map((date: string) => parseInt(date))
        // 년의 특정 월 설정한 경우
        const monthsOfYear = JSON.parse(recurringEvent.monthOfYear || '[]').map((month: string) => parseInt(month))
        const weekOfMonth = recurringEvent.weekOfMonth
        if (datesOfMonth.length) {
          return monthsOfYear.flatMap((month: number) =>
            datesOfMonth.map((date: number) => new Date(start.getFullYear(), month - 1, date))
          )
        } else if (weekOfMonth) {
          // 요일 설정한 경우
          const daysOfWeek = JSON.parse(recurringEvent.dayOfWeek || '[]').map((day: string) => parseInt(day))
          return monthsOfYear.flatMap((month: number) => {
            return daysOfWeek.map((day: number) => {
              const firstDateOfMonth = new Date(start.getFullYear(), month - 1, 1)
              const firstDayOfWeek = firstDateOfMonth.getDay()
              const calDay =
                firstDayOfWeek <= 3
                  ? day - firstDayOfWeek + (weekOfMonth - 1) * 7
                  : day - firstDayOfWeek + weekOfMonth * 7
              return addDays(firstDateOfMonth, calDay)
            })
          })
        }
        return []
      }
    )
  }

  // 특정 주에 해당하는 일정인지 확인하여 response 형태로 return
  private checkDateInRange(event: any, recurringEvent: any, startOfTheWeek: Date, endOfTheWeek: Date) {
    const result = []
    const originStartTime = convertToKST(event.startTime)
    const originEndTime = convertToKST(event.endTime)
    let start = new Date(event.startTime) // 이벤트 시작
    let end = new Date(event.endTime) // 이벤트 끝

    if (!recurringEvent) {
      // 현재 주(startOfTheWeek와 endOfTheWeek) 내에 이벤트가 속하는지 확인
      // 이벤트가 현재 주에 속하지 않으면 추가하지 않음
      if (end < startOfTheWeek || start > endOfTheWeek) return

      const { adjustedStart, adjustedEnd } = this.adjustEventTimeToWeek(start, end, startOfTheWeek, endOfTheWeek)
      result.push(this.createEventForm(event, adjustedStart, adjustedEnd, false, null, originStartTime, originEndTime))
      return result
    }

    switch (recurringEvent.recurringType) {
      case 'D':
        // 일 반복 처리 로직
        const interval = recurringEvent.separationCount + 1
        while (start <= new Date(recurringEvent.endTime)) {
          if (this.isEventInCurrentWeek(start, end, startOfTheWeek, endOfTheWeek)) {
            const { adjustedStart, adjustedEnd } = this.adjustEventTimeToWeek(start, end, startOfTheWeek, endOfTheWeek)
            result.push(
              this.createEventForm(
                event,
                adjustedStart,
                adjustedEnd,
                true,
                recurringEvent,
                originStartTime,
                originEndTime
              )
            )
          }
          start = addDays(start, interval)
          end = addDays(end, interval)
        }
        break
      case 'W':
        // 주 반복 처리 로직
        this.handleWeeklyRecurring(event, recurringEvent, startOfTheWeek, endOfTheWeek, result)
        break
      case 'M':
        // 월 반복 처리 로직 (날짜 또는 특정 주차)
        this.handleMonthlyRecurring(event, recurringEvent, startOfTheWeek, endOfTheWeek, result)
        break
      case 'Y':
        // 연간 반복 처리 로직
        this.handleYearlyRecurring(event, recurringEvent, startOfTheWeek, endOfTheWeek, result)
        break
    }

    return result
  }

  private async checkRecurringEvent(userId: string, startOfTheWeek: Date, endOfTheWeek: Date) {
    const result = []
    const userRecurringEvents = await this.eventModel.findAll({
      where: {
        userId,
        isRecurring: true,
      },
    })

    for await (const event of userRecurringEvents) {
      const recurringEvent = await this.eventRecurringService.getEventRecurring(event.idx)
      if (recurringEvent) {
        const rangeResult = this.checkDateInRange(event, recurringEvent, startOfTheWeek, endOfTheWeek)
        result.push(...rangeResult)
      }
    }
    return result
  }

  async getWeeklyEvent(userId: string, year: number, month: number, date: number): Promise<EventResponseDto[]> {
    const result = []
    // 파라미터로 일~토 date 뽑기
    const dateTime = new Date(year, month - 1, date)
    const startOfTheWeek = startOfWeek(dateTime, { weekStartsOn: 0 })
    const endOfTheWeek = endOfWeek(dateTime, { weekStartsOn: 0 })
    // 단일 일정
    const weeklyEvent = await this.eventModel.findAll({
      where: {
        userId: userId,
        isRecurring: false,
        [Op.or]: [
          {
            startTime: {
              [Op.between]: [startOfTheWeek, endOfTheWeek],
            },
          },
          {
            endTime: {
              [Op.between]: [startOfTheWeek, endOfTheWeek],
            },
          },
          {
            [Op.and]: [
              { startTime: { [Op.lt]: startOfTheWeek } }, // startTime < startOfTheWeek
              { endTime: { [Op.gt]: endOfTheWeek } }, // endTime > endOfTheWeek
            ],
          },
        ],
      },
    })
    weeklyEvent.forEach(item => {
      const event = this.checkDateInRange(item, null, startOfTheWeek, endOfTheWeek)
      event.forEach(eventItem => {
        const eventResult = this.calculateBeing(eventItem, startOfTheWeek, endOfTheWeek)
        result.push(eventResult)
      })
    })
    // 반복 일정
    const recurringData = await this.checkRecurringEvent(userId, startOfTheWeek, endOfTheWeek)
    recurringData.forEach(item => {
      const eventResult = this.calculateBeing(item, startOfTheWeek, endOfTheWeek)
      result.push(eventResult)
    })

    return result.sort((a, b) => {
      // isAllDay가 모두 true인 경우 startTime으로 정렬
      if (a.isAllDay && b.isAllDay) {
        return a.startTime - b.startTime
      }
      // isAllDay가 모두 false인 경우
      if (!a.isAllDay && !b.isAllDay) {
        const aBeingNum = typeof a.being === 'number'
        const bBeingNum = typeof b.being === 'number'
        // being이 숫자인 항목 우선
        if (aBeingNum !== bBeingNum) {
          return aBeingNum ? -1 : 1
        }

        // startTime으로 정렬
        return a.startTime - b.startTime
      }
      // isAllDay가 섞여있는 경우, isAllDay true가 우선
      return a.isAllDay ? -1 : 1
    })
  }

  async getMonthlyEvent(userId: string, year: number, month: number): Promise<EventResponseDto[][]> {
    const weeklyEvent = []
    const firstDateOfMonth = startOfMonth(new Date(year, month - 1))
    const lastDateOfMonth = endOfMonth(new Date(year, month - 1))
    const lastWeekNum = this.getWeekly(lastDateOfMonth)
    let currentDate = new Date(firstDateOfMonth)

    while (currentDate <= lastDateOfMonth) {
      if (this.getWeekly(currentDate) < lastWeekNum && isSameMonth(currentDate, firstDateOfMonth)) {
        weeklyEvent.push(currentDate.getDate())
      }
      currentDate = addDays(currentDate, 7)
      // 마지막 주에서 월이 넘어간 경우
      if (!isSameMonth(currentDate, firstDateOfMonth)) {
        weeklyEvent.push(lastDateOfMonth.getDate())
      }
    }

    return await Promise.all(
      weeklyEvent.map(async date => {
        const weeklyEvent = await this.getWeeklyEvent(userId, year, month, date)
        return weeklyEvent.map(item => new EventResponseDto(item))
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
