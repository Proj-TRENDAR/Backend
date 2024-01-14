import { Body, Controller, Delete, Get, Param, Post, UsePipes, ValidationPipe, UseInterceptors } from '@nestjs/common'
import { Transaction } from 'sequelize'
import { CreateUserDto } from './dto/create-user.dto'
import { User } from 'models'
import { UserService } from './user.service'
import { ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger'
import { TransactionParam } from 'src/share/transaction/param'
import { TransactionInterceptor } from 'src/share/transaction/interceptor'

@Controller('user')
@ApiTags('User API')
export class UserController {
  // 의존성 주입 (controller에서 만든 service를 사용할 수 있게 해주는 작업)
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: '전체 유저 조회', description: '전체 유저 조회 API' })
  findAll(): Promise<User[]> {
    return this.userService.findAll()
  }

  @UseInterceptors(TransactionInterceptor)
  @Get(':id')
  @ApiOperation({ summary: '특정 유저 조회', description: '특정 유저 조회 API' })
  findSpecificUserUsingId(@Param('id') id: string, @TransactionParam() transaction: Transaction): Promise<User> {
    return this.userService.findSpecificUserUsingId(id, transaction)
  }

  @Post()
  @ApiOperation({ summary: '유저 생성', description: '유저 생성 API' })
  @ApiCreatedResponse({
    description: '성공 시(example)',
    schema: {
      example: {
        id: 'tester',
        name: '테스터',
        email: 'tester@gamil.com',
        img_url: null,
        updated_at: '2023-11-28T11:50:58.172Z',
        created_at: '2023-11-28T11:50:58.172Z',
        refresh_token: null,
        thema_color: 1,
      },
    },
  })
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto)
  }

  @UseInterceptors(TransactionInterceptor)
  @Delete(':id')
  @ApiOperation({ summary: '유저 삭제', description: '유저 삭제 API' })
  remove(@Param('id') id: string, @TransactionParam() transaction: Transaction): Promise<void> {
    return this.userService.remove(id, transaction)
  }
}
