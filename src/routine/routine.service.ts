import { Injectable } from '@nestjs/common'
import { Transaction } from 'sequelize'
import { InjectModel } from '@nestjs/sequelize'
import { Routine } from 'models'
import { CreateRoutineDto } from 'src/routine/dto/create-routine.dto'
import { UpdateRoutineDto } from 'src/routine/dto/update-routine.dto'
import { RoutineResponseDto } from 'src/routine/dto/routine-response.dto'
import { RoutineDayService } from 'src/routine/routine-day/routine-day.service'
import { RoutineCompletedService } from 'src/routine/routine-completed/routine-completed.service'
import { RoutineNotFoundException } from 'src/routine/routine.errors'

@Injectable()
export class RoutineService {
  constructor(
    @InjectModel(Routine)
    private routineModel: typeof Routine,

    private routineDayService: RoutineDayService,
    private routineCompletedService: RoutineCompletedService
  ) {}

  private async maxSequenceOfRoutine(
    userId: string,
    transaction: Transaction
  ): Promise<Pick<Routine, 'sequence'> | null> {
    return await this.routineModel.findOne({
      attributes: ['sequence'],
      where: {
        userId,
      },
      order: [['sequence', 'DESC']],
      transaction,
    })
  }

  private async getRoutine(idx: number, userId: string, transaction: Transaction) {
    const routine = await this.routineModel.findOne({
      where: { idx, userId },
      transaction,
    })

    if (!routine) throw new RoutineNotFoundException()

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
    const maxSequenceRoutine = await this.maxSequenceOfRoutine(userId, transaction)
    const createdRoutine = await this.routineModel.create(
      {
        userId,
        title,
        color,
        description,
        weeklyCondition,
        startTime,
        sequence: maxSequenceRoutine ? maxSequenceRoutine.sequence + 1 : 1,
      },
      { transaction }
    )

    if (days) {
      await Promise.all(days.map(day => this.routineDayService.createRoutineDay(createdRoutine.idx, day, transaction)))
    }

    return await this.getRoutine(createdRoutine.idx, userId, transaction)
  }

  async updateRoutine(
    idx: number,
    userId: string,
    updateRoutineDto: UpdateRoutineDto,
    transaction: Transaction
  ): Promise<RoutineResponseDto> {
    const { title, color, description, weeklyCondition, days, startTime, endTime } = updateRoutineDto
    const routine = await this.getRoutine(idx, userId, transaction)
    let updateCheck = false

    if (JSON.stringify(days) !== JSON.stringify(routine.days)) {
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
    return await this.getRoutine(idx, userId, transaction)
  }

  async restoreRoutine(idx: number, userId: string, transaction: Transaction): Promise<void> {
    await this.getRoutine(idx, userId, transaction)
    await this.routineModel.restore({
      where: {
        idx,
      },
      transaction,
    })
  }

  async softDeleteRoutine(idx: number, userId: string, transaction: Transaction): Promise<void> {
    await this.getRoutine(idx, userId, transaction)
    await this.routineModel.destroy({
      where: {
        idx,
      },
      transaction,
    })
  }

  async hardDeleteRoutine(idx: number, userId: string, transaction: Transaction): Promise<void> {
    await this.getRoutine(idx, userId, transaction)
    // days, completed의 FK delete가 cascade라서 가능하나 추가해주면 좋을듯 함
    await this.routineModel.destroy({
      force: true,
      where: {
        idx,
      },
      transaction,
    })
  }
}
