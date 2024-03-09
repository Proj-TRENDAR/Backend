import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Event, RecurringEvent } from 'models'
import { EventController } from './event.controller'
import { EventService } from './event.service'

@Module({
  imports: [SequelizeModule.forFeature([Event, RecurringEvent])],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
