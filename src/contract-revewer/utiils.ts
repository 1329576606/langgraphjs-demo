export function removeSolidityComments(code: string) {
    // Remove single-line comments
    code = code.replace(/\/\/.*$/gm, '');
    // Remove multi-line comments
    code = code.replace(/\/\*[\s\S]*?\*\//gm, '');
    return code;
}

export function removeWhitespace(code: string) {
    // 删除代码中多余的空格
    code = code.replace(/\s+/g, ' ');
    return code;
}

export function removeEnter(code: string) {
    code = code.replace(/\n/g, '');
    return code;
}

export function jsonParse(content: string): any {
    // 移除可能的markdown代码块标记
    content = content.replace(/```json\s*/g, '')
        .replace(/```\s*$/g, '');

    // 找到第一个 { 和最后一个 }
    const startIndex = content.indexOf('{');
    const endIndex = content.lastIndexOf('}');

    if (startIndex === -1 || endIndex === -1) {
        throw new Error('Invalid JSON response format');
    }

    // 提取JSON部分
    let jsonStr = content.substring(startIndex, endIndex + 1);

    // 清理控制字符和转义不规范的换行符
    jsonStr = jsonStr.replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
        .replace(/\\n/g, '\\n')
        .replace(/\\'/g, "\\'")
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, '\\&')
        .replace(/\\r/g, '\\r')
        .replace(/\\t/g, '\\t')
        .replace(/\\b/g, '\\b')
        .replace(/\\f/g, '\\f');
    return JSON.parse(jsonStr);
}