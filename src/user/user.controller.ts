import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiCreatedResponse, ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { TransactionInterceptor } from 'src/share/transaction/interceptor'
import { User } from 'models'
import { CreateUserDto } from 'src/user/dto/create-user.dto'
import { UserResponseDto } from 'src/user/dto/user-response.dto'
import { UserService } from 'src/user/user.service'
import { JwtAuthGuard } from 'src/auth/authentication/jwt-auth.guard'
import { IUserReq } from 'src/user/interface/user-req.interface'
import { TransactionParam } from 'src/share/transaction/param'
import { Transaction } from 'sequelize'

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
  findSpecificUserUsingId(@Param('id') id: string): Promise<User> {
    return this.userService.findSpecificUserUsingId(id)
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
        imgUrl: null,
        updatedAt: '2023-11-28T11:50:58.172Z',
        createdAt: '2023-11-28T11:50:58.172Z',
        refreshToken: null,
        themaColor: 1,
      },
    },
  })
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.create(createUserDto)
  }

  @UseInterceptors(TransactionInterceptor)
  @Post('info')
  getInfoUsingMonth(@Body('id') id: string, @Body('date') date: Date): Promise<void> {
    return this.userService.getInfoUsingMonth(id, date)
  }

  @UseInterceptors(TransactionInterceptor)
  @Delete(':id')
  @ApiOperation({ summary: '유저 삭제', description: '유저 삭제 API' })
  remove(@Param('id') id: string): Promise<void> {
    return this.userService.remove(id)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post('theme')
  @ApiBearerAuth('accessToken')
  @ApiUnauthorizedResponse({ description: '인증 실패' })
  @ApiOperation({ summary: '유저 테마 변경', description: '유저 테마 변경 API' })
  async changeTheme(
    @Body() { themeColor },
    @Req() req: IUserReq,
    @TransactionParam() transaction: Transaction
  ): Promise<UserResponseDto> {
    return await this.userService.changeTheme(req.user.id, themeColor, transaction)
  }
}
