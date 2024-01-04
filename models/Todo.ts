import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { User } from './User'

export interface TodoAttributes {
  todoIdx?: number
  userId: string
  title: string
  isDone?: number
  appliedAt: Date
  createdAt?: Date
  updatedAt?: Date
  sequence?: number
}

@Table({ tableName: 'todo', timestamps: false })
export class Todo extends Model<TodoAttributes, TodoAttributes> implements TodoAttributes {
  @Column({ field: 'todo_idx', primaryKey: true, autoIncrement: true, type: DataType.INTEGER })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  todoIdx?: number

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

  @Column({ field: 'updated_at', type: DataType.DATE, defaultValue: DataType.NOW })
  updatedAt?: Date

  @Column({ type: DataType.INTEGER, defaultValue: '1' })
  sequence?: number

  @BelongsTo(() => User)
  User?: User
}
