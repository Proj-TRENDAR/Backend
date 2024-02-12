import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript'
import { User } from './User'
import { RoutineCompleted } from './RoutineCompleted'

export interface RoutineAttributes {
  routineIdx?: number
  userId: string
  title: string
  color?: number
  description?: string
  weeklyCondition?: number
  numOfAchievements?: number
  startTime: Date
  endTime: Date
  sequence?: number
  createdAt?: Date
}

@Table({ tableName: 'routine', timestamps: false })
export class Routine extends Model<RoutineAttributes, RoutineAttributes> implements RoutineAttributes {
  @Column({ field: 'routine_idx', primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  routineIdx?: number

  @ForeignKey(() => User)
  @Column({ field: 'user_id', type: DataType.STRING(45) })
  @Index({ name: 'FK_ROUTINE_USER_ID_idx', using: 'BTREE', order: 'ASC', unique: false })
  userId!: string

  @Column({ type: DataType.STRING(80) })
  title!: string

  @Column({ type: DataType.INTEGER, defaultValue: '1' })
  color?: number

  @Column({ allowNull: true, type: DataType.STRING })
  description?: string

  @Column({ field: 'weekly_condition', type: DataType.INTEGER, defaultValue: '1' })
  weeklyCondition?: number

  @Column({ field: 'num_of_achievements', allowNull: true, type: DataType.INTEGER })
  numOfAchievements?: number

  @Column({ field: 'start_time', type: DataType.DATE })
  startTime!: Date

  @Column({ field: 'end_time', type: DataType.DATE })
  endTime!: Date

  @Column({ allowNull: true, type: DataType.INTEGER })
  sequence?: number

  @Column({ field: 'created_at', type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt?: Date

  @BelongsTo(() => User)
  User?: User

  @HasMany(() => RoutineCompleted, { sourceKey: 'routineIdx' })
  RoutineCompleteds?: RoutineCompleted[]
}
