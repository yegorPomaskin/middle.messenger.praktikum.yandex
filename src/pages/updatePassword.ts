import Block from "../framework/block";
import { UpdatePasswordPage } from "../components/profile/updatePassword";
// import { renderProfilePage } from "../pages/profile";

export class UpdatePasswordPageHandler extends Block {
  private updatePasswordPage: UpdatePasswordPage;

  constructor() {
    // Обработчики событий для кнопок
    const handleSavePassword = (passwordData: Record<string, string>) => {
      console.log('Сохранение нового пароля:', passwordData);

      // Валидация паролей
      if (!this.validatePasswords(passwordData)) {
        return; // Прерываем, если валидация не прошла
      }

      // Здесь будет логика отправки данных на сервер
      // Например: UserController.changePassword(passwordData).then(...)

      // После успешного сохранения пароля возвращаемся на страницу профиля
      // renderProfilePage();
    };

    const handleCancel = () => {
      console.log('Отмена изменения пароля');
      // Возвращаемся на страницу профиля без сохранения
      // renderProfilePage();
    };

    // Создаем экземпляр UpdatePasswordPage
    const updatePasswordPage = new UpdatePasswordPage({
      profileImage: "/profile-pic.png",
      userName: "Иван",
      sidebarData: {
        href: "#",
        iconSrc: "/back-arrow.png",
        // onClick: () => renderProfilePage(),
      },
      onSave: handleSavePassword,
      onCancel: handleCancel
    });

    super({
      updatePasswordPage
    });

    this.updatePasswordPage = updatePasswordPage;
  }

  // Метод для валидации полей пароля
  private validatePasswords(passwordData: Record<string, string>): boolean {
    // Проверяем, что все поля заполнены
    if (!passwordData.oldPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      console.error('Все поля должны быть заполнены');
      return false;
    }

    // Проверяем, что новый пароль и подтверждение совпадают
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      console.error('Новый пароль и подтверждение не совпадают');
      return false;
    }

    // Проверяем, что новый пароль отличается от старого
    if (passwordData.oldPassword === passwordData.newPassword) {
      console.error('Новый пароль должен отличаться от старого');
      return false;
    }

    // Проверяем сложность пароля (например, минимум 8 символов)
    if (passwordData.newPassword.length < 8) {
      console.error('Новый пароль должен содержать минимум 8 символов');
      return false;
    }

    return true;
  }

  protected render(): string {
    return `
            {{{ updatePasswordPage }}}
        `;
  }
}