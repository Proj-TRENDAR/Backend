import {
  Model,
  Column,
  Table,
  DataType,
  AllowNull,
  PrimaryKey,
  ForeignKey,
  BelongsTo,
  Default,
} from 'sequelize-typescript'
import { User } from '../user/user.model'

@Table({
  tableName: 'social',
})
export class Social extends Model<Social> {
  @AllowNull(false)
  @PrimaryKey
  @ForeignKey(() => User)
  @Column
  user_id: string

  @AllowNull(false)
  @Column(DataType.STRING(20))
  social: string

  @AllowNull(false)
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  connected_at: Date

  @BelongsTo(() => User, { as: 'user', foreignKey: 'user_id' })
  user: User
}
