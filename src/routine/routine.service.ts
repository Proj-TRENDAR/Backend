import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Routine, RoutineCompleted, RoutineDay } from 'models'
import { CreateRoutineDto } from 'src/routine/dto/create-routine-dto'

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

  async getAllRoutine(userId: string): Promise<Routine[]> {
    return await this.routineModel.findAll({
      where: { userId },
      include: [
        {
          model: this.routineCompletedModel,
        },
        {
          model: this.routineDayModel,
        },
      ],
    })
  }

  async getRoutineUsingIdx(routineIdx: number): Promise<Routine> {
    return await this.routineModel.findOne({
      where: { routineIdx },
      include: [
        {
          model: this.routineCompletedModel,
        },
        {
          model: this.routineDayModel,
        },
      ],
    })
  }

  async createRoutine(createRoutineDto: CreateRoutineDto): Promise<Routine> {
    const { userId, title, color, description, weeklyCondition, days, startTime, sequence } = createRoutineDto
    const createdRoutine = await this.routineModel.create({
      userId,
      title,
      color,
      description,
      weeklyCondition,
      startTime,
      sequence,
    })

    for (const day of days) {
      await this.routineDayModel.create({
        routineIdx: createdRoutine.routineIdx,
        day,
      })
    }

    return await this.getRoutineUsingIdx(createdRoutine.routineIdx)
  }
}
