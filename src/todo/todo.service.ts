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
    const { userId, title, isDone, appliedAt, sequence } = createTodoDto
    return this.todoModel.create({
      userId,
      title,
      isDone,
      appliedAt,
      sequence,
    })
  }

  async updateTodo(todoIdx: number, updateTodoDto: UpdateTodoDto) {
    const { title, isDone, appliedAt, sequence } = updateTodoDto
    const updatedTodo = await this.todoModel.update(
      {
        title,
        isDone,
        appliedAt,
        sequence,
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
