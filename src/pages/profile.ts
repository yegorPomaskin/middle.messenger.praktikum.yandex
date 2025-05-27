import linkStyles from '../components/link/link.module.css';
import { ProfilePage } from '../components/profile/profilePage';
import Block, { BlockProps } from '../framework/block';
import { router } from '../router/Router';
import AuthController from '../controllers/AuthController';

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

    const handleLogout = async (e: Event) => {
      e.preventDefault();
      console.log('Выход из профиля');

      try {
        await AuthController.logout();
      } catch (error) {
        console.error('Ошибка при выходе:', error);
        router.go('/');
      }
    };

    const handleSidebarClick = (e: Event) => {
      e.preventDefault();
      console.log('Возврат к чатам');
      router.go('/messenger');
    };

     const getUserData = () => {
      const currentUser = AuthController.getUserData();

      console.log('🔍 Текущий пользователь:', currentUser);
      
      if (currentUser) {
        console.log('✅ Пользователь найден, создаем данные');
        return {
          profileImage: currentUser.avatar || '/profile-pic.png',
          userName: `${currentUser.first_name} ${currentUser.second_name}`,
          userFields: [
            { name: 'email', label: 'Почта', value: currentUser.email, editable: true },
            { name: 'login', label: 'Логин', value: currentUser.login },
            { name: 'first_name', label: 'Имя', value: currentUser.first_name },
            { name: 'second_name', label: 'Фамилия', value: currentUser.second_name },
            { name: 'display_name', label: 'Имя в чате', value: currentUser.display_name || currentUser.first_name },
            { name: 'phone', label: 'Телефон', value: currentUser.phone },
          ]
        };
      }

       
      // Fallback данные, если пользователь не загружен
      console.log('❌ Пользователь не найден, используем fallback');
      return {
        profileImage: '/profile-pic.png',
        userName: 'Пользователь',
        userFields: [
          { name: 'email', label: 'Почта', value: 'Загрузка...', editable: true },
          { name: 'login', label: 'Логин', value: 'Загрузка...' },
          { name: 'first_name', label: 'Имя', value: 'Загрузка...' },
          { name: 'second_name', label: 'Фамилия', value: 'Загрузка...' },
          { name: 'display_name', label: 'Имя в чате', value: 'Загрузка...' },
          { name: 'phone', label: 'Телефон', value: 'Загрузка...' },
        ]
      };
    };

     const userData = getUserData();

    // Создаем экземпляр ProfilePage с настроенными обработчиками событий
    const profilePage = new ProfilePage({
      profileImage: userData.profileImage, 
      userName: userData.userName,          
      userFields: userData.userFields,
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