import Block from "../../framework/block";
import template from "./profile.hbs?raw";
import styles from "./profile.module.css";
import commonStyles from "../profileField/commonProfileStyles.module.css";
import { Sidebar } from "../sidebar/sidebar";
import { Link } from "../link/link";
import { ProfileField } from "../profileField/profileField";

interface ProfilePageProps {
    profileImage: string;
    userName: string;
    userFields: Array<{
        name: string;
        label: string;
        value: string;
        type?: string;
        editable?: boolean;
    }>;
    buttons: Array<{
        text: string;
        className: string;
        href: string;
        useDefaultClass?: boolean;
        onClick?: (event: Event) => void;
    }>;
    sidebarData: {
        href: string;
        iconSrc: string;
        onClick?: (event: Event) => void;
    };
    isEditMode?: boolean;
}

export class ProfilePage extends Block {
    constructor(props: ProfilePageProps) {
        // Создаем сайдбар
        const sidebar = new Sidebar({
            href: props.sidebarData.href,
            iconSrc: props.sidebarData.iconSrc,
            onClick: props.sidebarData.onClick,
        });

        // Создаем компоненты для полей профиля
        const fields = (props.userFields || []).map(field => 
            new ProfileField({
                name: field.name,
                label: field.label,
                value: field.value,
                type: field.type,
                mode: props.isEditMode ? 'edit' : 'view',
                events: {
                    focus: (e: FocusEvent) => {
                        console.log(`Field ${field.name} focused`, e);
                    },
                    blur: (e: FocusEvent) => {
                        console.log(`Field ${field.name} blurred`, e);
                    },
                    change: (e: Event) => {
                        const input = e.target as HTMLInputElement;
                        console.log(`Field ${field.name} changed to: ${input.value}`);
                    }
                }
            })
        );

        // Создаем компоненты для кнопок действий
        const buttons = (props.buttons || []).map(button => 
            new Link({
                href: button.href,
                text: button.text,
                className: button.className,
                useDefaultClass: button.useDefaultClass ?? false,
                attr: {
                    'data-action': button.text.toLowerCase().replace(/\s+/g, '')
                },
                events: {
                    click: (e: Event) => {
                        e.preventDefault();
                        console.log(`Button "${button.text}" clicked`);
                        
                        if (button.onClick) {
                            button.onClick(e);
                        }
                    }
                }
            })
        );

        super({
            ...props,
            sidebar,
            fields,
            buttons,
            styles,
            commonStyles,
            isEditMode: props.isEditMode || false,
            events: {
                click: (e: Event) => {
                    const target = e.target as HTMLElement;
                    if (target.closest('#changeAvatarBtn')) {
                        e.preventDefault();
                        console.log('Avatar change requested');
                    }
                }
            }
        });
        
        // Отладочная информация
        console.log('Fields in lists:', this.lists.fields);
        console.log('Buttons in lists:', this.lists.buttons);
    }

    public setEditMode(isEdit: boolean): void {
        this.setProps({ isEditMode: isEdit });
        
        // Обновляем режим для всех полей
        if (this.lists && this.lists.fields) {
            this.lists.fields.forEach(field => {
                if (field instanceof ProfileField) {
                    field.setProps({ mode: isEdit ? 'edit' : 'view' });
                }
            });
        }
    }

    protected render(): string {
        return template;
    }
}