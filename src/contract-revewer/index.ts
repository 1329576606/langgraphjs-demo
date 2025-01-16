import "../env"
// import
import {readFileSync} from "node:fs";
import {removeEnter, removeSolidityComments, removeWhitespace} from "./utiils";

// 使用multi-agent
import {graph} from "./impl/multi-agent/graph";
import path from "node:path";
import * as fs from "node:fs";


const contractPath = path.resolve(__dirname, './data/CVE/2018-10706.sol');
// const contract = path.resolve(__dirname, './data/CVE/2018-10944.sol');
// const contract = path.resolve(__dirname, './data/CVE/2018-11239.sol');

// 读取文件
let code = readFileSync(contractPath, {encoding: 'utf-8'});
// 清除注释和多余空格
code = removeSolidityComments(code);
code = removeWhitespace(code);
code = removeEnter(code);

const param = {
    code: code,
    multiLanguage: ['chinese'],
};

(async function () {
    const res = await graph.invoke(param, {recursionLimit: 150});
    fs.writeFileSync(path.resolve(__dirname, './data/AuditResult.json'),JSON.stringify(res.auditResult),{encoding:'utf-8'});
    fs.writeFileSync(path.resolve(__dirname, './data/MultiLanguageAuditResult.json'),JSON.stringify(res.multiLanguageAuditResult),{encoding:'utf-8'});
})();


// (async function main() {
//     const streamResults = await graph.stream(
//         param,
//         {recursionLimit: 150},
//     );
//
//     const prettifyOutput = (output: Record<string, any>) => {
//         const keys = Object.keys(output);
//         const firstItem = output[keys[0]];
//
//         if ("messages" in firstItem && Array.isArray(firstItem.messages)) {
//             const lastMessage = firstItem.messages[firstItem.messages.length - 1];
//             console.dir({
//                 type: lastMessage._getType(),
//                 content: lastMessage.content,
//                 tool_calls: lastMessage.tool_calls,
//             }, {depth: null});
//         }
//
//         if ("sender" in firstItem) {
//             console.log({
//                 sender: firstItem.sender,
//             })
//         }
//
//         if ("code" in firstItem) {
//             console.log({
//                 code: firstItem.code,
//             })
//         }
//
//         if ("auditResult" in firstItem) {
//             console.log({
//                 auditResult: JSON.stringify(firstItem.auditResult),
//             })
//         }
//
//         if ("multiLanguageAuditResult" in firstItem) {
//             console.log({
//                 multiLanguageAuditResult: JSON.stringify(firstItem.multiLanguageAuditResult),
//             })
//         }
//     }
//
//     for await (const output of await streamResults) {
//         if (!output?.__end__) {
//             prettifyOutput(output);
//             console.log("----");
//         }
//     }
//
// })();

