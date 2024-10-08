import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op, Transaction } from 'sequelize'
import { Todo } from 'models'
import { CreateTodoDto } from 'src/todo/dto/create-todo.dto'
import { UpdateTodoDto } from 'src/todo/dto/update-todo.dto'
import { TodoResponseDto } from 'src/todo/dto/todo-response.dto'
import { TodoNotFoundException } from './todo.errors'

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo)
    private todoModel: typeof Todo
  ) {}

  async getTodoList(userId: string): Promise<TodoResponseDto[]> {
    const todo = await this.todoModel.findAll({
      where: { userId },
    })
    return todo.map(item => new TodoResponseDto(item))
  }

  private async getTodo(idx: number, transaction: Transaction): Promise<Todo> {
    const todo = await this.todoModel.findOne({
      where: { idx },
      transaction,
    })

    if (!todo) throw new TodoNotFoundException()

    return todo
  }

  async createTodo(createTodoDto: CreateTodoDto, transaction: Transaction): Promise<TodoResponseDto> {
    const { userId, title, appliedAt } = createTodoDto
    const startDate = new Date(appliedAt)
    startDate.setHours(0, 0, 0, 0)
    const endDate = new Date(appliedAt)
    endDate.setHours(23, 59, 59, 999)

    const lastSequenceTodoInfo = await this.todoModel.findOne({
      raw: true,
      where: {
        appliedAt: {
          [Op.between]: [startDate, endDate],
        },
      },
      order: [['sequence', 'desc']],
      transaction,
    })

    const createdTodo = await this.todoModel.create(
      {
        userId,
        title,
        appliedAt,
        sequence: lastSequenceTodoInfo ? lastSequenceTodoInfo.sequence + 1 : 1,
      },
      { transaction }
    )
    return new TodoResponseDto(createdTodo)
  }

  async updateTodo(idx: number, updateTodoDto: UpdateTodoDto, transaction: Transaction) {
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
        transaction,
      }
    )
    if (updatedTodo[0]) {
      const todo = await this.getTodo(idx, transaction)
      return { success: true, message: '업데이트 성공', data: todo }
    } else {
      return { success: false, message: '업데이트 실패(변경 사항 없음)', data: null }
    }
  }

  async deleteTodo(idx: number, transaction: Transaction) {
    await this.getTodo(idx, transaction)

    await this.todoModel.destroy({
      where: {
        idx,
      },
      transaction,
    })
  }
}
