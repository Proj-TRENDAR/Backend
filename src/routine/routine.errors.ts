import { NotFoundException } from '@nestjs/common'

export const ROUTINE_ERRORS = {
  NOT_FOUND: 'ROUTINE_NOT_FOUND',
}

const DEFAULT_ROUTINE_NOT_FOUND_MESSAGE = '존재하지 않는 루틴입니다.'

export class RoutineNotFoundException extends NotFoundException {
  constructor(message: string = DEFAULT_ROUTINE_NOT_FOUND_MESSAGE) {
    super(message, ROUTINE_ERRORS.NOT_FOUND)
  }
}
