export abstract class BaseAPI {
  // На случай, если нет метода
  create(..._args: unknown[]): Promise<unknown> {
    throw new Error('Not implemented');
  }

  request(..._args: unknown[]): Promise<unknown> {
    throw new Error('Not implemented');
  }

  update(..._args: unknown[]): Promise<unknown> {
    throw new Error('Not implemented');
  }

  delete(..._args: unknown[]): Promise<unknown> {
    throw new Error('Not implemented');
  }
}
