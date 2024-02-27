import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Routine, RoutineCompleted, RoutineDay } from 'models'

@Injectable()
export class RoutineService {
  constructor(
    @InjectModel(Routine)
    private routineModel: typeof Routine,
    @InjectModel(RoutineCompleted)
    private routineCompletedModel: typeof RoutineCompleted,
    @InjectModel(RoutineDay)
    private routineDayModel: typeof RoutineDay
  ) {}

  async getRoutine(userId: string): Promise<Routine[]> {
    const routine = await this.routineModel.findAll({
      where: { userId },
      include: [
        {
          model: this.routineCompletedModel,
        },
      ],
    })
    return routine
  }
}
