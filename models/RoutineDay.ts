import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript'

export interface RoutineDayAttributes {
  routinedayIdx?: number
  routineIdx: number
  day?: number
}

@Table({
  tableName: 'routine_day',
  timestamps: false,
  comment: '루틴에 해당하는 요일을 저장\n0 = 일요일, 1 = 월요일, ... , 6 = 토요일',
})
export class RoutineDay extends Model<RoutineDayAttributes, RoutineDayAttributes> implements RoutineDayAttributes {
  @Column({ field: 'routineday_idx', primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  routinedayIdx?: number

  @Column({ field: 'routine_idx', type: DataType.BIGINT })
  @Index({ name: 'FK_ROUTINEDAY_ROUTINE_idx', using: 'BTREE', order: 'ASC', unique: false })
  routineIdx!: number

  @Column({ type: DataType.INTEGER, defaultValue: '0' })
  day?: number
}
