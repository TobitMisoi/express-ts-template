export interface CreateUserDto {
  email: string;
  firstName: string;
  lastName: string;
  permission: number;
  password: string;
  identifier: string;
  identifierType: string;
}
