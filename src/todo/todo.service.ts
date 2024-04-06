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

  async getTodoList(userId: string): Promise<Todo[]> {
    return await this.todoModel.findAll({
      where: { userId },
    })
  }

  async getTodo(idx: number): Promise<Todo> {
    return await this.todoModel.findOne({
      where: { idx },
    })
  }

  async createTodo(createTodoDto: CreateTodoDto): Promise<Todo> {
    const { userId, title, isDone, appliedAt, sequence } = createTodoDto
    return await this.todoModel.create({
      userId,
      title,
      isDone,
      appliedAt,
      sequence,
    })
  }

  async updateTodo(idx: number, updateTodoDto: UpdateTodoDto) {
    const { title, isDone, appliedAt, sequence } = updateTodoDto
    // TODO: sequence 겹치는지 확인해 줘야 해
    const updatedTodo = await this.todoModel.update(
      {
        title,
        isDone,
        appliedAt,
        sequence,
      },
      {
        where: { idx },
      }
    )
    if (updatedTodo[0]) {
      const todo = await this.getTodo(idx)
      return { success: true, message: '업데이트 성공', data: todo }
    } else {
      return { success: false, message: '업데이트 실패(변경 사항 없음)', data: null }
    }
  }

  async deleteTodo(idx: number) {
    await this.todoModel.destroy({
      where: {
        idx,
      },
    })
  }
}
