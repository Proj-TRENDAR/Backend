import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger'
import { Transaction } from 'sequelize'
import { JwtAuthGuard } from 'src/auth/authentication/jwt-auth.guard'
import { RoutineService } from 'src/routine/routine.service'
import { RoutineCompletedService } from 'src/routine/routine-completed/routine-completed.service'
import { IUserReq } from 'src/user/interface/user-req.interface'
import { CreateRoutineDto } from 'src/routine/dto/create-routine.dto'
import { UpdateRoutineDto } from 'src/routine/dto/update-routine.dto'
import { RoutineResponseDto } from 'src/routine/dto/routine-response.dto'
import { CreateRoutineCompletedDto } from 'src/routine/dto/create-routine-completed.dto'
import { RoutineCompletedResponseDto } from 'src/routine/dto/routine-completed-response.dto'
import { TransactionInterceptor } from 'src/share/transaction/interceptor'
import { TransactionParam } from 'src/share/transaction/param'

@Controller('routine')
@ApiTags('Routine API')
@ApiBearerAuth('accessToken')
@ApiUnauthorizedResponse({ description: '인증 실패' })
export class RoutineController {
  constructor(
    private readonly routineService: RoutineService,
    private readonly routineCompletedService: RoutineCompletedService
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: '전체 루틴 조회', description: '전체 루틴 조회 API' })
  @ApiOkResponse({
    type: RoutineResponseDto,
    description: '전체 루틴 조회 성공',
    schema: {
      $ref: getSchemaPath(RoutineResponseDto),
    },
  })
  async getRoutine(@Req() req: IUserReq, @TransactionParam() transaction: Transaction): Promise<RoutineResponseDto[]> {
    return await this.routineService.getAllRoutine(req.user.id, transaction)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post()
  @ApiOperation({ summary: '루틴 생성', description: '루틴 생성 API' })
  @ApiCreatedResponse({
    type: RoutineResponseDto,
    description: '루틴 생성 성공',
    schema: {
      $ref: getSchemaPath(RoutineResponseDto),
    },
  })
  @UsePipes(ValidationPipe)
  async createRoutine(
    @Body() createRoutineDto: CreateRoutineDto,
    @Req() req: IUserReq,
    @TransactionParam() transaction: Transaction
  ): Promise<RoutineResponseDto> {
    createRoutineDto.userId = req.user.id
    return await this.routineService.createRoutine(createRoutineDto, transaction)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Put(':idx')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: '루틴 수정', description: '루틴 수정 API' })
  @ApiOkResponse({ description: '루틴 수정 성공' })
  @ApiNotFoundResponse({ description: '존재하지 않는 루틴' })
  async updateRoutine(
    @Param('idx') idx: number,
    @Body() updateRoutineDto: UpdateRoutineDto,
    @TransactionParam() transaction: Transaction
  ): Promise<RoutineResponseDto> {
    return await this.routineService.updateRoutine(idx, updateRoutineDto, transaction)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Put('restore/:idx')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: '루틴 중단 해제', description: '루틴 중단 해제 API(restore)' })
  @ApiOkResponse({ description: '루틴 중단 해제 성공' })
  @ApiNotFoundResponse({ description: '존재하지 않는 루틴' })
  async restoreRoutine(@Param('idx') idx: number, @TransactionParam() transaction: Transaction): Promise<void> {
    await this.routineService.restoreRoutine(idx, transaction)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Delete('soft/:idx')
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: '루틴 중단', description: '루틴 중단 API(sort delete)' })
  @ApiNoContentResponse({ description: '루틴 중단 성공' })
  @ApiNotFoundResponse({ description: '존재하지 않는 루틴' })
  async softDeleteRoutine(@Param('idx') idx: number, @TransactionParam() transaction: Transaction): Promise<void> {
    await this.routineService.softDeleteRoutine(idx, transaction)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Delete('hard/:idx')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ValidationPipe)
  @ApiOperation({ summary: '루틴 삭제', description: '루틴 삭제 API(hard delete)' })
  @ApiNoContentResponse({ description: '루틴 삭제 완료' })
  @ApiNotFoundResponse({ description: '루틴 삭제 실패' })
  async hardDeleteRoutine(@Param('idx') idx: number, @TransactionParam() transaction: Transaction): Promise<void> {
    await this.routineService.hardDeleteRoutine(idx, transaction)
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(TransactionInterceptor)
  @Post('/completed')
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
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(ValidationPipe)
  @ApiOperation({
    summary: '수행한 루틴 삭제',
    description: '(특정 날짜에서 수행한 루틴 체크 해제시) 수행한 루틴 삭제 API',
  })
  @ApiNoContentResponse({ description: '수행한 루틴 삭제 완료' })
  @ApiNotFoundResponse({ description: '수행한 루틴 삭제 실패' })
  async deleteRoutineCompleted(@Body('idx') idx: number, @TransactionParam() transaction: Transaction): Promise<void> {
    const result = await this.routineCompletedService.deleteRoutineCompleted(idx, transaction)
    if (!result) {
      throw new NotFoundException('Routine completed not found.')
    }
  }
}
