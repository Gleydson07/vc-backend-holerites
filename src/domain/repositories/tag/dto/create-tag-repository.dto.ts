export enum TagScopeEnum {
  STAFF = 'staff',
  EMPLOYEE = 'employee',
  PAYSLIP = 'payslip',
}

export class CreateTagRepositoryDto {
  title: string;
  textColor: string;
  bgColor: string;
  scope: TagScopeEnum;
}

export class ResponseCreateTagRepositoryDto {
  id: string;
  title: string;
  bgColor: string;
  scope: TagScopeEnum;
}
