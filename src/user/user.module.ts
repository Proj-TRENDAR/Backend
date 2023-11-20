import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from './user.model'
import { UserController } from './user.controller'
import { UserService } from './user.service'
import { Social } from '../social/social.model'

@Module({
  imports: [SequelizeModule.forFeature([User, Social])],
  providers: [UserService],
  controllers: [UserController],

  // export it to use it outside this module
  exports: [SequelizeModule],
})
export class UserModule {}
