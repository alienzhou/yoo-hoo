import type { Character, Dictionary } from './types';

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

const formatCharacter = function (info: FontDefinition, maxCharHeight: number): Character[] {
    const { codes, defs } = info;
    const content = codes.reduce((text, c) => text + String.fromCharCode(c), '');
    const lines = content.split('\n');

    // fill empty lines in case of short characters
    if (lines.length < maxCharHeight) {
        lines.push(...new Array(maxCharHeight - lines.length).fill(''));
    }

    const maxLen = lines.reduce((max, l) => Math.max(max, l.length), 0);

    for (let i = 0; i < lines.length; i++) {
        lines[i] += ' '.repeat(maxLen - lines[i].length);
    }

    const width = calcCharacterWidth(lines);

    return defs.map(def => ({
        lines: [...lines],
        width,
        height: maxCharHeight,
        def,
    }));
};

const loadCharacters = function (): Character[][] {
    try {
        // TODO support load customized font set modules
        // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
        const { fonts } = require('./res/font.js') as { fonts: FontDefinition[] };

        const maxCharHeight = fonts.reduce((max, f) => Math.max(f.codes.filter(c => c === 10).length + 1, max), 0);

        return fonts.map(f => formatCharacter(f, maxCharHeight));
    } catch (e: unknown) {
        // eslint-disable-next-line no-console
        console.error('FONT SET NOT FOUND in ./res/font.js:', e);

        return [];
    }
};

export const load = function (): Dictionary {
    const characters = loadCharacters();
    const mapping: Dictionary = {};

    characters
        .filter(c => c.length)
        .reduce((prev, c) => [...prev, ...c], [])
        .forEach(c => {
            mapping[c.def] = c;
        });

    return mapping;
};
