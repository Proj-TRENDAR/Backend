import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { Routine } from './Routine'

export interface RoutineCompletedAttributes {
  idx?: number
  routineIdx: number
  completedAt?: Date
}

@Table({ tableName: 'routine_completed', timestamps: false })
export class RoutineCompleted
  extends Model<RoutineCompletedAttributes, RoutineCompletedAttributes>
  implements RoutineCompletedAttributes
{
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  idx?: number

  @ForeignKey(() => Routine)
  @Column({ field: 'routine_idx', type: DataType.BIGINT })
  @Index({ name: 'FK_COMPROUTINE_ROUTINE_idx', using: 'BTREE', order: 'ASC', unique: false })
  routineIdx!: number

  @Column({ field: 'completed_at', type: DataType.DATE, defaultValue: DataType.NOW })
  completedAt?: Date

  @BelongsTo(() => Routine)
  Routine?: Routine
}
