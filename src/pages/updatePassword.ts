import { UpdatePasswordPage } from '../components/profile/updatePassword';
import AuthController from '../controllers/AuthController';
import UserController from '../controllers/UserController';
import Block, { BlockProps } from '../framework/block';
import { router } from '../router/Router';

interface PasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface UpdatePasswordPageHandlerProps extends BlockProps {
  updatePasswordPage?: UpdatePasswordPage;
}

const validatePasswords = (data: PasswordData): string | null => {
  const { oldPassword, newPassword, confirmPassword } = data;
  if (!oldPassword || !newPassword || !confirmPassword) {
    return 'Все поля должны быть заполнены';
  }
  if (newPassword !== confirmPassword) {
    return 'Новый пароль и подтверждение не совпадают';
  }
  if (oldPassword === newPassword) {
    return 'Новый пароль должен отличаться от старого';
  }
  return null;
};

export class UpdatePasswordPageHandler extends Block<UpdatePasswordPageHandlerProps> {
  constructor() {
    // Переход назад
    const handleSidebarClick = (e: Event) => {
      e.preventDefault();
      router.go('/settings');
    };

    const handleSavePassword = async (passwordData: PasswordData) => {
      const validationError = validatePasswords(passwordData);
      if (validationError) {
        alert(validationError);
        return;
      }
      try {
        await UserController.updatePassword({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        });
        // UserController сам перенаправит на /settings
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        alert(`Ошибка смены пароля: ${errorMessage}`);
      }
    };

    // Отмена
    const handleCancel = () => {
      router.go('/settings');
    };

    const currentUser = AuthController.getUserData();
    const updatePasswordPage = new UpdatePasswordPage({
      profileImage: currentUser?.avatar || '/profile-pic.png',
      userName: currentUser?.first_name || 'Иван',
      sidebarData: {
        href: '/settings',
        iconSrc: '/back-arrow.png',
        onClick: handleSidebarClick,
      },
      onSave: (data) =>
        handleSavePassword({
          oldPassword: data.oldPassword ?? '',
          newPassword: data.newPassword ?? '',
          confirmPassword: data.confirmPassword ?? '',
        }),
      onCancel: handleCancel,
    });

    super({ updatePasswordPage });
  }

  protected render(): string {
    return `{{{ updatePasswordPage }}}`;
  }
}
