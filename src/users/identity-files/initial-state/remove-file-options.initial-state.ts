import { RemoveFileOptionsType } from '../types';

export class RemoveFileOptionsInitialState implements RemoveFileOptionsType {
  public readonly unlinkFile: boolean = true;
}
