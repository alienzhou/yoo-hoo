import type { Character, Dictionary, FontDefinition, FontFamilyObject } from './types';
import { debug, debugVerbose } from './debug';

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
        debugVerbose('minLeft:', minLeft, 'maxRight:', maxRight);
    });

    return maxRight - minLeft + 1;
};

const formatCharacter = function (info: FontDefinition, maxCharHeight: number): Character[] {
    const { codes, defs } = info;
    const content = codes.reduce((text, c) => text + String.fromCharCode(c), '');
    const lines = content.split('\n');

    // fill empty lines in case of short characters
    if (lines.length < maxCharHeight) {
        lines.push(...new Array<string>(maxCharHeight - lines.length).fill(''));
    }

    const maxLen = lines.reduce((max, l) => Math.max(max, l.length), 0);

    for (let i = 0; i < lines.length; i++) {
        lines[i] += ' '.repeat(maxLen - lines[i].length);
    }

    const width = calcCharacterWidth(lines);

    debugVerbose('width:', width, 'maxCharHeight:', maxCharHeight);

    return defs.map(def => ({
        lines: [...lines],
        width,
        height: maxCharHeight,
        def,
    }));
};

const loadCharacters = function (fontFamily?: FontFamilyObject): Character[][] {
    let fontModule: { fonts: FontDefinition[] };

    if (fontFamily) {
        fontModule = fontFamily;
    } else {
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
            fontModule = require('./fonts/default.js') as { fonts: FontDefinition[] };
        } catch (e: unknown) {
            throw Error(`FONT NOT FOUND (Font Family Default). \n${e as string}`);
        }
    }

    const fonts = fontModule.fonts;
    const maxCharHeight = fonts.reduce((max, f) => Math.max(f.codes.filter(c => c === 10).length + 1, max), 0);

    return fonts.map(f => formatCharacter(f, maxCharHeight));
};

export const load = function (fontFamily?: FontFamilyObject): Dictionary {
    debug('loading font', fontFamily?.name ?? 'default');

    const characters = loadCharacters(fontFamily);

    debugVerbose('characters:', characters);
    debug('load characters successfully:', characters.map(cur => cur.map(c => c.def).join(',')).join(','));

    const mapping: Dictionary = {};

    characters
        .filter(c => c.length)
        .reduce((prev, c) => [...prev, ...c], [])
        .forEach(c => {
            mapping[c.def] = c;
        });

    return mapping;
};
