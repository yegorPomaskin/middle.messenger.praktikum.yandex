import Block from '../../framework/block';
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
    const fields = (props.userFields || []).map(
      (field) =>
        new ProfileField({
          name: field.name,
          label: field.label,
          value: field.value,
          type: field.type || 'text',
          mode: 'edit',
          editable: field.editable !== undefined ? field.editable : true,
          events: {
            focus: (e: FocusEvent) => {
              console.log(`Field ${field.name} focused`, e);
            },
            blur: (e: FocusEvent) => {
              console.log(`Field ${field.name} blurred`, e);
            },
            change: (e: Event) => {
              const input = e.target as HTMLInputElement;
              console.log(`Field ${field.name} changed to: ${input.value}`);
            },
          },
        }),
    );

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
            const formData: Record<string, string> = {};

            // Collect form data from fields
            if (this.lists && this.lists.fields) {
              this.lists.fields.forEach((field) => {
                if (field.element) {
                  const input = field.element.querySelector('input');
                  if (input) {
                    formData[input.name] = input.value;
                  }
                }
              });
            }

            props.onSave(formData);
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
        if (this.props.onAvatarUpload) {
          try {
            console.log('Загрузка нового аватара:', file.name);

            // Вызываем обработчик загрузки аватара и получаем URL нового аватара
            const newAvatarUrl = await this.props.onAvatarUpload(file);

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

  protected render(): string {
    return template;
  }
}
