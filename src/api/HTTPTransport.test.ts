import HTTPTransport from './HTTPTransport';

class MockXMLHttpRequest {
  static UNSENT = 0;

  static OPENED = 1;

  static HEADERS_RECEIVED = 2;

  static LOADING = 3;

  static DONE = 4;

  open = jest.fn();

  setRequestHeader = jest.fn();

  send = jest.fn();

  withCredentials = false;

  timeout = 0;

  readyState = MockXMLHttpRequest.DONE;

  response = '';

  responseText = '';

  responseType = '';

  status = 200;

  statusText = 'OK';

  onload: ((this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => void) | null = null;

  onerror: ((this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => void) | null = null;

  onabort: ((this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => void) | null = null;

  ontimeout: ((this: XMLHttpRequest, ev: ProgressEvent<EventTarget>) => void) | null = null;
}

describe('HTTPTransport', () => {
  let http: HTTPTransport;
  let xhr: MockXMLHttpRequest;

  beforeEach(() => {
    http = new HTTPTransport();
    xhr = new MockXMLHttpRequest();
    global.XMLHttpRequest = jest.fn(() => xhr) as unknown as typeof XMLHttpRequest;
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('get() вызывает open с query строкой и send()', async () => {
    const url = '/test';
    const data = { a: 1, b: 'value' };

    const promise = http.get(url, { data });
    xhr.onload?.call(xhr as unknown as XMLHttpRequest, new ProgressEvent('load'));

    await expect(promise).resolves.toBe(xhr as unknown as XMLHttpRequest);
    expect(xhr.open).toHaveBeenCalledWith('GET', '/test?a=1&b=value');
    expect(xhr.send).toHaveBeenCalled();
  });

  test('post() сериализует тело и вызывает send', async () => {
    const url = '/submit';
    const body = { foo: 'bar' };

    const promise = http.post(url, {
      data: body,
      headers: { 'Content-Type': 'application/json' },
    });
    xhr.onload?.call(xhr as unknown as XMLHttpRequest, new ProgressEvent('load'));

    await expect(promise).resolves.toBe(xhr as unknown as XMLHttpRequest);
    expect(xhr.setRequestHeader).toHaveBeenCalledWith('Content-Type', 'application/json');
    expect(xhr.send).toHaveBeenCalledWith(JSON.stringify(body));
  });

  test('request() отклоняется при onerror', async () => {
    const promise = http.get('/fail');
    xhr.onerror?.call(xhr as unknown as XMLHttpRequest, new ProgressEvent('error'));

    await expect(promise).rejects.toThrow('Network error');
  });

  test('request() отклоняется при ontimeout', async () => {
    const promise = http.get('/timeout');
    xhr.ontimeout?.call(xhr as unknown as XMLHttpRequest, new ProgressEvent('timeout'));

    await expect(promise).rejects.toThrow('Request timed out');
  });
});
