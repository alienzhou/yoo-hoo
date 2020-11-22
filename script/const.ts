import * as path from 'path';

export const BUILT_IN_RAW_DIR = path.resolve(__dirname, '..', 'raw');
export const BUILT_IN_FONT_DIRNAME = 'res';
export const BUILT_IN_FONT_DIR = path.resolve(__dirname, '..', 'lib', BUILT_IN_FONT_DIRNAME);
export const BUILT_IN_FONT_FILENAME = 'font.js';
export const BUILT_IN_FONT_MODULE = path.resolve(BUILT_IN_FONT_DIR, BUILT_IN_FONT_FILENAME);
