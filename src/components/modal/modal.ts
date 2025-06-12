import Block, { BlockProps } from '../../framework/block';

import template from './modal.hbs?raw';
import styles from './modal.module.css';

interface ModalProps extends BlockProps {
  [key: string]: unknown;
  title: string;
  isOpen?: boolean;
  contentBlock?: Block;
  onClose?: () => void;
  styles?: Record<string, string>;
  events?: Record<string, EventListenerOrEventListenerObject>;
}

export class Modal extends Block<ModalProps> {
  // Add a private property to store the onClose callback
  private _onCloseCallback?: () => void;

  constructor(props: ModalProps) {
    // Save the onClose callback before calling super
    const onClose = props.onClose;

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
        },
      },
    });

    // Initialize the callback after calling super
    this._onCloseCallback = onClose;
  }

  open(): void {
    console.log('Modal.open() вызван');

    this.setProps({
      isOpen: true,
    });

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

    document.body.classList.add('modal-open');

    console.log('Modal.open() завершен, isOpen:', this.props.isOpen);
  }

  close(): void {
    console.log('Modal.close() вызван');

    this.setProps({
      isOpen: false,
    });

    const modalElement = this.getContent();
    const overlayElement = modalElement.querySelector(`.${styles.modalOverlay}`);
    const modalWindowElement = modalElement.querySelector(`.${styles.modal}`);

    if (overlayElement instanceof HTMLElement) {
      overlayElement.style.display = 'none';
    }

    if (modalWindowElement instanceof HTMLElement) {
      modalWindowElement.style.display = 'none';
    }

    document.body.classList.remove('modal-open');

    // Use the stored callback instead of this.props.onClose
    if (this._onCloseCallback) {
      this._onCloseCallback();
    }

    console.log('Modal.close() завершен, isOpen:', this.props.isOpen);
  }

  setContent(content: Block): void {
    this.setProps({
      contentBlock: content,
    });
  }

  protected render(): string {
    return template;
  }
}
