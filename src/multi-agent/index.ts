import {config} from "dotenv";
import path from "node:path";
config({path: path.resolve(__dirname, '../../.env')});

import {HumanMessage} from "@langchain/core/messages";
import {graph} from "./graph";

(async function main() {
    const streamResults = await graph.stream(
        {
            messages: [
                new HumanMessage({
                    content: "Generate a bar chart of the US gdp over the past 3 years.",
                }),
            ],
        },
        {recursionLimit: 150},
    );

    const prettifyOutput = (output: Record<string, any>) => {
        const keys = Object.keys(output);
        const firstItem = output[keys[0]];

        if ("messages" in firstItem && Array.isArray(firstItem.messages)) {
            const lastMessage = firstItem.messages[firstItem.messages.length - 1];
            console.dir({
                type: lastMessage._getType(),
                content: lastMessage.content,
                tool_calls: lastMessage.tool_calls,
            }, {depth: null});
        }

        if ("sender" in firstItem) {
            console.log({
                sender: firstItem.sender,
            })
        }
    }

    for await (const output of await streamResults) {
        if (!output?.__end__) {
            prettifyOutput(output);
            console.log("----");
        }
    }
})();