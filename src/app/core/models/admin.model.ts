export interface IApiAdminAuthRes {
  status: number
  message: string
  // data: IAdminRes | null
  accessToken: string
  refreshToken: string
}
