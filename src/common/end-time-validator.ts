import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator'
/*
 * 종료날짜가 현재 날짜보다 이른 경우 validation 처리 하려다가
 * 사용자가 이전 data를 입력하고 싶을 수 있다 생각하여 주석처리함
 * 추후 필요 없다면 now 삭제
 * */

function getDatesFromArgs(args: ValidationArguments): { start: Date; end: Date; now: Date } {
  const { object, value } = args
  const startTime = (object as any).startTime

  return {
    start: new Date(startTime),
    end: new Date(value),
    now: new Date(),
  }
}

@ValidatorConstraint({ async: false })
export class IsEndTimeValidConstraint implements ValidatorConstraintInterface {
  validate(endTime: string, args: ValidationArguments) {
    const { start, end, now } = getDatesFromArgs(args)

    if (end <= start) {
      return false // 종료 시간이 시작 시간보다 이전 또는 같음
    }

    // if (end <= now) {
    //   return false // 종료 시간이 현재 시간보다 이전 또는 같음
    // }

    return true
  }

  defaultMessage(args: ValidationArguments) {
    const { start, end, now } = getDatesFromArgs(args)

    if (end <= start) {
      return 'End time must be later than start time.'
    }

    // if (end <= now) {
    //   return 'End time must be later than the current time.'
    // }

    return 'End time is invalid.'
  }
}

export function IsEndTimeValid(validationOptions?: ValidationOptions) {
  return function (object: NonNullable<unknown>, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEndTimeValidConstraint,
    })
  }
}
