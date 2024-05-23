import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { RoutineDay } from 'models'
import { Transaction } from 'sequelize'

@Injectable()
export class RoutineDayService {
  constructor(
    @InjectModel(RoutineDay)
    private routineDayModel: typeof RoutineDay
  ) {}

  async getRoutineDay(routineIdx: number, transaction: Transaction): Promise<number[]> {
    const routineDays = await this.routineDayModel.findAll({
      attributes: ['day'],
      where: { routineIdx },
      transaction,
    })
    return routineDays.map(routineDay => routineDay.day)
  }

  async createRoutineDay(routineIdx: number, day: number, transaction: Transaction): Promise<RoutineDay> {
    return await this.routineDayModel.create(
      {
        routineIdx,
        day,
      },
      { transaction }
    )
  }
}
