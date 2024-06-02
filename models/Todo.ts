import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { User } from './User'

export interface TodoAttributes {
  idx?: number
  userId: string
  title: string
  isDone?: number
  appliedAt: Date
  createdAt?: Date
  updatedAt?: Date
  sequence?: number
}

@Table({ tableName: 'todo', timestamps: true })
export class Todo extends Model<TodoAttributes, TodoAttributes> implements TodoAttributes {
  @Column({ primaryKey: true, autoIncrement: true, type: DataType.BIGINT })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  idx?: number

  @ForeignKey(() => User)
  @Column({ field: 'user_id', type: DataType.STRING(45) })
  @Index({ name: 'FK_TODO_USER_ID_idx', using: 'BTREE', order: 'ASC', unique: false })
  userId!: string

  @Column({ type: DataType.STRING(80) })
  title!: string

  @Column({ field: 'is_done', type: DataType.TINYINT, defaultValue: '0' })
  isDone?: number

  @Column({ field: 'applied_at', type: DataType.DATE })
  appliedAt!: Date

  @Column({ field: 'created_at', type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt?: Date

  @Column({ field: 'updated_at', allowNull: true, type: DataType.DATE })
  updatedAt?: Date

  @Column({ allowNull: true, type: DataType.INTEGER })
  sequence?: number

  @BelongsTo(() => User)
  User?: User
}
