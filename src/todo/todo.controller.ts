import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { TodoService } from 'src/todo/todo.service'
import { JwtAuthGuard } from 'src/auth/authentication/jwt-auth.guard'
import { TransactionInterceptor } from 'src/share/transaction/interceptor'
import { CreateTodoDto } from 'src/todo/dto/create-todo-dto'
import { Todo } from 'models'
import { UpdateTodoDto } from './dto/update-todo-dto'
import { throwError } from 'rxjs'

@Controller('todo')
@ApiTags('ToDo API')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post()
  @ApiOperation({ summary: 'ToDo 생성', description: 'ToDo 생성 API' })
  @ApiCreatedResponse({
    description: '성공 시(example)',
    schema: {
      example: {
        createdAt: '2024-02-10T05:14:18.317Z',
        updatedAt: '2024-02-10T05:14:18.317Z',
        todoIdx: 1,
        userId: '123',
        title: 'test',
        isDone: 1,
        appliedAt: '2024-01-28T15:00:00.000Z',
        sequence: 1,
      },
    },
  })
  @UsePipes(ValidationPipe)
  createTodo(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    return this.todoService.createTodo(createTodoDto)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Put(':todoIdx')
  @ApiOperation({ summary: 'ToDo 수정', description: 'ToDo 수정 API' })
  @ApiOkResponse({ description: 'ToDo 수정' })
  async updateTodo(@Param('todoIdx', ParseIntPipe) todoIdx: number, @Body() updateTodo: UpdateTodoDto) {
    return await this.todoService.updateTodo(todoIdx, updateTodo)
  }
}
