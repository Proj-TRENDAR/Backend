import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { Event } from 'models'
import { EventController } from 'src/event/event.controller'
import { EventService } from 'src/event/event.service'
import { EventRecurringModule } from 'src/event/event-recurring/event-recurring.module'

@Module({
  imports: [SequelizeModule.forFeature([Event]), EventRecurringModule],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}
