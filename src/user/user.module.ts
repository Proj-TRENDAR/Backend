import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { User } from './user.entity'

@Module({
  imports: [SequelizeModule.forFeature([User])],
  // export it to use it outside this module
  exports: [SequelizeModule],
})
export class UserModule {}
