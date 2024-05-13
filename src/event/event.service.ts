import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { CreateEventDto } from 'src/event/dto/create-event.dto'
import { UpdateEventDto } from 'src/event/dto/update-event.dto'
import { EventResponseDto } from './dto/event-response.dto'
import { Event, RecurringEvent } from 'models'
import sequelize from 'sequelize'

@Injectable()
export class EventService {
  constructor(
    @InjectModel(Event)
    private eventModel: typeof Event,
    @InjectModel(RecurringEvent)
    private recurringEventModel: typeof RecurringEvent
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

  async getWeeklyEvent(userId: string, year: number, month: number, date: number): Promise<EventResponseDto[][]> {
    // TODO: recurring은 나중에 해주자
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
              { startTime: { [sequelize.Op.lt]: weeklyDate[0] } },
              { endTime: { [sequelize.Op.gte]: new Date(weeklyDate[6].getTime() + 24 * 60 * 60 * 1000) } },
            ],
          },
        ],
      },
      include: [
        {
          model: RecurringEvent,
        },
      ],
    })

    weeklyEvent.map(item => {
      const event = {
        idx: item.idx,
        title: item.title,
        isAllDay: !!item.isAllDay,
        color: item.color,
        being: null,
        startTime: item.startTime,
        endTime: item.endTime,
      }
      let tempStartDate = item.startTime
      let tempEndDate = item.endTime
      // 날짜 차이가 있다면 being 계산
      if (this.compareDate(item.endTime, item.startTime)) {
        // startTime과 weeklyDate[0] 비교해서 start가 더 빠르면 앞에 자름
        if (this.compareDate(item.startTime, weeklyDate[0]) === -1) {
          tempStartDate = weeklyDate[0]
        }
        // endTime과 weeklyDate[6] 비교해서 end가 더 느리면 자름
        if (this.compareDate(item.endTime, weeklyDate[6]) === 1) {
          tempEndDate = weeklyDate[6]
        }
        // 날짜 계산
        event.being = this.getDaysDiff(tempStartDate, tempEndDate) + 1
      }
      // startTime의 요일에 따라서 배열에 넣어주기
      result[tempStartDate.getDay()].push(event)
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
  async createEvent(createEventDto: CreateEventDto): Promise<Event> {
  async createEvent(createEventDto: CreateEventDto): Promise<EventResponseDto> {
    const { userId, title, isAllDay, startTime, endTime, color, place, description, isRecurring } = createEventDto
    const createdEvent = await this.eventModel.create({
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

    if (isRecurring) {
      await this.createRecurringEvent(createdEvent.idx, createEventDto)
    }
    return new EventResponseDto(createdEvent)
  }

  // TODO: recurring event 추가해야 함 + update dto 수정
  async updateEvent(idx: number, updateEventDto: UpdateEventDto) {
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
          idx,
        },
      }
    )
    if (updatedEvent[0]) {
      return { success: true, message: '일정 수정 성공' }
    } else {
      throw new HttpException({ success: false, message: '일정 수정 실패' }, HttpStatus.BAD_REQUEST)
    }
  }

  async createRecurringEvent(eventIdx: number, createEventDto: CreateEventDto): Promise<RecurringEvent> {
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
    return await this.recurringEventModel.create({
      eventIdx,
      recurringType,
      separationCount,
      maxNumOfOccurrances,
      endTime: recurringEndTime,
      dayOfWeek: JSON.stringify(dayOfWeek),
      dayOfMonth: JSON.stringify(dayOfMonth),
      weekOfMonth,
      monthOfYear: JSON.stringify(monthOfYear),
    })
  }
}
