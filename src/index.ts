import * as fs from 'fs';
import * as path from 'path';
import * as chalk from 'chalk';
import { LETTERS, NUMBERS, PUNCTUATIONS } from './dictionary';

const fixtureDir = path.resolve(__dirname, '..', 'fixtures');
const HEIGHT = 8;
type Character = {
    content: string,
    lines: string[],
    width: number,
    height: number,
};

type Dictionary = Record<string, string>;

type CharacterMapping = Record<string, Character>;

export type Option = {
    butter?: number,
    maxLineWidth?: number,
    color?: string,
}

const PALETTE = [
    'red',
    'green',
    'yellow',
    'blue',
    'magenta',
    'cyan',
    'white',
];

const readFile = (filepath: string): Promise<string> => new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf-8', (err, content) => {
        if (err) {
            reject(err);
            return;
        }
        resolve(content);
    });
});

// 计算斜体字的整个有效宽度
function calcCharacterWidth(content: string): number {
    const lines = content.split('\n');
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
}

// 计算字符的前驱空格数
function prefixSpace(str: string) {
    const matched = /^\s+/g.exec(str);
    return matched ? matched[0].length : 0;
}

// 计算字符后置空格数
function tailSpace(str: string) {
    const matched = /\s+$/g.exec(str);
    return matched ? matched[0].length : 0;
}

/**
 * 为了保证字体的展示效果，目前字体并非定宽，也不具备统一的标准盒
 * 加上字体是偏3D斜体的样式。因此如果不做调整，自间距会参差不齐
 * 下面会对缩进进行了自适应的排版调整
 */
// 计算添加该字符的缩进阈值
function calcIndent(lines: string[], charLines: string[]): number {
    // 不会影响到渲染的最小缩进
    let minIndent = Infinity;
    for (let i = 1; i < lines.length; i++) {
        // 允许缩进的最大值
        const allowIndent = tailSpace(lines[i]);
        const charPrefixSpace = prefixSpace(charLines[i]);
        minIndent = Math.min(minIndent, allowIndent + charPrefixSpace);
    }
    return minIndent;
}

// 添加新字符，并进行缩进调整
function appendCharacter(lines: string[], charLines: string[], butter: number): string[] {
    const indent = calcIndent(lines, charLines);
    return lines.map((l, i) => {
        const allowIndent = tailSpace(l);
        const charPrefixSpace = prefixSpace(charLines[i]);
        const spaceNeedRetain = allowIndent + charPrefixSpace - indent + butter;
        return l.replace(/\s+$/g, '') + ' '.repeat(spaceNeedRetain) + charLines[i].replace(/^\s+/g, '');
    });
}

async function loadSet(set: Dictionary, dir: string) {
    const contents = await Promise.all(
        Object.values(set).map(file => readFile(path.resolve(fixtureDir, dir, file)))
    );

    const mapping: CharacterMapping = {};
    Object.keys(set).forEach((meaning, idx) => {
        const width = calcCharacterWidth(contents[idx]);
        const lines = contents[idx].split('\n');
        const maxLen = lines.reduce((max, l) => Math.max(max, l.length), 0);
        for (let i = 0; i < HEIGHT; i++) {
            if (!lines[i]) {
                lines[i] = ' '.repeat(maxLen);
                continue;
            }
            lines[i] += ' '.repeat(maxLen - lines[i].length);
        }
        mapping[meaning] = {
            content: contents[idx],
            lines,
            width,
            height: HEIGHT,
        };
    });
    return mapping;
}

async function loadAll(): Promise<CharacterMapping> {
    const letterMap = await loadSet(LETTERS, 'letter');
    const numberMap = await loadSet(NUMBERS, 'number');
    const punctuationMap = await loadSet(PUNCTUATIONS, 'punctuation');

    return {
        ...letterMap,
        ...numberMap,
        ...punctuationMap,
    };
}

async function createLines(str: string, opt?: Option): Promise<string[]> {
    const butter = opt?.butter ?? 1;
    const maxLineWidth = opt?.maxLineWidth ?? Infinity;
    const color = opt?.color === 'random'
        ? PALETTE[Math.floor(Math.random() * PALETTE.length)]
        : opt?.color;
    const dictionary = await loadAll();
    const charSet = str.split('');
    const linesSet = charSet
        .filter(c => dictionary[c.toLowerCase()])
        .map(c => dictionary[c.toLowerCase()].lines);

    const prints: string[][] = [[...linesSet[0]]];
    for (let i = 1; i < linesSet.length; i++) {
        if (prints[prints.length - 1][0].length <= maxLineWidth) {
            prints[prints.length - 1] = appendCharacter(prints[prints.length - 1], linesSet[i], butter);
        }
        else {
            prints.push(linesSet[i]);
        }
    }

    return prints
        .reduce((prev, i) => [...prev, ...i], [])
        .map(l => color ? chalk[color](l) : l);
}

export function hey(str: string, opt?: Option) {
    createLines(str, opt).then(lines => {
        lines.forEach(l => console.log(l));
    });
}

module.exports = async function main() {
    hey('Hey·leslie', { butter: 2, color: 'random' });
}

if (require.main === module) {
    module.exports();
}