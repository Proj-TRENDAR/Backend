import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import { CreateUserDto } from './dto/create-user.dto'
import { User, Social } from 'models'

// Injectable을 이용하여 다른 컴포넌트에서도 이 service를 이용할 수 있게 함
@Injectable()
export class UserService {
  constructor(
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
      foreignKey: 'userId',
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
      imgUrl: createUserDto.imgUrl,
    })
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const userInfo = await this.userModel.create({
      id: createUserDto.id,
      name: createUserDto.name,
      email: createUserDto.email,
      imgUrl: createUserDto.imgUrl,
    })
    await this.socialModel.create({
      userId: createUserDto.id,
      social: createUserDto.social,
    })
    return userInfo
  }

  async setCurrentRefreshToken(id: string, refreshToken: string): Promise<void> {
    await this.userModel.update(
      { refreshToken },
      {
        where: {
          id,
        },
      }
    )
    return
  }

  async remove(id: string): Promise<void> {
    const user = await this.findSpecificUserUsingId(id)
    await user.destroy()
  }
}
