import { UpdateProfilePage } from '../components/profile/updateProfilePage';
import Block, { BlockProps } from '../framework/block';

interface UpdateProfilePageHandlerProps extends BlockProps {
  [key: string]: unknown;
  updateProfilePage?: UpdateProfilePage;
}

export class UpdateProfilePageHandler extends Block<UpdateProfilePageHandlerProps> {
  constructor() {
    // Create the UpdateProfilePage component with the existing profile template
    const updateProfilePage = new UpdateProfilePage({
      profileImage: '/profile-pic.png',
      userName: 'Иван', // Show the user name in the profile
      userFields: [
        { name: 'email', label: 'Почта', value: 'test@mail.com' },
        { name: 'login', label: 'Логин', value: 'ivanivanov' },
        { name: 'first_name', label: 'Имя', value: 'Иван' },
        { name: 'second_name', label: 'Фамилия', value: 'Иванов' },
        { name: 'display_name', label: 'Имя в чате', value: 'Иван' },
        { name: 'phone', label: 'Телефон', value: '+7 (909) 967 30 30' },
      ],
      sidebarData: {
        href: '#',
        iconSrc: '/back-arrow.png',
        onClick: () => this.handleBackClick(),
      },
      onSave: (formData) => this.handleSaveProfile(formData),
      onCancel: (): void => {
        this.handleBackClick();
      },
    });

    super({
      updateProfilePage,
    });
  }

  private handleBackClick(): void {
    console.warn('Back to profile page');
  }

  private handleSaveProfile(formData: Record<string, string>): void {
    console.warn('Saving profile data:', formData);
  }

  protected render(): string {
    return `{{{ updateProfilePage }}}`;
  }
}
