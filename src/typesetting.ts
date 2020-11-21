import { Dictionary, Option } from './types';

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
        const formerTailNum = tailSpace(lines[i]);
        const latterPrefixNum = prefixSpace(charLines[i]);
        minIndent = Math.min(minIndent, formerTailNum + latterPrefixNum);
    }
    return minIndent;
}

// 添加新字符，并进行缩进调整
function appendCharacter(lines: string[], charLines: string[], spacing: number): string[] {
    const indent = calcIndent(lines, charLines);
    return lines.map((l, i) => {
        const allowIndent = tailSpace(l);
        const charPrefixSpace = prefixSpace(charLines[i]);
        const spaceNeedRetain = allowIndent + charPrefixSpace - indent + spacing;
        return l.replace(/\s+$/g, '')
            + ' '.repeat(spaceNeedRetain)
            + charLines[i].replace(/^\s+/g, '');
    });
}

export function layout(str: string, dictionary: Dictionary, opt: Required<Option>): string[] {
    const { spacing, maxLineWidth } = opt;
    const charSet = str.split('');
    const linesSet = charSet
        .filter(c => dictionary[c.toLowerCase()])
        .map(c => dictionary[c.toLowerCase()].lines);

    const prints: string[][] = [[...linesSet[0]]];
    for (let i = 1; i < linesSet.length; i++) {
        if (prints[prints.length - 1][0].length <= maxLineWidth) {
            prints[prints.length - 1] = appendCharacter(prints[prints.length - 1], linesSet[i], spacing);
        }
        else {
            prints.push(linesSet[i]);
        }
    }

    return prints.reduce((prev, i) => [...prev, ...i], []);
}