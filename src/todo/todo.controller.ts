import { Controller, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { TodoService } from './todo.service'

@Controller('todo')
@ApiTags('To Do API')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}
}
