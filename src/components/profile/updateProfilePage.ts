import Block, { BlockProps } from '../../framework/block';
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

interface UpdateProfilePageProps extends BlockProps {
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
    onClick?: EventListener;
  };
  onSave?: (formData: Record<string, string>) => void;
  onCancel?: () => void;
  onAvatarUpload?: (file: File) => Promise<string>;
}

export class UpdateProfilePage extends Block<UpdateProfilePageProps> {
  private avatarModal: Modal | null = null;

  constructor(props: UpdateProfilePageProps) {
    const sidebar = new Sidebar({
      href: props.sidebarData.href,
      iconSrc: props.sidebarData.iconSrc,
      onClick: props.sidebarData.onClick,
    });

    const fields = (props.userFields || []).map((field) => {
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
        required: field.name !== 'display_name',
      });
    });

    const saveButton = new Button({
      text: 'Сохранить',
      type: 'submit',
      className: buttonStyles['button--save'],
      events: {
        click: (e: Event) => {
          e.preventDefault();
          if (!props.onSave) return;

          let isFormValid = true;
          const formData: Record<string, string> = {};

          if (this.lists && this.lists.fields) {
            this.lists.fields.forEach((field) => {
              if (field instanceof ProfileField) {
                const fieldName = field.getName();
                const fieldValue = field.getValue();
                isFormValid = isFormValid && field.validate();
                formData[fieldName] = fieldValue;
              }
            });
          }

          if (isFormValid) {
            props.onSave(formData);
          }
        },
      },
    });

    const cancelButton = new Button({
      text: 'Отмена',
      type: 'button',
      className: buttonStyles['button--cancel'],
      events: {
        click: (e: Event) => {
          e.preventDefault();
          props.onCancel?.();
        },
      },
    });

    super({
      ...props,
      sidebar,
      fields,
      buttons: [saveButton, cancelButton],
      styles,
      commonStyles,
      isEditMode: true,
      events: {
        submit: (e: Event) => {
          e.preventDefault();
        },
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          const imageContainer = target.closest('#changeAvatarBtn');
          if (imageContainer) {
            e.preventDefault();
            this.openAvatarModal();
          }
        },
      },
    });
  }

  protected componentDidMount(): void {
    this.createAvatarModal();
  }

  private createAvatarModal(): void {
    const avatarUploadForm = new AvatarUploadForm({
      onSubmit: async (file: File) => {
        const onAvatarUpload = this.props.onAvatarUpload;
        if (!onAvatarUpload) return;

        try {
          const newAvatarUrl = await onAvatarUpload(file);
          this.setProps({ profileImage: newAvatarUrl });
          this.avatarModal?.close();
        } catch {
          // Ошибку можно обработать глобально, либо через Store
        }
      },
    });

    this.avatarModal = new Modal({
      title: 'Загрузите файл',
      isOpen: false,
      contentBlock: avatarUploadForm,
    });

    document.body.appendChild(this.avatarModal.getContent());
  }

  private openAvatarModal(): void {
    if (!this.avatarModal) {
      this.createAvatarModal();
    }

    if (this.avatarModal && !document.body.contains(this.avatarModal.getContent())) {
      document.body.appendChild(this.avatarModal.getContent());
    }

    this.avatarModal?.open();
  }

  public validateAllFields(): boolean {
    if (!this.lists || !this.lists.fields) return true;
    let isValid = true;
    this.lists.fields.forEach((field) => {
      if (field instanceof ProfileField) {
        isValid = isValid && field.validate();
      }
    });
    return isValid;
  }

  protected render(): string {
    return template;
  }
}
