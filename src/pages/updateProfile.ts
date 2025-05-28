import { UpdateProfilePage } from '../components/profile/updateProfilePage';
import Block, { BlockProps } from '../framework/block';
import { router } from '../router/Router';
import UserController from '../controllers/UserController';
import AuthController from '../controllers/AuthController';

interface UpdateProfilePageHandlerProps extends BlockProps {
  [key: string]: unknown;
  updateProfilePage?: UpdateProfilePage;
}

export class UpdateProfilePageHandler extends Block<UpdateProfilePageHandlerProps> {
  constructor() {
    const handleSidebarClick = (e: Event) => {
      e.preventDefault();
      console.log('Возврат к чатам');
      router.go('/messenger');
    };

    // Обработчик сохранения профиля
    const handleSaveProfile = async (formData: Record<string, string>) => {
      try {
        console.log('💾 Сохранение данных профиля:', formData);

        // Отправляем данные через UserController
        await UserController.updateProfile({
          first_name: formData.first_name,
          second_name: formData.second_name,
          display_name: formData.display_name,
          login: formData.login,
          email: formData.email,
          phone: formData.phone,
        });
      } catch (error) {
        console.error('Ошибка сохранения профиля:', error);
        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        alert(`Ошибка сохранения: ${errorMessage}`);
      }
    };

    const handleCancel = () => {
      console.log('Отмена редактирования профиля');
      router.go('/settings');
    };

    const getCurrentUserData = () => {
      const currentUser = AuthController.getUserData();

      if (currentUser) {
        return [
          { name: 'email', label: 'Почта', value: currentUser.email },
          { name: 'login', label: 'Логин', value: currentUser.login },
          { name: 'first_name', label: 'Имя', value: currentUser.first_name },
          { name: 'second_name', label: 'Фамилия', value: currentUser.second_name },
          { name: 'display_name', label: 'Имя в чате', value: currentUser.display_name || '' },
          { name: 'phone', label: 'Телефон', value: currentUser.phone },
        ];
      }

      // Fallback данные, если пользователь не загружен
      return [
        { name: 'email', label: 'Почта', value: 'test@mail.com' },
        { name: 'login', label: 'Логин', value: 'ivanivanov' },
        { name: 'first_name', label: 'Имя', value: 'Иван' },
        { name: 'second_name', label: 'Фамилия', value: 'Иванов' },
        { name: 'display_name', label: 'Имя в чате', value: 'Иван' },
        { name: 'phone', label: 'Телефон', value: '+7 (909) 967 30 30' },
      ];
    };

    const handleAvatarUpload = async (file: File): Promise<string> => {
      try {
        console.log('📷 Загрузка аватара:', file.name);

        const newAvatarUrl = await UserController.updateAvatar(file);

        console.log('✅ Аватар загружен:', newAvatarUrl);

        return newAvatarUrl;
      } catch (error) {
        console.error('💥 Ошибка загрузки аватара:', error);

        const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
        alert(`❌ Ошибка загрузки аватара: ${errorMessage}`);

        throw error;
      }
    };

    const currentUser = AuthController.getUserData();

    const updateProfilePage = new UpdateProfilePage({
      profileImage: currentUser?.avatar || '/profile-pic.png',
      userName: currentUser?.first_name || 'Пользователь',
      userFields: getCurrentUserData(),
      sidebarData: {
        href: '/messenger',
        iconSrc: '/back-arrow.png',
        onClick: handleSidebarClick,
      },
      onSave: handleSaveProfile,
      onCancel: handleCancel,
      onAvatarUpload: handleAvatarUpload,
    });

    super({
      updateProfilePage,
    });
  }

  protected render(): string {
    return `{{{ updateProfilePage }}}`;
  }
}
