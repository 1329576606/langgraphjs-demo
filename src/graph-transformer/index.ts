import {getLLm} from "../contract-revewer/impl/multi-agent/llm";
import {HumanMessage} from "@langchain/core/messages";
import "../env";
const message = ``;

const llm = getLLm();

(async function main() {
    let res = '';
    const stream = await llm.stream([new HumanMessage(message)]);
    console.log();
    for await (const chunk of stream) {
        process.stdout.write(chunk.content as string);
        res+=chunk.content;
    }

    // const aiMessageChunk = await llm.invoke([new HumanMessage(message)]);
    // console.log(aiMessageChunk.content);
    // fs.writeFileSync('result.json', res, {encoding: 'utf-8'});
})();