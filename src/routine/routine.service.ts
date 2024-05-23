import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Transaction } from 'sequelize'
import { InjectModel } from '@nestjs/sequelize'
import { Routine, RoutineCompleted, RoutineDay } from 'models'
import { CreateRoutineDto } from 'src/routine/dto/create-routine.dto'
import { RoutineResponseDto } from 'src/routine/dto/routine-response.dto'
import { CreateRoutineCompletedDto } from 'src/routine/dto/create-routine-completed.dto'
import { RoutineDayService } from 'src/routine/routine-day/routine-day.service'
import { RoutineCompletedService } from 'src/routine/routine-completed/routine-completed.service'
@Injectable()
export class RoutineService {
  constructor(
    @InjectModel(Routine)
    private routineModel: typeof Routine,
    @InjectModel(RoutineCompleted)
    private routineCompletedModel: typeof RoutineCompleted,
    @InjectModel(RoutineDay)
    private routineDayModel: typeof RoutineDay,
    private routineDayService: RoutineDayService,
    private routineCompletedService: RoutineCompletedService
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

  async createRoutine(createRoutineDto: CreateRoutineDto, transaction: Transaction): Promise<RoutineResponseDto> {
    const { userId, title, color, description, weeklyCondition, days, startTime, sequence } = createRoutineDto
    const createdRoutine = await this.routineModel.create(
      {
        userId,
        title,
        color,
        description,
        weeklyCondition,
        startTime,
        sequence,
      },
      { transaction }
    )

    for (const day of days) {
      await this.routineDayService.createRoutineDay(createdRoutine.idx, day, transaction)
    }

    const routineDays = await this.routineDayService.getRoutineDay(createdRoutine.idx, transaction)
    const completedRoutine = await this.routineCompletedService.getRoutineCompleted(createdRoutine.idx, transaction)
    return new RoutineResponseDto(
      Object.assign(createdRoutine, {
        days: routineDays.length ? routineDays : null,
        completed: completedRoutine.length ? completedRoutine : null,
      })
    )
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
