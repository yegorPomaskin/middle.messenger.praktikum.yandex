import Block, { BlockProps } from '../../framework/block';
import { AvatarUploadForm } from '../avatarUploadForm/avatarUploadForm';
import { Button } from '../button/button';
import buttonStyles from '../button/button.module.css';
import { Modal } from '../modal/modal';
import styles from '../profile/profile.module.css';
import commonStyles from '../profileField/commonProfileStyles.module.css';
import { ProfileField } from '../profileField/profileField';
import { Sidebar } from '../sidebar/sidebar';

import template from './profile.hbs?raw';

interface UpdatePasswordPageProps extends BlockProps {
  [key: string]: unknown;
  profileImage: string;
  userName: string;
  sidebarData: {
    href: string;
    iconSrc: string;
    onClick?: (event: Event) => void;
  };
  onSave?: (passwordData: Record<string, string>) => void;
  onCancel?: () => void;
  events?: {
    focus?: EventListener;
    blur?: EventListener;
    change?: EventListener;
    submit?: EventListener;
    click?: EventListener;
  };
  sidebar?: Sidebar;
  fields?: ProfileField[];
  buttons?: Button[];
  styles?: Record<string, string>;
  commonStyles?: Record<string, string>;
  isEditMode?: boolean;
  onAvatarUpload?: (file: File) => Promise<string>;
}

export class UpdatePasswordPage extends Block<UpdatePasswordPageProps> {
  private avatarModal: Modal | null = null;

  constructor(props: UpdatePasswordPageProps) {
    // Create sidebar component
    const sidebar = new Sidebar({
      href: props.sidebarData.href,
      iconSrc: props.sidebarData.iconSrc,
      onClick: props.sidebarData.onClick,
    });

    // Create password fields
    const fields = [
      new ProfileField({
        name: 'oldPassword',
        label: 'Старый пароль',
        value: '',
        type: 'password',
        mode: 'edit',
        editable: true,
        events: {
          focus: ((e: Event) => {
            console.log('Field oldPassword focused', e);
          }) as EventListener,
          blur: ((e: Event) => {
            console.log('Field oldPassword blurred', e);
          }) as EventListener,
          change: ((e: Event) => {
            const input = e.target as HTMLInputElement;
            console.log(`Field oldPassword changed to: ${input.value}`);
          }) as EventListener,
        },
      }),
      new ProfileField({
        name: 'newPassword',
        label: 'Новый пароль',
        value: '•••••••••••',
        type: 'password',
        mode: 'edit',
        editable: true,
        events: {
          focus: ((e: Event) => {
            console.log('Field newPassword focused', e);
          }) as EventListener,
          blur: ((e: Event) => {
            console.log('Field newPassword blurred', e);
          }) as EventListener,
          change: ((e: Event) => {
            const input = e.target as HTMLInputElement;
            console.log(`Field newPassword changed to: ${input.value}`);
          }) as EventListener,
        },
      }),
      new ProfileField({
        name: 'confirmPassword',
        label: 'Повторите новый пароль',
        value: '•••••••••••',
        type: 'password',
        mode: 'edit',
        editable: true,
        events: {
          focus: ((e: Event) => {
            console.log('Field confirmPassword focused', e);
          }) as EventListener,
          blur: ((e: Event) => {
            console.log('Field confirmPassword blurred', e);
          }) as EventListener,
          change: ((e: Event) => {
            const input = e.target as HTMLInputElement;
            console.log(`Field confirmPassword changed to: ${input.value}`);
          }) as EventListener,
        },
      }),
    ];

    // Create save button
    const saveButton = new Button({
      text: 'Сохранить',
      type: 'submit',
      className: buttonStyles['button--save'],
      events: {
        click: (e: Event) => {
          e.preventDefault();
          console.log('Save password button clicked');

          if (props.onSave) {
            const passwordData: Record<string, string> = {};

            // Collect password data from fields
            if (this.lists && this.lists.fields) {
              this.lists.fields.forEach((field) => {
                if (field instanceof ProfileField) {
                  const input = field.element?.querySelector('input');
                  if (input) {
                    passwordData[input.name] = input.value;
                  }
                }
              });
            }

            // Проверка, что новый пароль и подтверждение совпадают
            if (passwordData.newPassword !== passwordData.confirmPassword) {
              console.error('Пароли не совпадают');
              // Здесь можно добавить логику для отображения ошибки пользователю
              return;
            }

            props.onSave(passwordData);
          }
        },
      },
    });

    // Create cancel button
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
          console.log('Password form submitted');
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
        const onAvatarUpload = this.props.onAvatarUpload as
          | ((file: File) => Promise<string>)
          | undefined;

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

  protected render(): string {
    return template;
  }
}
