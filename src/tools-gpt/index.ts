import "../env";

// import
import {graph} from "./graph";
import {HumanMessage} from "@langchain/core/messages";


(async function main() {
    const finalState = await graph.invoke(
        {messages: [new HumanMessage("帮我检查'src/tools-gpt'目录下的代码是否存在安全隐患")]},
        {configurable: {thread_id: "42"}},
    );

    console.log(finalState.messages[finalState.messages.length - 1].content);
})();