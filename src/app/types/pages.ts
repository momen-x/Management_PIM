export interface IPage {
  path: string;
  name: string;
  icon?: React.ReactNode;
}

export interface JwtPayload {
   id: number,
  name: string,
  email: string,
  isAdmin: boolean,
}