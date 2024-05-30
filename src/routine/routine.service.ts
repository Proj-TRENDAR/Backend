import { Injectable } from '@nestjs/common'
import { Transaction } from 'sequelize'
import { InjectModel } from '@nestjs/sequelize'
import { Routine } from 'models'
import { CreateRoutineDto } from 'src/routine/dto/create-routine.dto'
import { UpdateRoutineDto } from 'src/routine/dto/update-routine.dto'
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

  private async getRoutine(idx: number, transaction: Transaction) {
    const routine = await this.routineModel.findOne({
      where: { idx },
      transaction,
    })
    const routineDays = await this.routineDayService.getRoutineDay(routine.idx, transaction)
    const completedRoutine = await this.routineCompletedService.getAllRoutineCompleted(routine.idx, transaction)

    return new RoutineResponseDto(
      Object.assign(routine, {
        days: routineDays.length ? routineDays : null,
        completed: completedRoutine.length ? completedRoutine : null,
      })
    )
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

    return await this.getRoutine(createdRoutine.idx, transaction)
  }

  async updateRoutine(
    idx: number,
    updateRoutineDto: UpdateRoutineDto,
    transaction: Transaction
  ): Promise<RoutineResponseDto> {
    const { title, color, description, weeklyCondition, days, startTime, endTime } = updateRoutineDto
    const getDay = await this.routineDayService.getRoutineDay(idx, transaction)
    let updateCheck = false
    if (JSON.stringify(days) !== JSON.stringify(getDay)) {
      await this.routineDayService.deleteRoutineDay(idx, transaction)
      await Promise.all(days.map(day => this.routineDayService.createRoutineDay(idx, day, transaction)))
      updateCheck = true
    }

    const result = await this.routineModel.update(
      { title, color, description, weeklyCondition, startTime, endTime },
      {
        where: { idx },
        transaction,
      }
    )
    if (!updateCheck && !result[0]) {
      return null
    }
    return await this.getRoutine(idx, transaction)
  }

  async restoreRoutine(idx: number, transaction: Transaction) {
    await this.routineModel.restore({
      where: {
        idx,
      },
      transaction,
    })
  }

  async softDeleteRoutine(idx: number, transaction: Transaction) {
    const result = await this.routineModel.destroy({
      where: {
        idx,
      },
      transaction,
    })
    return result > 0
  }

  async hardDeleteRoutine(idx: number, transaction: Transaction): Promise<boolean> {
    const result = await this.routineModel.destroy({
      force: true,
      where: {
        idx,
      },
      transaction,
    })
    return result > 0
  }
}
