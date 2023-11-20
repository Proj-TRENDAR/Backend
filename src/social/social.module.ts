import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Social } from './social.model'

@Module({
  imports: [SequelizeModule.forFeature([Social])],
})
export class SocialModule {}
