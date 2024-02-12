import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Routine } from 'models'

@Injectable()
export class RoutineService {
  constructor(
    @InjectModel(Routine)
    private routineModel: typeof Routine
  ) {}
}
