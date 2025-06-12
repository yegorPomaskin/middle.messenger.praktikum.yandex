import Handlebars from 'handlebars';

import EventBus, { EventCallback } from './eventBus';

export interface BlockProps {
  [key: string]: unknown;
  events?: Record<string, EventListenerOrEventListenerObject>;
  attr?: Record<string, string>;
}

interface BlockList extends Array<unknown> {
  __listId?: string;
}

export default abstract class Block<Props extends BlockProps = BlockProps> {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  };

  protected _element: HTMLElement | null = null;

  protected props: Props;

  protected _id: number = this.generateId();

  protected children: Record<string, Block<BlockProps>>;

  protected lists: Record<string, BlockList>;

  protected eventBus: () => EventBus;

  constructor(propsWithChildren: Props) {
    const eventBus = new EventBus();
    // Метод _getChildrenPropsAndProps возвращает объект, содержащий три части: props, children и lists
    const { props, children, lists } = this._getChildrenPropsAndProps(propsWithChildren);

    this.props = this._makePropsProxy({ ...props } as Props);
    this.children = children;
    this.lists = this._makePropsProxy({ ...lists } as unknown as Props) as unknown as Record<
    string,
    BlockList
    >;
    this.eventBus = () => eventBus;

    this._registerEvents(eventBus);
    eventBus.emit(Block.EVENTS.INIT);
  }

  private generateId(): number {
    return Math.floor(100000 + Math.random() * 900000);
  }

  private _addEvents(): void {
    const { events = {} } = this.props;
    Object.keys(events).forEach((eventName) => {
      if (this._element) {
        this._element.addEventListener(eventName, events[eventName] as EventListener);
      }
    });
  }

  private _registerEvents(eventBus: EventBus): void {
    eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
    eventBus.on(Block.EVENTS.FLOW_CDU, ((oldProps: Props, newProps: Props) => {
      this._componentDidUpdate(oldProps, newProps);
    }) as EventCallback);
    eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
  }

  protected init(): void {
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  private _componentDidMount(): void {
    this.componentDidMount();
    Object.values(this.children).forEach((child) => child.dispatchComponentDidMount());
  }

  protected componentDidMount(): void {}

  public dispatchComponentDidMount(): void {
    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  private _componentDidUpdate(oldProps: Props, newProps: Props): void {
    const response = this.componentDidUpdate(oldProps, newProps);
    if (response) {
      this._render();
    }
  }

  protected componentDidUpdate(_oldProps: Props, _newProps: Props): boolean {
    return true;
  }

  private _getChildrenPropsAndProps(propsAndChildren: Props): {
    children: Record<string, Block<BlockProps>>;
    props: Partial<Props>;
    lists: Record<string, BlockList>;
  } {
    const children: Record<string, Block<BlockProps>> = {};
    const props: Partial<Props> = {};
    const lists: Record<string, BlockList> = {};

    Object.entries(propsAndChildren).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value;
      } else if (Array.isArray(value)) {
        lists[key] = value as BlockList;
      } else {
        props[key as keyof Props] = value as Props[keyof Props];
      }
    });

    return { children, props, lists };
  }

  protected setAttributes(attr: Record<string, string>): void {
    if (this.element) {
      Object.entries(attr).forEach(([key, value]) => {
        this._element!.setAttribute(key, value);
      });
    }
  }

  public setProps = (nextProps: Partial<Props>): void => {
    if (!nextProps) {
      return;
    }

    Object.entries(nextProps).forEach(([key, value]) => {
      this.props[key as keyof Props] = value as Props[keyof Props];
    });
  };

  public setList = (nextList: Record<string, BlockList>): void => {
    if (!nextList) {
      return;
    }
    Object.assign(this.lists, nextList);
  };

  get element(): HTMLElement | null {
    return this._element;
  }

  _removeEvents() {
    // Получаем все зарегистрированные события на элементе
    const events = this.props.events;

    if (!events || !this._element) {
      return;
    }

    // Проходим по всем событиям и удаляем обработчики
    Object.keys(events).forEach((eventName) => {
      this._element!.removeEventListener(eventName, events[eventName]);
    });
  }

  private _render(): void {
    this._removeEvents();

    const propsAndStubs = { ...this.props };

    // Создание заглушек для детей-компонентов
    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key as keyof Props] =
        `<div data-id="${child._id}"></div>` as unknown as Props[keyof Props];
    });

    // Создание уникальных заглушек для каждого списка
    Object.entries(this.lists).forEach(([key, childList]) => {
      const listId = `__l_${key}_${this.generateId()}`;
      propsAndStubs[key as keyof Props] =
        `<div data-id="__l_${listId}"></div>` as unknown as Props[keyof Props];
      childList.__listId = listId; // временно запоминаем id заглушки для списка
    });

    // Создание фрагмента с помощью элемента <template>
    const fragment = this._createDocumentElement('template');
    fragment.innerHTML = Handlebars.compile(this.render())(propsAndStubs);

    // Замена заглушек на реальные элементы детей-компонентов
    Object.values(this.children).forEach((child) => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
      if (stub) {
        stub.replaceWith(child.getContent());
      }
    });

    // Замена заглушек на реальные элементы списков
    Object.entries(this.lists).forEach(([, childList]) => {
      const listContent = this._createDocumentElement('template');
      childList.forEach((item) => {
        if (item instanceof Block) {
          listContent.content.append(item.getContent());
        } else {
          listContent.content.append(`${item}`);
        }
      });

      const listId = childList.__listId;
      if (listId) {
        const stub = fragment.content.querySelector(`[data-id="__l_${listId}"]`);
        if (stub) {
          stub.replaceWith(listContent.content);
        }
      }

      delete childList.__listId; // удаляем временное свойство
    });

    // Вставка полученного фрагмента в DOM
    const newElement = fragment.content.firstElementChild as HTMLElement;
    if (this._element && newElement) {
      this._element.replaceWith(newElement);
    }
    this._element = newElement;

    // Добавляем обработчики событий и устанавливаем атрибуты
    this._addEvents();
    this.setAttributes(this.props.attr || {});
  }

  // Абстрактный метод render должен быть реализован в дочерних классах
  protected abstract render(): string;

  public getContent(): HTMLElement {
    if (!this._element) {
      throw new Error('Элемент еще не создан');
    }
    return this._element;
  }

  private _makePropsProxy<T extends object>(props: T): T {
    const self = this;

    return new Proxy(props, {
      get(target: T, prop: string) {
        const value = Reflect.get(target, prop);
        return typeof value === 'function' ? value.bind(target) : value;
      },
      set(target: T, prop: string, value: unknown) {
        const oldTarget = { ...target };
        Reflect.set(target, prop, value);
        self.eventBus().emit(Block.EVENTS.FLOW_CDU, oldTarget, target);
        return true;
      },
      deleteProperty() {
        throw new Error('Нет доступа');
      },
    });
  }

  private _createDocumentElement(tagName: string): HTMLTemplateElement {
    return document.createElement(tagName) as HTMLTemplateElement;
  }

  show(): void {
    const content = this.getContent();
    if (content) {
      content.style.display = 'block';
    }
  }

  hide(): void {
    const content = this.getContent();
    if (content) {
      this.getContent().style.display = 'none';
    }
  }

  destroy(): void {
    // Удаляем обработчики событий
    this._removeEvents();

    // Удаляем элемент из DOM
    if (this._element && this._element.parentNode) {
      this._element.parentNode.removeChild(this._element);
    }

    // Обнуляем ссылку на элемент
    this._element = null;
  }
}
