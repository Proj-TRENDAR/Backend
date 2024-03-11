import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
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
import { UpdateTodoDto } from 'src/todo/dto/update-todo-dto'
import { Todo } from 'models'
import { IUserReq } from 'src/user/interface/user-req.interface'

@Controller('todo')
@ApiTags('ToDo API')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get ToDo', description: '유저의 모든 ToDo get API' })
  getTodoList(@Req() req: IUserReq): Promise<Todo[]> {
    return this.todoService.getTodoList(req.user.id)
  }

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
  createTodo(@Body() createTodoDto: CreateTodoDto, @Req() req: IUserReq): Promise<Todo> {
    createTodoDto.userId = req.user.id
    return this.todoService.createTodo(createTodoDto)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Put(':todoIdx')
  @ApiOperation({ summary: 'ToDo 수정', description: 'ToDo 수정 API' })
  @ApiOkResponse({ description: 'ToDo 수정' })
  async updateTodo(@Param('todoIdx', ParseIntPipe) idx: number, @Body() updateTodo: UpdateTodoDto) {
    return await this.todoService.updateTodo(idx, updateTodo)
  }
}
