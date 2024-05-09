import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript'
import { User } from './User'
import { RecurringEvent } from './RecurringEvent'

export interface EventAttributes {
  idx?: number
  userId: string
  title: string
  isAllDay?: number
  startTime: Date
  endTime?: Date
  color?: number
  place?: string
  description?: string
  createdAt?: Date
  updatedAt?: Date
  isRecurring?: number
}

@Table({ tableName: 'event', timestamps: false })
export class Event extends Model<EventAttributes, EventAttributes> implements EventAttributes {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  idx?: number

  @ForeignKey(() => User)
  @Column({ field: 'user_id', type: DataType.STRING(45) })
  @Index({ name: 'FK_EVENT_USER_ID_idx', using: 'BTREE', order: 'ASC', unique: false })
  userId!: string

  @Column({ type: DataType.STRING(80) })
  title!: string

  @Column({ field: 'is_all_day', type: DataType.TINYINT, defaultValue: '0' })
  isAllDay?: number

  @Column({ field: 'start_time', type: DataType.DATE })
  startTime!: Date

  @Column({ field: 'end_time', allowNull: true, type: DataType.DATE })
  endTime?: Date

  @Column({ type: DataType.INTEGER, defaultValue: '1' })
  color?: number

  @Column({ allowNull: true, type: DataType.STRING(200) })
  place?: string

  @Column({ allowNull: true, type: DataType.STRING })
  description?: string

  @Column({ field: 'created_at', type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt?: Date

  @Column({ field: 'updated_at', type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt?: Date

  @Column({ field: 'is_recurring', type: DataType.TINYINT, defaultValue: '0' })
  isRecurring?: number

  @BelongsTo(() => User)
  User?: User

  @HasMany(() => RecurringEvent, { sourceKey: 'idx' })
  RecurringEvents?: RecurringEvent[]
}
