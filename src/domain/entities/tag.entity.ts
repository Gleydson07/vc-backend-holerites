import { TagScopeEnum } from '../repositories/tag/dto/create-tag-repository.dto';

export interface TagProps {
  tenantId: string;
  title: string;
  scope: TagScopeEnum;
  textColor: string;
  bgColor: string;
  createdAt?: Date;
  updatedAt?: Date | null;
}

export class TagEntity {
  private _id: string | undefined;
  private _props: TagProps;

  constructor(props: TagProps, id?: string) {
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

  public get title(): string {
    return this._props.title;
  }

  public set title(value: string) {
    this._props.title = value;
  }

  public get scope(): TagScopeEnum {
    return this._props.scope;
  }

  public set scope(value: TagScopeEnum) {
    this._props.scope = value;
  }

  public get bgColor(): string {
    return this._props.bgColor;
  }

  public set bgColor(value: string) {
    this._props.bgColor = value;
  }

  public get textColor(): string {
    return this._props.textColor;
  }

  public set textColor(value: string) {
    this._props.textColor = value;
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
