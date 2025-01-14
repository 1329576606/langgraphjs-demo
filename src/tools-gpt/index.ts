import {config} from "dotenv";
import path from "node:path";
config({path: path.resolve(__dirname, '../../.env')});

import {HumanMessage} from "@langchain/core/messages";
import {graph} from "./graph";


(async function main() {
    const finalState = await graph.invoke(
        {messages: [new HumanMessage("什么是LangChain？")]},
        {configurable: {thread_id: "42"}}
    );

    console.log(finalState.messages[finalState.messages.length - 1].content);
})();