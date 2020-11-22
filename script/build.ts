import * as fs from 'fs';
import * as path from 'path';
import {
    BUILT_IN_RAW_DIR,
    BUILT_IN_FONT_MODULE,
    BUILT_IN_FONT_DIR,
} from './const';

type RecursiveDirectoryCallback<T> = (filepath: string) => T;

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
    let token = '';
    const defs: string[] = [];

    for (const char of line) {
        if (char === ' ' && token) {
            defs.push(token);
            token = '';
        }

        if (char !== ' ') {
            token += char;
        }
    }

    if (token) {
        defs.push(token);
    }

    return defs;
};

export const parse = function (filepath: string) {
    try {
        const text = fs.readFileSync(filepath, 'utf-8');
        const matched = /^(?<def>.+?)\n(?<char>[^]*)/u.exec(text);

        if (!matched || !matched.groups?.def || !matched.groups.char) {
            throw Error("Can't parse the content. Its may be in wrong format.");
        }

        const rawDef = matched.groups.def;
        const content = matched.groups.char;
        const defs = parseDefinition(rawDef);

        return {
            defs,
            content,
        };
    } catch (e: unknown) {
        // eslint-disable-next-line no-console
        console.log('load character error:', e);

        return null;
    }
};

const arrayToString = <T>(arr: T[]) => '[' + arr.map(d => `'${d}'`).join(',') + ']';

export const buildCharacterModules = function () {
    const fontDir = BUILT_IN_FONT_DIR;
    const fontFilepath = BUILT_IN_FONT_MODULE;
    try {
        fs.accessSync(fontDir);
    }
    catch {
        fs.mkdirSync(fontDir);
    }

    try {
        fs.accessSync(fontFilepath);
        fs.unlinkSync(fontFilepath);
    }
    catch {}

    const parsedFonts: Array<{ defs: string[]; codes: number[], content: string }> = [];
    recursiveDirectory(BUILT_IN_RAW_DIR, filepath => {
        const info = parse(filepath);
        if (!info) {
            return;
        }

        const { defs, content } = info;
        const codes: number[] = [];
        for (const c of content) {
            codes.push(c.charCodeAt(0));
        }

        parsedFonts.push({
            defs,
            codes,
            content,
        });
    });

    const text = parsedFonts.reduce((t, f, idx) => {
        return t + (
            '\n/**\n'
            + f.content
            + '\n*/\n'
            + `fonts[${idx}] = {\n`
            + `  defs: ${arrayToString(f.defs)},\n`
            + `  codes: ${arrayToString(f.codes)}\n`
            + '};\n'
        );
    }, '');
    const moduleText = (
        'const fonts = [];\n'
        + text
        + 'module.exports.fonts = fonts;\n'
    );

    fs.writeFileSync(fontFilepath, moduleText, 'utf-8');
}

if (require.main === module) {
    buildCharacterModules();
}