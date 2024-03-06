import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { Event } from './Event'

export interface RecurringEventAttributes {
  idx?: number
  eventIdx: number
  recurringType?: string
  separationCount?: number
  maxNumOfOccurrances?: number
  dayOfWeek?: number
  dayOfMonth?: number
  weekOfMonth?: number
  monthOfYear?: number
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

  @Column({ field: 'day_of_week', allowNull: true, type: DataType.INTEGER })
  dayOfWeek?: number

  @Column({ field: 'day_of_month', allowNull: true, type: DataType.INTEGER })
  dayOfMonth?: number

  @Column({ field: 'week_of_month', allowNull: true, type: DataType.INTEGER })
  weekOfMonth?: number

  @Column({ field: 'month_of_year', allowNull: true, type: DataType.INTEGER })
  monthOfYear?: number

  @BelongsTo(() => Event)
  Event?: Event
}
