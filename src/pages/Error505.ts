import { ErrorPage } from '../components/error/ErrorPage';
import Block, { BlockProps } from '../framework/block';
import { router } from '../router/Router';

interface Error505PageProps extends BlockProps {
  [key: string]: unknown;
  errorPage?: ErrorPage;
}

export class Error505Page extends Block<Error505PageProps> {
  constructor() {
    super({
      errorPage: new ErrorPage({
        errorName: '505',
        errorText: 'Уже фиксим',
        linkText: 'Назад к чатам',
        onLinkClick: (e: Event) => {
          e.preventDefault();
          router.go('/messenger');
        },
      }),
    });
  }

  protected render(): string {
    return `
            {{{ errorPage }}}
        `;
  }
}
