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
import { IUserReq } from 'src/user/interface/user-req.interface'
import { TodoResponseDto } from './dto/todo-response.dto'

@Controller('todo')
@ApiTags('ToDo API')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Get()
  @ApiOperation({ summary: 'ToDo 가져오기', description: '유저의 모든 ToDo get API' })
  @ApiOkResponse({
    type: TodoResponseDto,
    description: 'Successful response',
  })
  async getTodoList(@Req() req: IUserReq): Promise<TodoResponseDto[]> {
    const todoList = await this.todoService.getTodoList(req.user.id)
    return todoList.map(todo => new TodoResponseDto(todo))
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post()
  @ApiOperation({ summary: 'ToDo 생성', description: 'ToDo 생성 API' })
  @ApiCreatedResponse({
    description: '성공 시(example)',
    schema: {
      example: {
        idx: 1,
        title: 'test',
        isDone: true,
        sequence: 1,
        appliedAt: '2024-03-13T04:42:00.000Z',
      },
    },
  })
  @UsePipes(ValidationPipe)
  async createTodo(@Body() createTodoDto: CreateTodoDto, @Req() req: IUserReq): Promise<TodoResponseDto> {
    createTodoDto.userId = req.user.id
    const result = await this.todoService.createTodo(createTodoDto)
    return new TodoResponseDto(result)
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
