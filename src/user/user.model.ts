import {
  Model,
  Column,
  Table,
  DataType,
  AllowNull,
  CreatedAt,
  UpdatedAt,
  PrimaryKey,
  Default,
  HasMany,
} from 'sequelize-typescript'
import { Social } from '../social/social.model'
@Table({
  tableName: 'user',
  timestamps: true,
})
export class User extends Model<User> {
  @AllowNull(false)
  @PrimaryKey
  @Column(DataType.STRING(45))
  id: string

  @AllowNull(false)
  @Column(DataType.STRING(45))
  name: string

  @AllowNull(false)
  @Column(DataType.STRING(100))
  email: string

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(1000))
  img_url: string

  @AllowNull(true)
  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date

  @AllowNull(true)
  @UpdatedAt
  @Column(DataType.DATE)
  updated_at: Date

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(250))
  refresh_token: string

  @AllowNull(false)
  @Default(1)
  @Column(DataType.NUMBER)
  thema_color: number

  @HasMany(() => Social)
  social: Social[]
}
