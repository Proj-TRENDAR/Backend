import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { Event } from './Event'

export interface RecurringEventAttributes {
  recurringIdx?: number
  eventIdx: number
  separationCount?: number
  repeatCycle?: number
  maxNumOfOccurrances?: number
  recurringCondition?: string
  weeklyCondition?: number
  endTime?: Date
}

@Table({ tableName: 'recurring_event', timestamps: false })
export class RecurringEvent
  extends Model<RecurringEventAttributes, RecurringEventAttributes>
  implements RecurringEventAttributes
{
  @Column({ field: 'recurring_idx', primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  recurringIdx?: number

  @ForeignKey(() => Event)
  @Column({ field: 'event_idx', type: DataType.INTEGER })
  @Index({ name: 'FK_EVENT_USER_ID_idx', using: 'BTREE', order: 'ASC', unique: false })
  eventIdx!: number

  @Column({ field: 'separation_count', allowNull: true, type: DataType.INTEGER })
  separationCount?: number

  @Column({ field: 'repeat_cycle', allowNull: true, type: DataType.INTEGER })
  repeatCycle?: number

  @Column({ field: 'max_num_of_occurrances', allowNull: true, type: DataType.INTEGER })
  maxNumOfOccurrances?: number

  @Column({ field: 'recurring_condition', type: DataType.STRING(1), defaultValue: 'D' })
  recurringCondition?: string

  @Column({ field: 'weekly_condition', allowNull: true, type: DataType.INTEGER })
  weeklyCondition?: number

  @Column({ field: 'end_time', allowNull: true, type: DataType.DATE })
  endTime?: Date

  @BelongsTo(() => Event)
  Event?: Event
}
