import Block from '../../framework/block';
import {
  LOGIN_VALIDATION,
  EMAIL_VALIDATION,
  PHONE_VALIDATION,
  NAME_VALIDATION,
} from '../../utils/validationRules';
import { ValidationRule } from '../../utils/validator';
import { AvatarUploadForm } from '../avatarUploadForm/avatarUploadForm';
import { Button } from '../button/button';
import buttonStyles from '../button/button.module.css';
import { Modal } from '../modal/modal';
import template from '../profile/profile.hbs?raw';
import styles from '../profile/profile.module.css';
import commonStyles from '../profileField/commonProfileStyles.module.css';
import { ProfileField } from '../profileField/profileField';
import { Sidebar } from '../sidebar/sidebar';

interface UpdateProfilePageProps {
  profileImage: string;
  userName: string;
  userFields: Array<{
    name: string;
    label: string;
    value: string;
    type?: string;
    editable?: boolean;
  }>;
  sidebarData: {
    href: string;
    iconSrc: string;
    onClick?: (event: Event) => void;
  };
  onSave?: (formData: Record<string, string>) => void;
  onCancel?: () => void;
  onAvatarUpload?: (file: File) => Promise<string>;
}

export class UpdateProfilePage extends Block {
  private avatarModal: Modal | null = null;

  constructor(props: UpdateProfilePageProps) {
    // Create sidebar component
    const sidebar = new Sidebar({
      href: props.sidebarData.href,
      iconSrc: props.sidebarData.iconSrc,
      onClick: props.sidebarData.onClick,
    });

    // Create components for profile fields
    const fields = (props.userFields || []).map((field) => {
      // Определяем правила валидации для каждого поля
      let validationRules: ValidationRule[] = [];
      switch (field.name) {
        case 'login':
          validationRules = LOGIN_VALIDATION;
          break;
        case 'email':
          validationRules = EMAIL_VALIDATION;
          break;
        case 'phone':
          validationRules = PHONE_VALIDATION;
          break;
        case 'first_name':
        case 'second_name':
        case 'display_name':
          validationRules = NAME_VALIDATION;
          break;
      }

      return new ProfileField({
        name: field.name,
        label: field.label,
        value: field.value,
        type: field.type || 'text',
        mode: 'edit',
        editable: field.editable !== false,
        validationRules,
        required: field.name !== 'display_name', // Все поля обязательны, кроме display_name
        events: {
          focus: (e: FocusEvent) => {
            console.log(`${e} Field ${field.name} focused`);
          },
          blur: (e: FocusEvent) => {
            console.log(`${e} Field ${field.name} blurred, running validation`);
            // Валидация происходит внутри ProfileField в обработчике blur
          },
          change: (e: Event) => {
            const input = e.target as HTMLInputElement;
            console.log(`Field ${field.name} changed to: ${input.value}`);
          },
        },
      });
    });

    // Create save button with the correct class name
    const saveButton = new Button({
      text: 'Сохранить',
      type: 'submit',
      className: buttonStyles['button--save'],
      events: {
        click: (e: Event) => {
          e.preventDefault();
          console.log('Save button clicked');

          if (props.onSave) {
            // Валидация всех полей
            let isFormValid = true;
            const formData: Record<string, string> = {};

            if (this.lists && this.lists.fields) {
              console.log(`Validating ${this.lists.fields.length} fields`);

              this.lists.fields.forEach((field) => {
                if (field instanceof ProfileField) {
                  // Получаем имя и значение поля через методы компонента
                  const fieldName = field.getName();
                  const fieldValue = field.getValue();

                  // Запускаем валидацию
                  console.log(`Validating field ${fieldName} with value "${fieldValue}"`);
                  const isFieldValid = field.validate();
                  console.log(
                    `Field ${fieldName} validation: ${isFieldValid ? 'passed' : 'failed'}`,
                  );

                  // Обновляем статус валидности формы
                  isFormValid = isFormValid && isFieldValid;

                  // Собираем данные формы
                  formData[fieldName] = fieldValue;
                } else {
                  console.warn('Field is not an instance of ProfileField', field);
                }
              });
            }

            // Вызываем обработчик сохранения только если все поля валидны
            if (isFormValid) {
              console.log('Form is valid, saving data:', formData);
              props.onSave(formData);
            } else {
              console.log('Form contains errors, not saving');
            }
          }
        },
      },
    });

    // Create cancel button with a custom style
    const cancelButton = new Button({
      text: 'Отмена',
      type: 'button',
      className: buttonStyles['button--cancel'],
      events: {
        click: (e: Event) => {
          e.preventDefault();
          console.log('Cancel button clicked');

          if (props.onCancel) {
            props.onCancel();
          }
        },
      },
    });

    // Create buttons array for the template
    const buttons = [saveButton, cancelButton];

    super({
      ...props,
      sidebar,
      fields,
      buttons,
      styles,
      commonStyles,
      isEditMode: true,
      events: {
        submit: (e: Event) => {
          e.preventDefault();
          console.log('Form submitted');
        },
        click: (e: Event) => {
          const target = e.target as HTMLElement;

          // Проверяем клик на контейнер изображения или его потомков
          const imageContainer = target.closest('#changeAvatarBtn');
          if (imageContainer) {
            e.preventDefault();
            console.log('Avatar change button clicked');
            this.openAvatarModal();
          }
        },
      },
    });
  }

  protected componentDidMount(): void {
    // Создаем модальное окно для смены аватара
    this.createAvatarModal();
  }

  private createAvatarModal(): void {
    // Создаем форму загрузки аватара
    const avatarUploadForm = new AvatarUploadForm({
      onSubmit: async (file: File) => {
        // Type assertion для обработчика загрузки аватара
        const onAvatarUpload = this.props.onAvatarUpload as ((file: File) => Promise<string>) | undefined;

        if (onAvatarUpload) {
          try {
            console.log('Загрузка нового аватара:', file.name);

            // Вызываем обработчик загрузки аватара и получаем URL нового аватара
            const newAvatarUrl = await onAvatarUpload(file);

            // Обновляем URL аватара на странице
            this.setProps({
              profileImage: newAvatarUrl,
            });

            // Закрываем модальное окно
            if (this.avatarModal) {
              this.avatarModal.close();
            }
          } catch (error) {
            console.error('Ошибка при загрузке аватара:', error);
          }
        }
      },
    });

    // Создаем модальное окно
    this.avatarModal = new Modal({
      title: 'Загрузите файл',
      isOpen: false,
      contentBlock: avatarUploadForm,
    });

    // Сразу добавляем модальное окно в DOM
    document.body.appendChild(this.avatarModal.getContent());
  }

  private openAvatarModal(): void {
    console.log('Открытие модального окна аватара');

    if (!this.avatarModal) {
      console.error('Модальное окно не инициализировано');
      this.createAvatarModal();
    }

    if (this.avatarModal) {
      // Проверяем, добавлено ли модальное окно в DOM
      if (!document.body.contains(this.avatarModal.getContent())) {
        console.log('Модальное окно не найдено в DOM, добавляем');
        document.body.appendChild(this.avatarModal.getContent());
      }

      // Открываем модальное окно
      this.avatarModal.open();
      console.log('Модальное окно открыто');
    }
  }

  // Метод для принудительной валидации всех полей формы
  public validateAllFields(): boolean {
    if (!this.lists || !this.lists.fields) {
      return true;
    }

    let isValid = true;

    this.lists.fields.forEach((field) => {
      if (field instanceof ProfileField) {
        const fieldValid = field.validate();
        isValid = isValid && fieldValid;
      }
    });

    return isValid;
  }

  protected render(): string {
    return template;
  }
}
