import * as path from 'path';
import chalk from 'chalk';
import type { Dictionary, Option } from './types';
import { load } from './load';
import { layout } from './typesetting';

type Paint = (s: string) => string;
type ChalkMod = Record<string, Paint>;

const PALETTE = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];

const formatOption = function (opt?: Option): Required<Option> {
    const spacing = opt?.spacing ?? 1;
    const maxLineWidth = opt?.maxLineWidth ?? Infinity;
    const characterDir = opt?.characterDir ?? '';
    const silent = opt?.silent ?? false;
    const color = opt?.color === 'random' ? PALETTE[Math.floor(Math.random() * PALETTE.length)] : opt?.color ?? 'none';

    return {
        color,
        spacing,
        silent,
        maxLineWidth,
        characterDir,
    };
};

let dictionary: Dictionary = {};

export const hey = function (str: string, opt?: Option) {
    const options = formatOption(opt);

    dictionary = load(path.resolve(__dirname, '..', 'character'));

    if (options.characterDir) {
        dictionary = {
            ...dictionary,
            // customized characters will overwrite built-ins
            ...load(options.characterDir),
        };
    }

    const lines = layout(str, dictionary, options);

    if (!options.silent) {
        let paint: Paint = (s: string) => s;
        const color = options.color === 'random' ? PALETTE[Math.floor(Math.random() * PALETTE.length)] : options.color;

        if (typeof ((chalk as unknown) as ChalkMod)[color] === 'function') {
            paint = (s: string) => ((chalk as unknown) as ChalkMod)[color](s);
        }

        lines.forEach(l => {
            // eslint-disable-next-line no-console
            console.log(paint(l));
        });
    }

    return lines;
};

if (require.main === module) {
    hey(process.argv[2] || 'Hey·leslie', { spacing: 2, color: 'random' });
}
