export interface Character {
    lines: string[];
    width: number;
    height: number;
    def: string;
}

export type Dictionary = Record<string, Character>;

export interface FontDefinition {
    defs: string[];
    codes: number[];
}

export interface FontFamilyObject {
    fonts: FontDefinition[];
    name: string;
}

export interface Option {
    fontFamily?: FontFamilyObject | 'default';
    spacing?: number;
    paddingStart?: number;
    maxLineWidth?: number;
    color?: string;
    silent?: boolean;
}
