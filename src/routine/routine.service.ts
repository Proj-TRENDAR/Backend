import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { Transaction } from 'sequelize'
import { InjectModel } from '@nestjs/sequelize'
import { Routine } from 'models'
import { CreateRoutineDto } from 'src/routine/dto/create-routine.dto'
import { RoutineResponseDto } from 'src/routine/dto/routine-response.dto'
import { RoutineDayService } from 'src/routine/routine-day/routine-day.service'
import { RoutineCompletedService } from 'src/routine/routine-completed/routine-completed.service'
@Injectable()
export class RoutineService {
  constructor(
    @InjectModel(Routine)
    private routineModel: typeof Routine,

    private routineDayService: RoutineDayService,
    private routineCompletedService: RoutineCompletedService
  ) {}

  private async lastSequenceRoutine(): Promise<Pick<Routine, 'sequence'> | null> {
    return await this.routineModel.findOne({
      attributes: ['sequence'],
      order: [['sequence', 'DESC']],
    })
  }

  async getAllRoutine(userId: string, transaction: Transaction): Promise<RoutineResponseDto[]> {
    const routine = await this.routineModel.findAll({
      where: { userId },
      order: ['sequence'],
      transaction,
    })

    return await Promise.all(
      routine.map(async item => {
        const routineDays = await this.routineDayService.getRoutineDay(item.idx, transaction)
        const completedRoutine = await this.routineCompletedService.getAllRoutineCompleted(item.idx, transaction)

        return new RoutineResponseDto(
          Object.assign(item, {
            days: routineDays.length ? routineDays : null,
            completed: completedRoutine.length ? completedRoutine : null,
          })
        )
      })
    )
  }

  // async getRoutineUsingIdx(idx: number): Promise<Routine> {
  //   return await this.routineModel.findOne({
  //     where: { idx },
  //     include: [
  //       {
  //         model: this.routineCompletedModel,
  //       },
  //       {
  //         model: this.routineDayModel,
  //       },
  //     ],
  //   })
  // }

  async createRoutine(createRoutineDto: CreateRoutineDto, transaction: Transaction): Promise<RoutineResponseDto> {
    const { userId, title, color, description, weeklyCondition, days, startTime } = createRoutineDto
    const lastRoutine = await this.lastSequenceRoutine()
    const createdRoutine = await this.routineModel.create(
      {
        userId,
        title,
        color,
        description,
        weeklyCondition,
        startTime,
        sequence: lastRoutine ? lastRoutine.sequence + 1 : 1,
      },
      { transaction }
    )

    if (days) {
      await Promise.all(days.map(day => this.routineDayService.createRoutineDay(createdRoutine.idx, day, transaction)))
    }

    const routineDays = await this.routineDayService.getRoutineDay(createdRoutine.idx, transaction)
    const completedRoutine = await this.routineCompletedService.getAllRoutineCompleted(createdRoutine.idx, transaction)
    return new RoutineResponseDto(
      Object.assign(createdRoutine, {
        days: routineDays.length ? routineDays : null,
        completed: completedRoutine.length ? completedRoutine : null,
      })
    )
  }

  // async deleteRoutineCompleted(idx) {
  //   const result = await this.routineCompletedModel.destroy({
  //     where: {
  //       idx,
  //     },
  //   })
  //   if (result) {
  //     return { success: true, message: '수행한 루틴 삭제 성공' }
  //   } else {
  //     throw new HttpException({ success: false, message: '수행한 루틴 삭제 실패' }, HttpStatus.BAD_REQUEST)
  //   }
  // }
}
