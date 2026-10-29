import themes from "../assets/themes.json"

export function getTheme(theme_name: string) {
    return themes.find(t => t.name == theme_name);
}