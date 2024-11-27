export const getURLFromName = (name: string): string => {
    return name.toLowerCase().replace(/ /g, '-').replace(/[^a-z-]/g, '')
}

export const toTitleCase = (str: string): string => {
    return str.replace(
        /\w\S*/g,
        text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
    );
}