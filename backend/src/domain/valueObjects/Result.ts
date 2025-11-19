export class Result<T = void> {

  constructor(public ok: boolean,
             public value?: T,
             public error?: string) {}


  static success<T = void>(value?: T) { return new Result<T>(true, value); }

  static failure<T = void>(error: string) { return new Result<T>(false, undefined, error); }
  
}
