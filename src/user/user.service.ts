import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Social } from '../social/social.model'

import { CreateUserDto } from '../../dto/create-user.dto'
import { User } from './user.model'

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

  findOne(id: string): Promise<User> {
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

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id)
    await user.destroy()
  }
}
