import EventBus, { EventCallback } from './eventBus';
import Handlebars from 'handlebars';

interface BlockProps {
    [key: string]: any;
}

export default class Block {
    static EVENTS = {
        INIT: "init",
        FLOW_CDM: "flow:component-did-mount",
        FLOW_CDU: "flow:component-did-update",
        FLOW_RENDER: "flow:render"
    };

    protected _element: HTMLElement | null = null;
    protected props: BlockProps;
    protected _id: number = this.generateId();
    protected children: Record<string, Block>;
    protected lists: Record<string, any[]>;
    protected eventBus: () => EventBus;

    constructor(propsWithChildren: BlockProps = {}) {
        const eventBus = new EventBus();
        // Метод _getChildrenPropsAndProps возвращает объект, содержащий три части: props, children и lists
        const { props, children, lists } = this._getChildrenPropsAndProps(propsWithChildren);

        this.props = this._makePropsProxy({ ...props });
        this.children = children;
        this.lists = this._makePropsProxy({ ...lists });
        this.eventBus = () => eventBus;

        this._registerEvents(eventBus);
        eventBus.emit(Block.EVENTS.INIT);
    }

    private generateId(): number { 
        return Math.floor(100000 + Math.random() * 900000);
    }

    private _addEvents(): void {
        const { events = {} } = this.props
        Object.keys(events).forEach(eventName => {
            if (this._element) {
                this._element.addEventListener(eventName, events[eventName])
            }
        })
    }

    private _registerEvents(eventBus: EventBus): void {
        eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this)),
        eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    }

    protected init(): void {
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER)
    }

    private _componentDidMount(): void {
        this.componentDidMount();
        Object.values(this.children).forEach(child => child.dispatchComponentDidMount());
    }

    protected componentDidMount(): void {}

    public dispatchComponentDidMount():void {
        this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    }

    private _componentDidUpdate(oldProps: BlockProps, newProps: BlockProps): void {
        const response = this.componentDidUpdate(oldProps, newProps);
        if (response) {
            this._render()
        }
    }

    protected componentDidUpdate(oldProps: BlockProps, newProps: BlockProps): boolean {
        return true;
    }

    private _getChildrenPropsAndProps(propsAndChildren: BlockProps): {
        children: Record<string, Block>,
        props: BlockProps,
        lists: Record<string, any[]>
    } {
        const children: Record<string, Block> = {};
        const props: BlockProps = {};
        const lists: Record<string, any[]> = {};

        Object.entries(propsAndChildren).forEach(([key, value]) => {
            if (value instanceof Block) {
                children[key] = value
            } else if (Array.isArray(value)) {
                lists[key] = value
            } else {
                props[key] = value
            }
        })
        console.log({ children, props, lists })

        return { children, props, lists }
    }

    protected setAttributes(attr: Record<string, string>): void {
        if (this.element) {
            Object.entries(attr).forEach(([key, value]) => {
                this._element!.setAttribute(key, value);
            });
        }

    }

    public setProps = (nextProps: BlockProps): void => { // Улучшена реактивность - чего 
        if (!nextProps) {
            return;
        }

        Object.entries(nextProps).forEach(([key, value]) => {
            this.props[key] = value;
        });
    };

    public setList = (nextList: Record<string, any[]>): void => {
        if (!nextList) {
            return
        }
        Object.assign(this.lists, nextList);
    }

    get element(): HTMLElement | null {
        return this._element;
    }

    private _render(): void {
        console.log("Block _render called");
        const propsAndStubs = { ...this.props }

        // Создание заглушек для детей-компонентов
        Object.entries(this.children).forEach(([key, child]) => {
            propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
        });

        // Создание уникальных заглушек для каждого списка
        Object.entries(this.lists).forEach(([key, childList]) => {
            const listId = `__l_${key}_${this.generateId()}`;
            propsAndStubs[key] = `<div data-id="__l_${listId}"></div>`;
            (childList as any).__listId = listId; // временно запоминаем id заглушки для списка
        })

        // Создание фрагмента с помощью элемента <template>
        const fragment = this._createDocumentElement('template');
        fragment.innerHTML = Handlebars.compile(this.render())(propsAndStubs);

        // Замена заглушек на реальные элементы детей-компонентов
        Object.values(this.children).forEach(child => {
            const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
            if (stub) {
                stub.replaceWith(child.getContent());
            }
        });

        // Замена заглушек на реальные элементы списков
        Object.entries(this.lists).forEach(([, childList]) => {
            const listContent = this._createDocumentElement('template');
            childList.forEach(item => {
                if (item instanceof Block) {
                    listContent.content.append(item.getContent());
                } else {
                    listContent.content.append(`${item}`);
                }
            });
            const stub = fragment.content.querySelector(`[data-id="__l_${(childList as any).__listId}"]`);
            if (stub) {
                stub.replaceWith(listContent.content);
            }

            delete (childList as any).__listId; // удаляем временное свойство
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

    // Может переопределять пользователь, необязательно трогать
    protected render(): string {
        return ''
    }

    public getContent(): HTMLElement {
        if (!this._element) {
            throw new Error('Элемент еще не создан')
        }
        return this._element
    }

    private _makePropsProxy(props: any): any {
        
        const self = this;

        return new Proxy(props, {
            get(target: any, prop: string) {
                const value = target[prop]
                return typeof value === "function" ? value.bind(target) : value
            },
            set(target: any, prop: string, value: any) {
                const oldTarget = { ...target }
                target[prop] = value
                self.eventBus().emit(Block.EVENTS.FLOW_CDU, oldTarget, target)
                return true
            },
            deleteProperty() {
                throw new Error("Нет доступа")
            }
        })
    }

    private _createDocumentElement(tagName: string): HTMLTemplateElement {
        return document.createElement(tagName) as HTMLTemplateElement;
    }

    show() {
        const content = this.getContent()
        if (content) {
            content.style.display = "block"
        }
    }

    hide() {
        const content = this.getContent()
        if (content) {
            this.getContent().style.display = "none"
        } 
    }
}