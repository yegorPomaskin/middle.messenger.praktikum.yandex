export abstract class BaseAPI {
  // На случай, если нет метода
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