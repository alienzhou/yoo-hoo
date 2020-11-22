import * as fs from 'fs';
import * as path from 'path';
import type { Character, Dictionary } from './types';

type RecursiveDirectoryCallback<T> = (filepath: string) => T;

const HEIGHT = 8;

const recursiveDirectory = function <T>(dir: string, cb: RecursiveDirectoryCallback<T>): T[] {
    let files = fs.readdirSync(dir).map(name => path.resolve(dir, name));
    const ret: T[] = [];

    while (true) {
        const filepath = files.shift();

        if (!filepath) {
            break;
        }

        if (fs.statSync(filepath).isDirectory()) {
            const subFilepaths = fs.readdirSync(filepath).map(name => path.resolve(filepath, name));

            files = [...files, ...subFilepaths];
            continue;
        }

        ret.push(cb(filepath));
    }

    return ret;
};

const parseDefinition = function (line: string) {
    let definition = '';
    const ret: string[] = [];

    for (const char of line) {
        if (char === ' ' && definition) {
            ret.push(definition);
            definition = '';
        }

        if (char !== ' ') {
            definition += char;
        }
    }

    if (definition) {
        ret.push(definition);
    }

    return ret;
};

// 计算斜体字的整个有效宽度
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

const loadCharacter = function (filepath: string): Character[] {
    try {
        const content = fs.readFileSync(filepath, 'utf-8');
        const rows = content.split('\n');
        const rawDef = rows[0];
        const lines = rows.slice(1);

        // fill empty lines in case of short characters
        if (lines.length < HEIGHT) {
            lines.push(...new Array(HEIGHT - lines.length).fill(''));
        }

        const maxLen = lines.reduce((max, l) => Math.max(max, l.length), 0);

        for (let i = 0; i < lines.length; i++) {
            lines[i] += ' '.repeat(maxLen - lines[i].length);
        }

        const defs = parseDefinition(rawDef);
        const width = calcCharacterWidth(lines);

        return defs.map(def => ({
            lines: [...lines],
            width,
            height: HEIGHT,
            def,
        }));
    } catch (e: unknown) {
        // eslint-disable-next-line no-console
        console.log('load character error:', e);

        return [];
    }
};

export const load = function (dir: string): Dictionary {
    const characters = recursiveDirectory(dir, loadCharacter);
    const mapping: Dictionary = {};

    characters
        .reduce((prev, c) => [...prev, ...c], [])
        .forEach(c => {
            mapping[c.def] = c;
        });

    return mapping;
};
