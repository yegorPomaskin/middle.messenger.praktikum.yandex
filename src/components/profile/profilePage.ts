import Block from '../../framework/block';
import { AvatarUploadForm } from '../avatarUploadForm/avatarUploadForm';
import { Link } from '../link/link';
import { Modal } from '../modal/modal';
import commonStyles from '../profileField/commonProfileStyles.module.css';
import { ProfileField } from '../profileField/profileField';
import { Sidebar } from '../sidebar/sidebar';

import template from './profile.hbs?raw';
import styles from './profile.module.css';

interface ProfilePageProps {
  profileImage: string;
  userName: string;
  userFields: Array<{
    name: string;
    label: string;
    value: string;
    type?: string;
    editable?: boolean;
  }>;
  buttons: Array<{
    text: string;
    className: string;
    href: string;
    useDefaultClass?: boolean;
    onClick?: (event: Event) => void;
  }>;
  sidebarData: {
    href: string;
    iconSrc: string;
    onClick?: (event: Event) => void;
  };
  isEditMode?: boolean;
  onAvatarUpload?: (file: File) => Promise<string>;
}

export class ProfilePage extends Block {
  private avatarModal: Modal | null = null;

  constructor(props: ProfilePageProps) {
    // Создаем сайдбар
    const sidebar = new Sidebar({
      href: props.sidebarData.href,
      iconSrc: props.sidebarData.iconSrc,
      onClick: props.sidebarData.onClick,
    });

    // Создаем компоненты для полей профиля
    const fields = (props.userFields || []).map(
      (field) =>
        new ProfileField({
          name: field.name,
          label: field.label,
          value: field.value,
          type: field.type,
          mode: props.isEditMode ? 'edit' : 'view',
          editable: field.editable,
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
        })
    );

    // Создаем компоненты для кнопок действий
    const buttons = (props.buttons || []).map(
      (button) =>
        new Link({
          href: button.href,
          text: button.text,
          className: button.className,
          useDefaultClass: button.useDefaultClass ?? false,
          attr: {
            'data-action': button.text.toLowerCase().replace(/\s+/g, ''),
          },
          events: {
            click: (e: Event) => {
              e.preventDefault();
              console.log(`Button "${button.text}" clicked`);

              if (button.onClick) {
                button.onClick(e);
              }
            },
          },
        })
    );

    super({
      ...props,
      sidebar,
      fields,
      buttons,
      styles,
      commonStyles,
      isEditMode: props.isEditMode || false,
      events: {
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

  public setEditMode(isEdit: boolean): void {
    this.setProps({ isEditMode: isEdit });

    // Обновляем режим для всех полей
    if (this.lists && this.lists.fields) {
      this.lists.fields.forEach((field) => {
        if (field instanceof ProfileField) {
          field.setProps({ mode: isEdit ? 'edit' : 'view' });
        }
      });
    }
  }

  protected render(): string {
    return template;
  }
}
