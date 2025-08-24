export interface EmployeeProps {
  tenantId: string;
  userId?: string;
  cpf: string;
  fullName: string;
  email?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date | null;
}

export class EmployeeEntity {
  private _id: string | undefined;
  private _props: EmployeeProps;

  constructor(props: EmployeeProps, id?: string) {
    this._id = id;
    this._props = {
      ...props,
      createdAt: props.createdAt || new Date(),
    };
  }

  public get id(): string | undefined {
    return this._id;
  }

  public set id(value: string | undefined) {
    this._id = value;
  }

  public get tenantId(): string {
    return this._props.tenantId;
  }

  public get userId(): string | undefined {
    return this._props.userId;
  }

  public get cpf(): string {
    return this._props.cpf;
  }

  public set cpf(value: string) {
    this._props.cpf = value;
  }

  public get fullName(): string {
    return this._props.fullName;
  }

  public set fullName(value: string) {
    this._props.fullName = value;
  }

  public get email(): string | undefined {
    return this._props.email;
  }

  public set email(value: string | undefined) {
    this._props.email = value;
  }

  public get phone(): string | undefined {
    return this._props.phone;
  }

  public set phone(value: string | undefined) {
    this._props.phone = value;
  }

  public get createdAt(): Date | undefined {
    return this._props.createdAt;
  }

  public get updatedAt(): Date | null | undefined {
    return this._props.updatedAt;
  }

  public set updatedAt(value: Date | undefined) {
    this._props.updatedAt = value;
  }
}
