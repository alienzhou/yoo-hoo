import lolcatjs from 'lolcatjs';
import { isBrowser } from 'is-in-browser';
import type { Option } from './types';
import { yo as yoFunc } from './index';

export const yo = function (str: string, opt?: Option) {
    if (opt?.color !== 'rainbow') {
        return yoFunc(str, opt);
    }

    // not support in browsers
    if (isBrowser) {
        throw Error('not support rainbow in browsers now');
    }

    // use lolcat
    opt.silent = true;

    const lines = yoFunc(str, opt);

    lolcatjs.fromString(lines.join('\n'));

    return lines;
};
