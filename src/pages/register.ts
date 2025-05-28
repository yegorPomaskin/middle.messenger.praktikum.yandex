import { RegisterForm } from '../components/registerForm/registerForm';
import AuthController from '../controllers/AuthController';
import Block, { BlockProps } from '../framework/block';
import { router } from '../router/Router';

const REGISTER_FORM_CONFIG = {
  title: 'Регистрация',
  fields: [
    { label: 'Почта', name: 'email', type: 'email', required: true },
    { label: 'Логин', name: 'login', type: 'text', required: true },
    { label: 'Имя', name: 'first_name', type: 'text', required: true },
    { label: 'Фамилия', name: 'second_name', type: 'text', required: true },
    { label: 'Телефон', name: 'phone', type: 'tel', required: true },
    { label: 'Пароль', name: 'password', type: 'password', required: true },
    {
      label: 'Пароль еще раз',
      name: 'password_repeat',
      type: 'password',
      required: true,
    },
  ],
  buttonText: 'Зарегистрироваться',
  linkText: 'Войти',
  linkHref: '#login',
};

interface RegisterPageProps extends BlockProps {
  [key: string]: unknown;
  RegisterForm?: RegisterForm;
}

export class RegisterPage extends Block<RegisterPageProps> {
  constructor() {
    super({
      RegisterForm: new RegisterForm({
        ...REGISTER_FORM_CONFIG,
        isLogin: false,
        onLinkClick: (e: Event) => {
          e.preventDefault();
          // Переходим на страницу авторизации через роутер
          router.go('/');
        },
        onSubmit: async (formData: Record<string, string>) => {
          try {
            await AuthController.signUp({
              email: formData.email,
              login: formData.login,
              first_name: formData.first_name,
              second_name: formData.second_name,
              phone: formData.phone,
              password: formData.password,
            });
          } catch (error) {
            console.error('Ошибка регистрации:', error);
          }
        },
      }),
    });
  }

  protected render(): string {
    return `{{{ RegisterForm }}}`;
  }
}
