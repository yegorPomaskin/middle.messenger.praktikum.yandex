import linkStyles from '../components/link/link.module.css';
import { ProfilePage } from '../components/profile/profilePage';
import Block, { BlockProps } from '../framework/block';
import { router } from '../router/Router';

interface ProfilePageHandlerProps extends BlockProps {
  [key: string]: unknown;
  profilePage?: ProfilePage;
}

export class ProfilePageHandler extends Block<ProfilePageHandlerProps> {
  constructor() {

    const handleEditData = (e: Event) => {
      e.preventDefault();
      console.log('Переход на страницу редактирования данных');
      router.go('/settings/edit-profile');
    };

    const handleChangePassword = (e: Event) => {
      e.preventDefault();
      console.log('Переход на страницу изменения пароля');
      router.go('/settings/change-password');
    };

    const handleLogout = (e: Event) => {
      e.preventDefault();
      console.log('Выход из профиля');
      // Логика выхода из профиля
      // Например: AuthController.logout().then(() => router.go('/'));
      router.go('/');
    };

    const handleSidebarClick = (e: Event) => {
      e.preventDefault();
      console.log('Возврат к чатам');
      router.go('/messenger');
    };

    // Создаем экземпляр ProfilePage с настроенными обработчиками событий
    const profilePage = new ProfilePage({
      profileImage: '/profile-pic.png',
      userName: 'Иван',
      userFields: [
        { name: 'email', label: 'Почта', value: 'test@mail.com', editable: true },
        { name: 'login', label: 'Логин', value: 'ivanivanov' },
        { name: 'first_name', label: 'Имя', value: 'Иван' },
        { name: 'second_name', label: 'Фамилия', value: 'Иванов' },
        { name: 'display_name', label: 'Имя в чате', value: 'Иван' },
        { name: 'phone', label: 'Телефон', value: '+7 (909) 967 30 30' },
      ],
      buttonSettings: [
        {
          href: '/settings/edit-profile',
          className: linkStyles.actionLink,
          text: 'Изменить данные',
          useDefaultClass: false,
          onClick: handleEditData,
        },
        {
          href: '/settings/change-password',
          className: linkStyles.actionLink,
          text: 'Изменить пароль',
          useDefaultClass: false,
          onClick: handleChangePassword,
        },
        {
          href: '/',
          className: linkStyles.logoutLink,
          text: 'Выйти',
          useDefaultClass: false,
          onClick: handleLogout,
        },
      ],
      sidebarData: {
        href: '/messenger',
        iconSrc: '/back-arrow.png',
        onClick: handleSidebarClick,
      },
    });

    super({
      profilePage,
    });
  }

  protected render(): string {
    return `{{{ profilePage }}}`;
  }
}