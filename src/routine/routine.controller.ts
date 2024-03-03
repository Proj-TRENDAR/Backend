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
import { ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import { Routine, RoutineCompleted } from 'models'
import { JwtAuthGuard } from 'src/auth/authentication/jwt-auth.guard'
import { RoutineService } from 'src/routine/routine.service'
import { IUserReq } from 'src/user/interface/user-req.interface'
import { CreateRoutineDto } from 'src/routine/dto/create-routine-dto'
import { CreateRoutineCompletedDto } from 'src/routine/dto/create-routine-completed-dto'
import { TransactionInterceptor } from 'src/share/transaction/interceptor'

@Controller('routine')
@ApiTags('Routine API')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getRoutine(@Req() req: IUserReq): Promise<Routine[]> {
    return this.routineService.getAllRoutine(req.user.id)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post()
  @UsePipes(ValidationPipe)
  createRoutine(@Body() createRoutineDto: CreateRoutineDto, @Req() req: IUserReq): Promise<Routine> {
    createRoutineDto.userId = req.user.id
    return this.routineService.createRoutine(createRoutineDto)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post('/completed')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: '수행한 루틴 생성', description: '특정 날짜에서 수행한 루틴 생성(체크) API' })
  @ApiCreatedResponse({
    description: '성공 시(example)',
    schema: {
      example: {
        routinecompIdx: 2,
        routineIdx: 1,
        completedAt: '2024-03-03T01:12:00.000Z',
      },
    },
  })
  createRoutineCompleted(@Body() createRoutineCompleted: CreateRoutineCompletedDto): Promise<RoutineCompleted> {
    return this.routineService.createRoutineCompleted(createRoutineCompleted)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Delete('/completed')
  @ApiOperation({ summary: '수행한 루틴 삭제', description: '특정 날짜에서 수행한 루틴 삭제(체크 해제) API' })
  @ApiBody({
    schema: {
      example: {
        routinecompIdx: 1,
      },
    },
    description: '수행한 루틴 인덱스',
    required: true,
    type: Number,
  })
  @ApiOkResponse({ description: '수행한 루틴 삭제 완료' })
  deleteRoutineCompleted(@Body('routinecompIdx') routinecompIdx: number) {
    return this.routineService.deleteRoutineCompleted(routinecompIdx)
  }
}
