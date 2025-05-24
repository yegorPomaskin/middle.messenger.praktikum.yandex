export abstract class BaseAPI {
  // На случай, если забудете переопределить метод и используете его — выстрелит ошибка
  create(..._args: any[]): Promise<any> {
    throw new Error('Not implemented');
  }

  request(..._args: any[]): Promise<any> {
    throw new Error('Not implemented');
  }

  update(..._args: any[]): Promise<any> {
    throw new Error('Not implemented');
  }

  delete(..._args: any[]): Promise<any> {
    throw new Error('Not implemented');
  }
}