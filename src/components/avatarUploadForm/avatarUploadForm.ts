import Block, { BlockProps } from '../../framework/block';
import { Button } from '../button/button';
import buttonStyles from '../button/button.module.css';

import template from './avatarUploadForm.hbs?raw';
import styles from './avatarUploadForm.module.css';

interface AvatarUploadFormProps extends BlockProps {
  [key: string]: unknown;
  onSubmit?: (file: File) => void;
  submitButton?: Button;
  styles?: Record<string, string>;
}

export class AvatarUploadForm extends Block<AvatarUploadFormProps> {
  private fileInputRef: HTMLInputElement | null = null;

  private selectedFile: File | null = null;

  private _onSubmitCallback?: (file: File) => void;

  constructor(props: AvatarUploadFormProps) {
    const submitButton = new Button({
      text: 'Поменять',
      type: 'submit',
      className: `${buttonStyles.button} ${buttonStyles['button--modal']}`,
      events: {
        click: (e: Event) => {
          e.preventDefault();
          console.log('Кнопка Поменять нажата');
          this.handleSubmit();
        },
      },
    });

    const onSubmit = props.onSubmit;

    super({
      submitButton,
      styles,
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.id === 'selectFileBtn' || target.closest('#selectFileBtn')) {
            e.preventDefault();
            console.log('Кнопка выбора файла нажата');

            // Проверяем, что this.element точно есть
            if (this.element) {
              this.fileInputRef = this.element.querySelector(
                '#avatarFileInput',
              ) as HTMLInputElement | null;
              if (this.fileInputRef) {
                this.fileInputRef.click();
              } else {
                console.error('fileInputRef не инициализирован даже после повторного поиска!');
              }
            } else {
              console.error('this.element не определён!');
            }
          }
        },
        change: (e: Event) => {
          const target = e.target as HTMLInputElement;
          if (target.id === 'avatarFileInput') {
            this.handleFileChange(e);
          }
        },
      },
    });

    this._onSubmitCallback = onSubmit;
  }

  protected componentDidMount(): void {
    console.log('AvatarUploadForm смонтирован');

    if (this.element) {
      this.fileInputRef = this.element.querySelector('#avatarFileInput');

      if (this.fileInputRef) {
        console.log('fileInputRef найден и инициализирован');
      } else {
        console.error('fileInputRef не найден в DOM');
      }
    } else {
      console.error('this.element не определен');
    }
  }

  private handleFileChange(event: Event): void {
    console.log('handleFileChange вызван');

    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      console.log('Выбран файл:', file.name);
      this.selectedFile = file;
    } else {
      console.log('Файл не выбран');
    }
  }

  private handleSubmit(): void {
    console.log('handleSubmit вызван, selectedFile:', this.selectedFile);

    if (!this.selectedFile) {
      console.error('Файл не выбран');
      return;
    }

    if (this._onSubmitCallback) {
      console.log('Вызов onSubmit с файлом:', this.selectedFile.name);
      this._onSubmitCallback(this.selectedFile);

      // Сбрасываем значение поля выбора файла
      if (this.fileInputRef) {
        this.fileInputRef.value = '';
        this.selectedFile = null;
      }
    } else {
      console.error('onSubmit не определен');
    }
  }

  protected render(): string {
    console.log('AvatarUploadForm render вызван');
    return template;
  }
}
