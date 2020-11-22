import type { Dictionary, Option } from './types';

// calc the prefix space
const prefixSpace = function (str: string) {
    const matched = /^\s+/gu.exec(str);

    return matched ? matched[0].length : 0;
};

// calc the tail space
const tailSpace = function (str: string) {
    const matched = /\s+$/gu.exec(str);

    return matched ? matched[0].length : 0;
};

// calc how many spaces need for indent for layout
// overwise the gap between two characters will be different
const calcIndent = function (lines: string[], charLines: string[]): number {
    // maximum indent that won't break the layout
    let maxPossible = Infinity;

    for (let i = 1; i < lines.length; i++) {
        const formerTailNum = tailSpace(lines[i]);
        const latterPrefixNum = prefixSpace(charLines[i]);

        maxPossible = Math.min(maxPossible, formerTailNum + latterPrefixNum);
    }

    return maxPossible;
};

// append a new character and adjust the indent
const appendCharacter = function (lines: string[], charLines: string[], spacing: number): string[] {
    const indent = calcIndent(lines, charLines);

    return lines.map((l, i) => {
        const allowIndent = tailSpace(l);
        const charPrefixSpace = prefixSpace(charLines[i]);
        const spaceNeedRetain = allowIndent + charPrefixSpace - indent + spacing;

        return l.replace(/\s+$/gu, '') + ' '.repeat(spaceNeedRetain) + charLines[i].replace(/^\s+/gu, '');
    });
};

export const layout = function (str: string, dictionary: Dictionary, opt: Required<Option>): string[] {
    const { spacing, maxLineWidth } = opt;
    const charSet = str.split('');
    const linesSet = charSet.filter(c => dictionary[c.toLowerCase()]).map(c => dictionary[c.toLowerCase()].lines);

    const prints: string[][] = [[...linesSet[0]]];

    for (let i = 1; i < linesSet.length; i++) {
        if (prints[prints.length - 1][0].length <= maxLineWidth) {
            prints[prints.length - 1] = appendCharacter(prints[prints.length - 1], linesSet[i], spacing);
        } else {
            prints.push(linesSet[i]);
        }
    }

    return prints.reduce((prev, i) => [...prev, ...i], []);
};
