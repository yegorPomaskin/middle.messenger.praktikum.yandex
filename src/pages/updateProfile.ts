import Block from "../framework/block";
import { UpdateProfilePage } from "../components/profile/updateProfilePage";
import buttonStyles from "../components/button/button.module.css";

export class UpdateProfilePageHandler extends Block {
    private updateProfilePage: UpdateProfilePage;

    constructor() {
        // Create the UpdateProfilePage component with the existing profile template
        const updateProfilePage = new UpdateProfilePage({
            profileImage: "/profile-pic.png",
            userName: "Иван", // Show the user name in the profile
            userFields: [
                { name: "email", label: "Почта", value: "test@mail.com" },
                { name: "login", label: "Логин", value: "ivanivanov" },
                { name: "first_name", label: "Имя", value: "Иван" },
                { name: "second_name", label: "Фамилия", value: "Иванов" },
                { name: "display_name", label: "Имя в чате", value: "Иван" },
                { name: "phone", label: "Телефон", value: "+7 (909) 967 30 30" },
            ],
            sidebarData: {
                href: "#",
                iconSrc: "/back-arrow.png",
                onClick: () => this.handleBackClick(),
            },
            onSave: (formData) => this.handleSaveProfile(formData),
            onCancel: () => this.handleBackClick(),
        });

        super({
            updateProfilePage
        });

        this.updateProfilePage = updateProfilePage;
    }

    private handleBackClick(): void {
        console.log('Back to profile page');
    }

    private handleSaveProfile(formData: Record<string, string>): void {
        console.log('Saving profile data:', formData);
    }

    protected render(): string {
        return `
            {{{ updateProfilePage }}}
        `;
    }
}