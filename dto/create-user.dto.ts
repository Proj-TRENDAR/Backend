import { IsNotEmpty } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  id: string
  @IsNotEmpty()
  name: string
  @IsNotEmpty()
  email: string
  imgUrl: string
}
