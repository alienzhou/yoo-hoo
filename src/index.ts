import chalk from 'chalk';
import type { Dictionary, Option } from './types';
import { load } from './load';
import { layout } from './typesetting';
import { DEFAULT_COLOR, DEFAULT_MAX_LINE_WIDTH, DEFAULT_SILENT, DEFAULT_SPACING } from './const';

type Paint = (s: string) => string;
type ChalkMod = Record<string, Paint>;

const PALETTE = ['red', 'green', 'yellow', 'blue', 'magenta', 'cyan', 'white'];

const formatOption = function (opt?: Option): Required<Option> {
    const spacing = opt?.spacing ?? DEFAULT_SPACING;
    const maxLineWidth = opt?.maxLineWidth ?? DEFAULT_MAX_LINE_WIDTH;
    const silent = opt?.silent ?? DEFAULT_SILENT;
    const color =
        opt?.color === 'random' ? PALETTE[Math.floor(Math.random() * PALETTE.length)] : opt?.color ?? DEFAULT_COLOR;

    return {
        color,
        spacing,
        silent,
        maxLineWidth,
    };
};

let dictionary: Dictionary = {};

export const yo = function (str: string, opt?: Option) {
    const options = formatOption(opt);

    // has not loaded
    if (!Object.keys(dictionary).length) {
        dictionary = load();
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
