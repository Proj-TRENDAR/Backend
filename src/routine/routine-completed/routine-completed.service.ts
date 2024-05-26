import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { RoutineCompleted } from 'models'
import { Transaction } from 'sequelize'
import { CreateRoutineCompletedDto } from '../dto/create-routine-completed.dto'
import { RoutineCompletedResponseDto } from '../dto/routine-completed-response.dto'

@Injectable()
export class RoutineCompletedService {
  constructor(
    @InjectModel(RoutineCompleted)
    private routineCompletedModel: typeof RoutineCompleted
  ) {}

  async getAllRoutineCompleted(routineIdx: number, transaction: Transaction): Promise<Date[]> {
    const completedRoutine = await this.routineCompletedModel.findAll({
      attributes: ['completedAt'],
      where: { routineIdx },
      transaction,
    })
    return completedRoutine.map(item => item.completedAt)
  }

  async createRoutineCompleted(
    createRoutineCompletedDto: CreateRoutineCompletedDto,
    transaction: Transaction
  ): Promise<RoutineCompletedResponseDto> {
    const { routineIdx, completedAt } = createRoutineCompletedDto
    const completedRoutine = await this.routineCompletedModel.create(
      {
        routineIdx,
        completedAt,
      },
      { transaction }
    )
    return new RoutineCompletedResponseDto(completedRoutine)
  }
}
