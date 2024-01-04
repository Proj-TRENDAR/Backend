import { Model, Table, Column, DataType, Index, Sequelize, ForeignKey } from 'sequelize-typescript'

export interface SequelizemetaAttributes {
  name: string
}

@Table({ tableName: 'sequelizemeta', timestamps: false })
export class Sequelizemeta
  extends Model<SequelizemetaAttributes, SequelizemetaAttributes>
  implements SequelizemetaAttributes
{
  @Column({ primaryKey: true, type: DataType.STRING(255) })
  @Index({ name: 'name', using: 'BTREE', order: 'ASC', unique: true })
  @Index({ name: 'PRIMARY', using: 'BTREE', order: 'ASC', unique: true })
  name!: string
}
