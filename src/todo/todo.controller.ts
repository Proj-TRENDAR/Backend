import {
  BadRequestException,
  Body,
  Controller,
  Delete,
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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger'
import { TodoService } from 'src/todo/todo.service'
import { JwtAuthGuard } from 'src/auth/authentication/jwt-auth.guard'
import { TransactionInterceptor } from 'src/share/transaction/interceptor'
import { CreateTodoDto } from 'src/todo/dto/create-todo.dto'
import { UpdateTodoDto } from 'src/todo/dto/update-todo.dto'
import { TodoResponseDto } from './dto/todo-response.dto'
import { IUserReq } from 'src/user/interface/user-req.interface'
import { TransactionParam } from '../share/transaction/param'
import { Transaction } from 'sequelize'

@Controller('todo')
@ApiTags('ToDo API')
@ApiBearerAuth('accessToken')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'ToDo 가져오기', description: '유저의 모든 ToDo get API' })
  @ApiOkResponse({
    type: TodoResponseDto,
    description: 'Successful response',
  })
  async getTodoList(@Req() req: IUserReq): Promise<TodoResponseDto[]> {
    return await this.todoService.getTodoList(req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post()
  @ApiOperation({ summary: 'ToDo 생성', description: 'ToDo 생성 API' })
  @ApiCreatedResponse({
    type: TodoResponseDto,
    description: 'ToDo 생성 성공',
    schema: {
      $ref: getSchemaPath(TodoResponseDto),
    },
  })
  @UsePipes(ValidationPipe)
  async createTodo(
    @Body() createTodoDto: CreateTodoDto,
    @Req() req: IUserReq,
    @TransactionParam() transaction: Transaction
  ): Promise<TodoResponseDto> {
    createTodoDto.userId = req.user.id
    return await this.todoService.createTodo(createTodoDto, transaction)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Put(':todoIdx')
  @ApiOperation({ summary: 'ToDo 수정', description: 'ToDo 수정 API' })
  @ApiOkResponse({
    type: TodoResponseDto,
    description: 'ToDo 수정 성공',
    schema: {
      $ref: getSchemaPath(TodoResponseDto),
    },
  })
  @UsePipes(ValidationPipe)
  async updateTodo(
    @Param('todoIdx', ParseIntPipe) idx: number,
    @Body() updateTodo: UpdateTodoDto,
    @TransactionParam() transaction: Transaction
  ): Promise<TodoResponseDto> {
    const result = await this.todoService.updateTodo(idx, updateTodo, transaction)
    if (!result.success) {
      throw new BadRequestException(result.message)
    }
    return new TodoResponseDto(result.data)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Delete(':todoIdx')
  @ApiOperation({ summary: 'ToDo 삭제', description: 'ToDo 삭제 API' })
  @ApiOkResponse({ description: 'ToDo 삭제 성공' })
  @ApiBadRequestResponse({ description: 'ToDo 삭제 실패' })
  @UsePipes(ValidationPipe)
  async deleteTodo(@Param('todoIdx', ParseIntPipe) idx: number, @TransactionParam() transaction: Transaction) {
    const result = await this.todoService.deleteTodo(idx, transaction)
    if (!result) {
      throw new BadRequestException('삭제 중 오류 발생')
    }
  }
}
