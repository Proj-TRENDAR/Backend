import { Model, Column, Table, DataType, AllowNull, CreatedAt, PrimaryKey, Default } from 'sequelize-typescript'
//string boolean number bigint Date Buffer
@Table({
  tableName: 'user',
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
  email: number

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(1000))
  img_url: string

  @AllowNull(true)
  @CreatedAt
  @Column(DataType.DATE)
  created_at: Date

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(250))
  refresh_token: string

  @AllowNull(false)
  @Default(1)
  @Column(DataType.NUMBER)
  thema_color: number
}
