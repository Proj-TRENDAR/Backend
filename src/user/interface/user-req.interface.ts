import { Request } from 'express'

export interface IUserReq extends Request {
  user: {
    id: string
  }
}
