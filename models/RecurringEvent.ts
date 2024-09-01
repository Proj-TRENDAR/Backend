import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { Event } from './Event'

export interface RecurringEventAttributes {
  idx?: number
  eventIdx: number
  recurringType?: string
  separationCount?: number
  maxNumOfOccurrances?: number
  endTime?: Date
  dayOfWeek?: string
  dateOfMonth?: string
  weekOfMonth?: number
  monthOfYear?: string
}

@Table({ tableName: 'recurring_event', timestamps: false })
export class RecurringEvent
  extends Model<RecurringEventAttributes, RecurringEventAttributes>
  implements RecurringEventAttributes
{
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  idx?: number

  @ForeignKey(() => Event)
  @Column({ field: 'event_idx', type: DataType.BIGINT })
  @Index({ name: 'FK_RECUR_EVENT_EVENT_idx', using: 'BTREE', order: 'ASC', unique: false })
  eventIdx!: number

  @Column({
    field: 'recurring_type',
    type: DataType.STRING(1),
    comment: 'D(일) | W(주) | M(월) | Y(연)',
    defaultValue: 'D',
  })
  recurringType?: string

  @Column({ field: 'separation_count', type: DataType.INTEGER, defaultValue: '0' })
  separationCount?: number

  @Column({ field: 'max_num_of_occurrances', allowNull: true, type: DataType.INTEGER })
  maxNumOfOccurrances?: number

  @Column({ field: 'end_time', allowNull: true, type: DataType.DATE })
  endTime?: Date

  @Column({
    field: 'day_of_week',
    allowNull: true,
    type: DataType.STRING,
    comment: '주마다 반복되는 요일을 array로 가짐\n0: 일요일, 1:월요일, ..., 6: 토요일',
  })
  dayOfWeek?: string

  @Column({
    field: 'date_of_month',
    allowNull: true,
    type: DataType.STRING,
    comment: '월마다 반복되는 날짜를 array로 가짐',
  })
  dateOfMonth?: string

  @Column({
    field: 'week_of_month',
    allowNull: true,
    type: DataType.INTEGER,
    comment: '월간 반복 시 반복되는 주차를 가짐',
  })
  weekOfMonth?: number

  @Column({
    field: 'month_of_year',
    allowNull: true,
    type: DataType.STRING,
    comment: '년마다 반복되는 월을 array로 가짐',
  })
  monthOfYear?: string

  @BelongsTo(() => Event)
  Event?: Event
}
