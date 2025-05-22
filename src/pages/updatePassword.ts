import { UpdatePasswordPage } from '../components/profile/updatePassword';
import Block, { BlockProps } from '../framework/block';
import { router } from '../router/Router';

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

    const handleSavePassword = (passwordData: Record<string, string>) => {
      console.log('Сохранение нового пароля:', passwordData);

      if (!validatePasswords(passwordData)) {
        return;
      }

      console.log('Пароль успешно изменен');
      // Здесь будет логика отправки на сервер
      // UserController.changePassword(passwordData).then(...)
      router.go('/settings');
    };

    const handleCancel = () => {
      console.log('Отмена изменения пароля');
      router.go('/settings');
    };

    // Создаем экземпляр UpdatePasswordPage
    const updatePasswordPage = new UpdatePasswordPage({
      profileImage: '/profile-pic.png',
      userName: 'Иван',
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
const validatePasswords = (passwordData: Record<string, string>): boolean => {
  const { oldPassword, newPassword, confirmPassword } = passwordData;

  // Проверяем, что все поля заполнены
  if (!oldPassword || !newPassword || !confirmPassword) {
    console.error('Ошибка: Все поля должны быть заполнены');
    return false;
  }

  // Проверяем, что новый пароль и подтверждение совпадают
  if (newPassword !== confirmPassword) {
    console.error('Ошибка: Новый пароль и подтверждение не совпадают');
    return false;
  }

  // Проверяем, что новый пароль отличается от старого
  if (oldPassword === newPassword) {
    console.error('Ошибка: Новый пароль должен отличаться от старого');
    return false;
  }

  return true;
};
