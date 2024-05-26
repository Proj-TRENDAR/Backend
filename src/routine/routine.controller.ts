import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger'
import { Transaction } from 'sequelize'
import { RoutineCompleted } from 'models'
import { JwtAuthGuard } from 'src/auth/authentication/jwt-auth.guard'
import { RoutineService } from 'src/routine/routine.service'
import { IUserReq } from 'src/user/interface/user-req.interface'
import { CreateRoutineDto } from 'src/routine/dto/create-routine.dto'
import { RoutineResponseDto } from 'src/routine/dto/routine-response.dto'
import { CreateRoutineCompletedDto } from 'src/routine/dto/create-routine-completed.dto'
import { TransactionInterceptor } from 'src/share/transaction/interceptor'
import { TransactionParam } from 'src/share/transaction/param'
import { RoutineCompletedResponseDto } from './dto/routine-completed-response.dto'
import { RoutineCompletedService } from './routine-completed/routine-completed.service'

@Controller('routine')
@ApiTags('Routine API')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '전체 루틴 조회', description: '전체 루틴 조회 API' })
  @ApiOkResponse({
    type: RoutineResponseDto,
    description: '전체 루틴 조회 성공',
    schema: {
      $ref: getSchemaPath(RoutineResponseDto),
    },
  })
  getRoutine(@Req() req: IUserReq, @TransactionParam() transaction: Transaction): Promise<RoutineResponseDto[]> {
    return this.routineService.getAllRoutine(req.user.id, transaction)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '루틴 생성', description: '루틴 생성 API' })
  @ApiCreatedResponse({
    type: RoutineResponseDto,
    description: '루틴 생성 성공',
    schema: {
      $ref: getSchemaPath(RoutineResponseDto),
    },
  })
  @UsePipes(ValidationPipe)
  createRoutine(
    @Body() createRoutineDto: CreateRoutineDto,
    @Req() req: IUserReq,
    @TransactionParam() transaction: Transaction
  ): Promise<RoutineResponseDto> {
    createRoutineDto.userId = req.user.id
    return this.routineService.createRoutine(createRoutineDto, transaction)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post('/completed')
  @ApiBearerAuth()
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: '수행한 루틴 등록', description: '(특정 날짜에서 수행한 루틴 체크시) 수행한 루틴 등록 API' })
  @ApiCreatedResponse({
    type: RoutineCompletedResponseDto,
    description: '수행한 루틴 등록 성공',
    schema: {
      $ref: getSchemaPath(RoutineCompletedResponseDto),
    },
  })
  async createRoutineCompleted(
    @Body() createRoutineCompleted: CreateRoutineCompletedDto,
    @TransactionParam() transaction: Transaction
  ): Promise<RoutineCompletedResponseDto> {
    return await this.routineCompletedService.createRoutineCompleted(createRoutineCompleted, transaction)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Delete('/completed')
  @ApiBearerAuth()
  @ApiOperation({ summary: '수행한 루틴 삭제', description: '특정 날짜에서 수행한 루틴 삭제(체크 해제) API' })
  @ApiBody({
    schema: {
      example: {
        idx: 1,
      },
    },
    description: '수행한 루틴 인덱스',
    required: true,
    type: Number,
  })
  @ApiOkResponse({ description: '수행한 루틴 삭제 완료' })
  @ApiNotFoundResponse({ description: '수행한 루틴 삭제 실패' })
  deleteRoutineCompleted(@Body('idx') idx: number) {
    return this.routineService.deleteRoutineCompleted(idx)
  }
}
