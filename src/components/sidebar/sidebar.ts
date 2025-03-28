import Block from "../../framework/block"
import { Sidebar } from "../sidebar/sidebar";

export class ProfilePage extends Block {
    constructor(props: ProfilePageProps) {
        const sidebar = new Sidebar({
            href: props.sidebarData.href,
            iconSrc: props.sidebarData.iconSrc,
            events: {
                click: (e: Event) => {
                    e.preventDefault();
                    props.sidebarData.onClick?.(e);
                }
            }
        });

        super({
            ...props,
            sidebar, // Передаем компонент
            // ... остальные props
        });
    }

    protected render(): string {
        return `
      <section class="{{styles.profile}}">
        <div class="{{styles.profile__container--background}}">
          {{{ sidebar }}} <!-- Используем компонент -->
          <!-- ... остальной контент ... -->
        </div>
      </section>
    `;
    }
}