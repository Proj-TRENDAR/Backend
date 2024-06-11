import { NotFoundException } from '@nestjs/common'

export const EVENT_ERRORS = {
  NOT_FOUND: 'EVENT_NOT_FOUND',
}

const DEFAULT_EVENT_NOT_FOUND_MESSAGE = '존재하지 않는 루틴입니다.'

export class EventNotFoundException extends NotFoundException {
  constructor(message: string = DEFAULT_EVENT_NOT_FOUND_MESSAGE) {
    super(message, EVENT_ERRORS.NOT_FOUND)
  }
}
