import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Sequelize } from 'sequelize-typescript'
import { Social } from '../social/social.model'

import { CreateUserDto } from './dto/create-user.dto'
import { User } from './user.model'

// Injectable을 이용하여 다른 컴포넌트에서도 이 service를 이용할 수 있게 함
@Injectable()
export class UserService {
  constructor(
    private sequelize: Sequelize,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Social)
    private socialModel: typeof Social
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.findAll()
  }

  findSpecificUserUsingId(id: string): Promise<User> {
    return this.userModel.findOne({
      where: {
        id,
      },
      include: [
        {
          model: this.socialModel,
          attributes: ['social', 'connected_at'],
        },
      ],
    })
  }

  async userOfAllInfo(id: string): Promise<void> {
    this.userModel.hasMany(this.socialModel, {
      foreignKey: 'user_id',
    })

    const test = this.userModel.findOne({
      where: {
        id,
      },
      include: [
        {
          model: this.socialModel,
          attributes: ['social', 'connected_at'],
        },
      ],
    })
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userModel.create({
      id: createUserDto.id,
      name: createUserDto.name,
      email: createUserDto.email,
      img_url: createUserDto.imgUrl,
    })
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const t = await this.sequelize.transaction()
    try {
      await this.userModel.create(
        {
          id: createUserDto.id,
          name: createUserDto.name,
          email: createUserDto.email,
          img_url: createUserDto.imgUrl,
        },
        { transaction: t }
      )
      await this.socialModel.create(
        {
          user_id: createUserDto.id,
          social: createUserDto.social,
        },
        { transaction: t }
      )
      await t.commit()
      return
    } catch (error) {
      await t.rollback()
    }
  }

  async remove(id: string): Promise<void> {
    const user = await this.findSpecificUserUsingId(id)
    await user.destroy()
  }
}
