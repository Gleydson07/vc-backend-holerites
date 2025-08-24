export interface UserProps {
  tenantId: string;
  username: string;
  passwordHash: string;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date | null;
}

export class UserEntity {
  private _id: string | undefined;
  private _props: UserProps;

  constructor(props: UserProps, id?: string) {
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

  public set tenantId(value: string) {
    this._props.tenantId = value;
  }

  public get username(): string {
    return this._props.username;
  }

  public set username(value: string) {
    this._props.username = value;
  }

  public get passwordHash(): string {
    return this._props.passwordHash;
  }

  public set passwordHash(value: string) {
    this._props.passwordHash = value;
  }

  public get isActive(): boolean {
    return this._props.isActive;
  }

  public set isActive(value: boolean) {
    this._props.isActive = value;
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
