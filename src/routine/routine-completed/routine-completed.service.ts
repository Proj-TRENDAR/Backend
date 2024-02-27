import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { RoutineCompleted } from 'models'

@Injectable()
export class RoutineCompletedService {
  constructor(
    @InjectModel(RoutineCompleted)
    private routineCompletedModel: typeof RoutineCompleted
  ) {}
}
