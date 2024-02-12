import { Controller, Get, Req, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Routine } from 'models'
import { JwtAuthGuard } from 'src/auth/authentication/jwt-auth.guard'
import { RoutineService } from 'src/routine/routine.service'

@Controller('routine')
@ApiTags('Routine API')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  // @UseGuards(JwtAuthGuard)
  // @Get()
  // getRoutine(@Req() req): Promise<Routine> {
  //   return
  // }
}
