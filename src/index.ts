import { HumanMessage } from "@langchain/core/messages";
import { config } from 'dotenv';
import { graph } from "./graph";
config();
(async function main() {
  const finalState = await graph.invoke(
    { messages: [new HumanMessage("什么是LangChain？")] },
    { configurable: { thread_id: "42" } }
  );

  console.log(finalState.messages[finalState.messages.length - 1].content);
})();