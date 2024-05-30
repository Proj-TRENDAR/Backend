import { Model, Table, Column, DataType, Index, ForeignKey, BelongsTo, HasMany } from 'sequelize-typescript'
import { User } from './User'
import { RoutineCompleted } from './RoutineCompleted'
import { RoutineDay } from './RoutineDay'

export interface RoutineAttributes {
  idx?: number
  userId: string
  title: string
  color?: number
  description?: string
  weeklyCondition?: number
  startTime: Date
  endTime?: Date
  sequence?: number
  createdAt?: Date
  updatedAt?: Date
  deletedAt?: Date
}

@Table({ tableName: 'routine', timestamps: true, paranoid: true })
export class Routine extends Model<RoutineAttributes, RoutineAttributes> implements RoutineAttributes {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  idx?: number

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

  @Column({ field: 'start_time', type: DataType.DATE })
  startTime!: Date

  @Column({ field: 'end_time', allowNull: true, type: DataType.DATE })
  endTime?: Date

  @Column({ allowNull: true, type: DataType.INTEGER })
  sequence?: number

  @Column({ field: 'created_at', type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt?: Date

  @Column({ field: 'updated_at', type: DataType.DATE })
  updatedAt?: Date

  @Column({ field: 'deleted_at', allowNull: true, type: DataType.DATE })
  deletedAt?: Date

  @BelongsTo(() => User)
  User?: User

  @HasMany(() => RoutineCompleted, { sourceKey: 'idx' })
  RoutineCompleteds?: RoutineCompleted[]

  @HasMany(() => RoutineDay, { sourceKey: 'idx' })
  RoutineDays?: RoutineDay[]
}
