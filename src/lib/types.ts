export const Languages = [
    {
        id: "eUde",
        name: "German (Deutsch)",
    },
    {
        id: "eUen",
        name: "English (Europe)",
    },
    {
        id: "eUit",
        name: "Italian (Italiano)",
    },
    {
        id: "eUnl",
        name: "Dutch (Netherlands)",
    },
    {
        id: "eUru",
        name: "Russian (Русский)",
    },
    {
        id: "eUfr",
        name: "French (Français) (EU)",
    },
    {
        id: "eUes",
        name: "Spanish (Español) (EU)",
    },
    {
        id: "uSen",
        name: "English (US)",
    },
    {
        id: "uSfr",
        name: "French (Français) (NA)",
    },
    {
        id: "uSes",
        name: "Spanish (Español) (US)",
    },
    {
        id: "jPja",
        name: "Japanese (日本語)",
    },
    {
        id: "kRko",
        name: "Korean (한국어)",
    },
    {
        id: "tWzh",
        name: "Traditional Chinese (繁體中文)",
    },
    {
        id: "cNzh",
        name: "Simplified Chinese (简体中文)"
    },
].sort((a, b) => a.name < b.name ? -1 : 1);

export interface ISettings {
    lang: string;
    hemisphere: "north"|"south";

}
