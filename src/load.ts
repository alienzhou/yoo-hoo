import type { Character, Dictionary } from './types';
import { CHARACTER_HEIGHT } from './const';

interface FontDefinition {
    defs: string[];
    codes: number[];
}

// calc the valid width of characters
const calcCharacterWidth = function (lines: string[]): number {
    let minLeft = Infinity;
    let maxRight = -Infinity;

    lines.forEach(l => {
        let left = l.length;

        for (let i = 0; i < l.length; i++) {
            if (l[i] !== ' ') {
                left = i;
                break;
            }
        }

        let right = 0;

        for (let i = l.length - 1; i >= 0; i--) {
            if (l[i] !== ' ') {
                right = i;
                break;
            }
        }

        minLeft = Math.min(left, minLeft);
        maxRight = Math.max(right, maxRight);
    });

    return maxRight - minLeft + 1;
};

const formatCharacter = function (info: FontDefinition): Character[] {
    const { codes, defs } = info;
    const content = codes.reduce((text, c) => text + String.fromCharCode(c), '');
    const lines = content.split('\n');

    // fill empty lines in case of short characters
    if (lines.length < CHARACTER_HEIGHT) {
        lines.push(...new Array(CHARACTER_HEIGHT - lines.length).fill(''));
    }

    const maxLen = lines.reduce((max, l) => Math.max(max, l.length), 0);

    for (let i = 0; i < lines.length; i++) {
        lines[i] += ' '.repeat(maxLen - lines[i].length);
    }

    const width = calcCharacterWidth(lines);

    return defs.map(def => ({
        lines: [...lines],
        width,
        height: CHARACTER_HEIGHT,
        def,
    }));
};

const loadCharacters = function (modulePath: string): Character[][] {
    try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
        const { fonts } = require(modulePath) as { fonts: FontDefinition[] };

        return fonts.map(formatCharacter);
    } catch (e: unknown) {
        // eslint-disable-next-line no-console
        console.error(`FONT SET NOT FOUND in ${modulePath}:`, e);

        return [];
    }
};

export const load = function (modulePath: string): Dictionary {
    const characters = loadCharacters(modulePath);
    const mapping: Dictionary = {};

    characters
        .filter(c => c.length)
        .reduce((prev, c) => [...prev, ...c], [])
        .forEach(c => {
            mapping[c.def] = c;
        });

    return mapping;
};
