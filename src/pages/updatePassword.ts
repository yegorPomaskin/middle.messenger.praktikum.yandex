import { UpdatePasswordPage } from '../components/profile/updatePassword';
import Block from '../framework/block';


export class UpdatePasswordPageHandler extends Block {
  constructor() {
    // Обработчики событий для кнопок
    const handleSavePassword = (passwordData: Record<string, string>) => {
      console.log('Сохранение нового пароля:', passwordData);

      // Проверяем, что строки не пустые
      if (!this.validatePasswords(passwordData)) {
        return;
      }

      // Здесь будет логика отправки данных на сервер
      // Например: UserController.changePassword(passwordData).then(...)
    };

    const handleCancel = () => {
      console.log('Отмена изменения пароля');
      // Возвращаемся на страницу профиля без сохранения
    };

    // Создаем экземпляр UpdatePasswordPage
    const updatePasswordPage = new UpdatePasswordPage({
      profileImage: '/profile-pic.png',
      userName: 'Иван',
      sidebarData: {
        href: '#',
        iconSrc: '/back-arrow.png',
      },
      onSave: handleSavePassword,
      onCancel: handleCancel,
    });

    super({
      updatePasswordPage,
    });
  }

  // Простая валидация - проверяем, что строки не пустые
  private validatePasswords(passwordData: Record<string, string>): boolean {
    const { oldPassword, newPassword, confirmPassword } = passwordData;

    return Boolean(oldPassword && newPassword && confirmPassword);
  }

  protected render(): string {
    return `{{{ updatePasswordPage }}}`;
  }
}
