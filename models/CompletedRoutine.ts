import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { Routine } from './Routine'

export interface CompletedRoutineAttributes {
  comproutineIdx?: number
  routineIdx: number
  completedAt?: Date
}

@Table({ tableName: 'completed_routine', timestamps: false })
export class CompletedRoutine
  extends Model<CompletedRoutineAttributes, CompletedRoutineAttributes>
  implements CompletedRoutineAttributes
{
  @Column({ field: 'comproutine_idx', primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  comproutineIdx?: number

  @ForeignKey(() => Routine)
  @Column({ field: 'routine_idx', type: DataType.BIGINT })
  @Index({ name: 'FK_COMPROUTINE_ROUTINE_idx', using: 'BTREE', order: 'ASC', unique: false })
  routineIdx!: number

  @Column({ field: 'completed_at', type: DataType.DATE, defaultValue: DataType.NOW })
  completedAt?: Date

  @BelongsTo(() => Routine)
  Routine?: Routine
}
