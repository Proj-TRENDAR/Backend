import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Todo } from 'models'

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo)
    private todoModel: typeof Todo
  ) {}
}
