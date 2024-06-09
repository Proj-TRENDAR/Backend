import { Module } from '@nestjs/common'
import { SequelizeModule } from '@nestjs/sequelize'
import { EventRecurringService } from './event-recurring.service'
import { RecurringEvent } from 'models'

@Module({
  imports: [SequelizeModule.forFeature([RecurringEvent])],
  providers: [EventRecurringService],
  exports: [EventRecurringService],
})
export class EventRecurringModule {}
