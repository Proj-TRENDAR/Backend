import { NotFoundException } from '@nestjs/common'

export const TODO_ERRORS = {
  NOT_FOUND: 'TODO_NOT_FOUND',
}

const DEFAULT_ROUTINE_NOT_FOUND_MESSAGE = '존재하지 않는 할 일입니다.'

export class TodoNotFoundException extends NotFoundException {
  constructor(message: string = DEFAULT_ROUTINE_NOT_FOUND_MESSAGE) {
    super(message, TODO_ERRORS.NOT_FOUND)
  }
}
