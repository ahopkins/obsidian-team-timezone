export interface TZSettings {
    tzinfo: string;
    format: string;
}

export interface SettingsGetter {
    (): TZSettings
}

export const DEFAULT_SETTINGS: TZSettings = {
    tzinfo: "[]",
    format: "yyyy-MM-dd HH:mm:ss",
}
