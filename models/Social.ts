import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey, BelongsTo } from 'sequelize-typescript'
import { User } from './User'

export interface SocialAttributes {
  userId: string
  social: string
  connectedAt?: Date
}

@Table({ tableName: 'social', timestamps: false })
export class Social extends Model<SocialAttributes, SocialAttributes> implements SocialAttributes {
  @ForeignKey(() => User)
  @Column({ field: 'user_id', primaryKey: true, type: DataType.STRING(45) })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  userId!: string

  @Column({ type: DataType.STRING(20) })
  social!: string

  @Column({ field: 'connected_at', type: DataType.DATE, defaultValue: DataType.NOW })
  connectedAt?: Date

  @BelongsTo(() => User)
  User?: User
}
