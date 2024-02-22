import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Routine } from 'models'
import { JwtAuthGuard } from 'src/auth/authentication/jwt-auth.guard'
import { RoutineService } from 'src/routine/routine.service'
import { IUserReq } from 'src/user/interface/user-req.interface'

@Controller('routine')
@ApiTags('Routine API')
export class RoutineController {
  constructor(private readonly routineService: RoutineService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  getRoutine(@Req() req: IUserReq): Promise<Routine[]> {
    return this.routineService.getRoutine(req.user.id)
  }
}
