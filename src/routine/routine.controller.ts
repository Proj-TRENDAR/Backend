import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Routine } from 'models'
import { JwtAuthGuard } from 'src/auth/authentication/jwt-auth.guard'
import { RoutineService } from 'src/routine/routine.service'
import { IUserReq } from 'src/user/interface/user-req.interface'
import { CreateRoutineDto } from 'src/routine/dto/create-routine-dto'
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
}
