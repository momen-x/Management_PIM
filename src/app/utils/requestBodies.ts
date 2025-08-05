export interface ICreateNewAcount {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface IEditAcountInfo {
  name?: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}
// export interface IEditPasswordAcount {
//   oldPassword: string;
//   newPassword: string;
//   confirmNewPassword: string;
// }

export interface IAddNewProducts {
  title: string;
  price: number;
  ads?: number;
  tax?: number;
  discount?: number;
  total: number;
  categorie?: string;
}
export interface IEditProductInfo {
  title?: string;
  price?: number;
  ads?: number;
  tax?: number;
  discount?: number;
  total?: number;
  categorie?: string;
}
