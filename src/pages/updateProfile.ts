import { UpdateProfilePage } from '../components/profile/updateProfilePage';
import Block, { BlockProps } from '../framework/block';
import { router } from '../router/Router';

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
    const handleSaveProfile = (formData: Record<string, string>) => {
      console.log('Сохранение данных профиля:', formData);
      
      // Здесь будет логика отправки данных на сервер
      // Например: UserController.updateProfile(formData).then(...)
      
      // После успешного сохранения возвращаемся к просмотру профиля
      router.go('/settings');
    };

    const handleCancel = () => {
      console.log('Отмена редактирования профиля');
      router.go('/settings');
    };
    
    const updateProfilePage = new UpdateProfilePage({
      profileImage: '/profile-pic.png',
      userName: 'Иван', 
      userFields: [
        { name: 'email', label: 'Почта', value: 'test@mail.com' },
        { name: 'login', label: 'Логин', value: 'ivanivanov' },
        { name: 'first_name', label: 'Имя', value: 'Иван' },
        { name: 'second_name', label: 'Фамилия', value: 'Иванов' },
        { name: 'display_name', label: 'Имя в чате', value: 'Иван' },
        { name: 'phone', label: 'Телефон', value: '+7 (909) 967 30 30' },
      ],
      sidebarData: {
        href: '/messenger',
        iconSrc: '/back-arrow.png',
        onClick: handleSidebarClick,
      },
      onSave: handleSaveProfile,
      onCancel: handleCancel,
    });

    super({
      updateProfilePage,
    });
  }

  protected render(): string {
    return `{{{ updateProfilePage }}}`;
  }
}
