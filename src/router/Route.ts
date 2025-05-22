import Block, { BlockProps } from '../framework/block';

function isEqual(lhs: string, rhs: string): boolean {
  return lhs === rhs;
}

function render(query: string, block: Block): HTMLElement | null {
  const root = document.querySelector(query) as HTMLElement | null;
  if (root) {
    // Очищаем содержимое корневого элемента
    root.innerHTML = '';
    // Добавляем контент блока
    const content = block.getContent();
    if (content) {
      root.appendChild(content);
      // Вызываем componentDidMount для инициализации компонента
      block.dispatchComponentDidMount();
    }
  }
  return root;
}

export interface RouteProps {
  rootQuery: string;
}

export default class Route {
  private _pathname: string;
  private _blockClass: new () => Block<BlockProps>;
  private _block: Block<BlockProps> | null = null;
  private _props: RouteProps;

  constructor(pathname: string, view: new () => Block<BlockProps>, props: RouteProps) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
  }

  navigate(pathname: string): void {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave(): void {
    if (this._block) {
      this._block.hide();
    }
  }

  match(pathname: string): boolean {
    return isEqual(pathname, this._pathname);
  }

  render(): void {
    if (!this._block) {
      this._block = new this._blockClass();
      render(this._props.rootQuery, this._block);
      return;
    }

    this._block.show();
  }
}