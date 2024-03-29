import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Routine, RoutineCompleted, RoutineDay } from 'models'
import { CreateRoutineDto } from 'src/routine/dto/create-routine-dto'
import { CreateRoutineCompletedDto } from 'src/routine/dto/create-routine-completed-dto'

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

  async getRoutineUsingIdx(idx: number): Promise<Routine> {
    return await this.routineModel.findOne({
      where: { idx },
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
        idx: createdRoutine.idx,
        day,
      })
    }

    return await this.getRoutineUsingIdx(createdRoutine.idx)
  }

  async createRoutineCompleted(createRoutineCompletedDto: CreateRoutineCompletedDto): Promise<RoutineCompleted> {
    const { routineIdx, completedAt } = createRoutineCompletedDto
    return await this.routineCompletedModel.create({
      routineIdx,
      completedAt,
    })
  }

  async deleteRoutineCompleted(idx) {
    const result = await this.routineCompletedModel.destroy({
      where: {
        idx,
      },
    })
    if (result) {
      return { success: true, message: '수행한 루틴 삭제 성공' }
    } else {
      throw new HttpException({ success: false, message: '수행한 루틴 삭제 실패' }, HttpStatus.BAD_REQUEST)
    }
  }
}
