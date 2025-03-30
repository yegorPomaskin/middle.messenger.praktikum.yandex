import Block from "../../framework/block";
import template from "./modal.hbs?raw";
import styles from "./modal.module.css";

interface ModalProps {
    title: string;
    isOpen?: boolean;
    contentBlock?: Block;
    onClose?: () => void;
}

export class Modal extends Block {
    constructor(props: ModalProps) {
        super({
            ...props,
            styles,
            isOpen: props.isOpen || false,
            events: {
                click: (e: Event) => {
                    const target = e.target as HTMLElement;
                    
                    // Закрыть модальное окно при клике на overlay
                    if (target.classList.contains(styles.modalOverlay)) {
                        this.close();
                    }
                }
            }
        });
    }
    
    open(): void {
        console.log('Modal.open() вызван');
        
        // Показываем модальное окно
        this.setProps({
            isOpen: true
        });
        
        // Применяем стили к модальному окну напрямую, чтобы гарантировать его видимость
        const modalElement = this.getContent();
        const overlayElement = modalElement.querySelector(`.${styles.modalOverlay}`);
        const modalWindowElement = modalElement.querySelector(`.${styles.modal}`);
        
        if (overlayElement instanceof HTMLElement) {
            overlayElement.style.display = 'block';
            console.log('Overlay display установлен в block');
        }
        
        if (modalWindowElement instanceof HTMLElement) {
            modalWindowElement.style.display = 'flex';
            console.log('Modal window display установлен в flex');
        }
        
        // Добавляем класс для блокировки прокрутки body
        document.body.classList.add('modal-open');
        
        console.log('Modal.open() завершен, isOpen:', this.props.isOpen);
    }
    
    close(): void {
        console.log('Modal.close() вызван');
        
        this.setProps({
            isOpen: false
        });
        
        // Скрываем модальное окно
        const modalElement = this.getContent();
        const overlayElement = modalElement.querySelector(`.${styles.modalOverlay}`);
        const modalWindowElement = modalElement.querySelector(`.${styles.modal}`);
        
        if (overlayElement instanceof HTMLElement) {
            overlayElement.style.display = 'none';
        }
        
        if (modalWindowElement instanceof HTMLElement) {
            modalWindowElement.style.display = 'none';
        }
        
        // Удаляем класс для разблокировки прокрутки body
        document.body.classList.remove('modal-open');
        
        if (this.props.onClose) {
            this.props.onClose();
        }
        
        console.log('Modal.close() завершен, isOpen:', this.props.isOpen);
    }
    
    setContent(content: Block): void {
        this.setProps({
            contentBlock: content
        });
    }
    
    protected render(): string {
        return template;
    }
}