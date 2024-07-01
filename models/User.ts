import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey, HasMany } from 'sequelize-typescript'
import { Social } from './Social'
import { Todo } from './Todo'
import { Event } from './Event'
import { Routine } from './Routine'

export interface UserAttributes {
  id: string
  name: string
  email: string
  imgUrl?: string
  createdAt?: Date
  updatedAt?: Date
  refreshToken?: string
  themeColor?: number
}

@Table({ tableName: 'user', timestamps: false })
export class User extends Model<UserAttributes, UserAttributes> implements UserAttributes {
  @Column({ primaryKey: true, type: DataType.STRING(45) })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  id!: string

  @Column({ type: DataType.STRING(45) })
  name!: string

  @Column({ type: DataType.STRING(100) })
  email!: string

  @Column({ field: 'img_url', allowNull: true, type: DataType.STRING })
  imgUrl?: string

  @Column({ field: 'created_at', allowNull: true, type: DataType.DATE, defaultValue: DataType.NOW })
  createdAt?: Date

  @Column({ field: 'updated_at', allowNull: true, type: DataType.DATE })
  updatedAt?: Date

  @Column({ field: 'refresh_token', allowNull: true, type: DataType.STRING(250) })
  refreshToken?: string

  @Column({ field: 'theme_color', type: DataType.INTEGER, defaultValue: '1' })
  themeColor?: number

  @HasMany(() => Social, { sourceKey: 'id' })
  Socials?: Social[]

  @HasMany(() => Todo, { sourceKey: 'id' })
  Todos?: Todo[]

  @HasMany(() => Event, { sourceKey: 'id' })
  Events?: Event[]

  @HasMany(() => Routine, { sourceKey: 'id' })
  Routines?: Routine[]
}
