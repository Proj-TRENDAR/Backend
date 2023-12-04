import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Social } from './social.model'
import { SocialController } from './social.controller';

@Module({
  imports: [SequelizeModule.forFeature([Social])],
  controllers: [SocialController],
})
export class SocialModule {}
