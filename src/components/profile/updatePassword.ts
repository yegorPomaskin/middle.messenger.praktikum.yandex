import Block from '../../framework/block';
import { Button } from '../button/button';
import buttonStyles from '../button/button.module.css';
import styles from '../profile/profile.module.css';
import commonStyles from '../profileField/commonProfileStyles.module.css';
import { ProfileField } from '../profileField/profileField';
import { Sidebar } from '../sidebar/sidebar';

import template from './profile.hbs?raw';

interface UpdatePasswordPageProps {
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
  };
}

export class UpdatePasswordPage extends Block {
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
      },
    });
  }

  protected render(): string {
    return template;
  }
}
