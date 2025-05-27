import { UpdatePasswordPage } from '../components/profile/updatePassword';
import Block, { BlockProps } from '../framework/block';
import { router } from '../router/Router';
import UserController from '../controllers/UserController';
import AuthController from '../controllers/AuthController';

interface UpdatePasswordPageHandlerProps extends BlockProps {
  [key: string]: unknown;
  updatePasswordPage?: UpdatePasswordPage;
}

export class UpdatePasswordPageHandler extends Block<UpdatePasswordPageHandlerProps> {
  constructor() {
    // Обработчики событий для кнопок
    const handleSidebarClick = (e: Event) => {
      e.preventDefault();
      console.log('Возврат к профилю');
      router.go('/settings');
    };

    const handleSavePassword = async (passwordData: Record<string, string>) => {
      try {
        console.log('🔒 Смена пароля...');

        // Валидация паролей на фронте
        const validationError = validatePasswords(passwordData);
        if (validationError) {
          console.error('❌ Ошибка валидации:', validationError);
          alert(validationError);
          return;
        }

        // Отправляем данные через UserController
        await UserController.updatePassword({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword,
        });

        // UserController сам перенаправит на /settings при успехе

      } catch (error) {
        console.error('💥 Ошибка смены пароля:', error);
        
        // Показываем ошибку пользователю
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        alert(`❌ Ошибка смены пароля: ${errorMessage}`);
      }
    };

    const handleCancel = () => {
      console.log('Отмена изменения пароля');
      router.go('/settings');
    };

    // Создаем экземпляр UpdatePasswordPage
    const currentUser = AuthController.getUserData();
    const updatePasswordPage = new UpdatePasswordPage({
      profileImage: currentUser?.avatar || '/profile-pic.png',
      userName: currentUser?.first_name || 'Иван',
      sidebarData: {
        href: '/settings',
        iconSrc: '/back-arrow.png',
        onClick: handleSidebarClick,
      },
      onSave: handleSavePassword,
      onCancel: handleCancel,
    });

    super({
      updatePasswordPage,
    });
  }

  protected render(): string {
    return `{{{ updatePasswordPage }}}`;
  }
}

// Локальная функция валидации
const validatePasswords = (passwordData: Record<string, string>): string | null => {
  const { oldPassword, newPassword, confirmPassword } = passwordData;

  // Проверяем, что все поля заполнены
  if (!oldPassword || !newPassword || !confirmPassword) {
    console.error('Ошибка: Все поля должны быть заполнены');
     return 'Все поля должны быть заполнены';
  }

  // Проверяем, что новый пароль и подтверждение совпадают
  if (newPassword !== confirmPassword) {
    console.error('Ошибка: Новый пароль и подтверждение не совпадают');
    return 'Новый пароль и подтверждение не совпадают';
  }

  // Проверяем, что новый пароль отличается от старого
  if (oldPassword === newPassword) {
    console.error('Ошибка: Новый пароль должен отличаться от старого');
    return 'Новый пароль должен отличаться от старого';
  }

  return null;
};
