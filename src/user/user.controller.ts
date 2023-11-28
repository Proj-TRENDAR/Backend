import { Body, Controller, Delete, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common'
import { CreateUserDto } from '../../dto/create-user.dto'
import { User } from './user.model'
import { UserService } from './user.service'
import { ApiTags, ApiOperation, ApiCreatedResponse } from '@nestjs/swagger'

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

  @Get(':id')
  @ApiOperation({ summary: '특정 유저 조회', description: '특정 유저 조회 API' })
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOne(id)
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

  @Delete(':id')
  @ApiOperation({ summary: '유저 삭제', description: '유저 삭제 API' })
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id)
  }
}
