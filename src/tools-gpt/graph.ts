import {AIMessage} from "@langchain/core/messages";
import {END, MemorySaver, START, StateGraph} from "@langchain/langgraph";
import {ToolNode} from "@langchain/langgraph/prebuilt";
import {ChatOpenAI} from "@langchain/openai";
import {GraphAnnotation} from "./state";
import {tools} from "./tools";


const toolNode = new ToolNode(tools);

const llm = new ChatOpenAI({
    model: process.env["MODULE"],
    temperature: 0,
    // verbose: true
}, {
    apiKey: process.env['OPENAI_API_KEY'],
    baseURL: process.env["OPENAPI_URL"],
}).bindTools(tools);

// Define the function that determines whether to continue or not
// We can extract the state typing via `GraphAnnotation.State`
function shouldContinue(state: typeof GraphAnnotation.State) {
    console.log(`\n\nshouldContinue state:\n ${JSON.stringify(state)}`);

    const messages = state.messages;
    const lastMessage = messages[messages.length - 1] as AIMessage;

    // If the LLM makes a tool call, then we route to the "tools" node
    if (lastMessage.tool_calls?.length) {
        return "tools";
    }
    // Otherwise, we stop (reply to the user)
    return END;
}

// Define the function that calls the model
async function callModel(state: typeof GraphAnnotation.State) {
    console.log(`\n\ncallModel state:\n ${JSON.stringify(state)}`);

    const messages = state.messages;
    const response = await llm.invoke(messages);
    console.log("callModel response\n", JSON.stringify(response));

    // We return a list, because this will get added to the existing list
    return {messages: [response]};
}

// Define a new graph
const builder = new StateGraph(GraphAnnotation)
    .addNode("agent", callModel)
    .addNode("tools", toolNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent");

// Initialize memory to persist state between graph runs
const checkpointer = new MemorySaver();

// Finally, we compile it!
// This compiles it into a LangChain Runnable.
// Note that we're (optionally) passing the memory when compiling the graph
export const graph = builder.compile({checkpointer});
graph.name = "ToolsAgent";
