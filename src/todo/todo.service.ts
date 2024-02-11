import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Todo } from 'models'
import { CreateTodoDto } from 'src/todo/dto/create-todo-dto'
import { UpdateTodoDto } from 'src/todo/dto/update-todo-dto'

interface UpdateResponse {
  success: boolean
  message: string
}

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo)
    private todoModel: typeof Todo
  ) {}

  async createTodo(createTodoDto: CreateTodoDto): Promise<Todo> {
    const createdTodo = this.todoModel.create({
      userId: createTodoDto.userId,
      title: createTodoDto.title,
      isDone: createTodoDto.isDone,
      appliedAt: createTodoDto.appliedAt,
      sequence: createTodoDto.sequence,
    })
    return createdTodo
  }

  async updateTodo(todoIdx: number, updateTodoDto: UpdateTodoDto) {
    const updatedTodo = await this.todoModel.update(
      {
        title: updateTodoDto.title,
        isDone: updateTodoDto.isDone,
        appliedAt: updateTodoDto.appliedAt,
        sequence: updateTodoDto.sequence,
      },
      {
        where: { todoIdx },
      }
    )
    if (updatedTodo[0]) {
      return { success: true, message: '업데이트 성공' }
    } else {
      return { success: false, message: '업데이트 실패(변경 사항 없음)' }
    }
  }
}
