import Block, { BlockProps } from '../framework/block';

function isEqual(lhs: string, rhs: string): boolean {
  return lhs === rhs;
}

function render(query: string, block: Block): HTMLElement | null {
  const root = document.querySelector(query) as HTMLElement | null;

  if (!root) {
    console.error(`Root element not found: ${query}`);
    return null;
  }

  // Очищаем содержимое корневого элемента
  root.innerHTML = '';

  // Убеждаемся, что элемент полностью очищен
  while (root.firstChild) {
    root.removeChild(root.firstChild);
  }

  // Добавляем контент блока
  const content = block.getContent();
  if (content) {
    root.appendChild(content);
    // Вызываем componentDidMount для инициализации компонента
    block.dispatchComponentDidMount();
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
      // Полностью удаляем блок из DOM вместо скрытия
      if (typeof this._block.destroy === 'function') {
        this._block.destroy();
      } else {
        // Fallback если destroy не существует
        this._block.hide();
      }
      this._block = null;
    }
  }

  match(pathname: string): boolean {
    return isEqual(pathname, this._pathname);
  }

  render(): void {
    if (!this._block) {
      try {
        this._block = new this._blockClass();
      } catch (error) {
        console.error('Error creating block instance:', error);
        return;
      }

      render(this._props.rootQuery, this._block);
      return;
    }

    this._block.show();
  }
}
