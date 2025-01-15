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
export function removeEnter(code:string) {
    code = code.replace(/\n/g, '');
    return code;
}