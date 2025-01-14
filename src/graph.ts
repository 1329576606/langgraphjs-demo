import { AIMessage } from "@langchain/core/messages";
import { tool } from "@langchain/core/tools";
import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { config } from 'dotenv';
import { z } from "zod";
import { ConfigurationAnnotation } from "./configuration";
import { GraphAnnotation } from "./state";
config();

// Define the tools for the agent to use
const weatherTool = tool(async ({ query }) => {
  console.log(`\n\nweatherTool:\n ${query}`);
  // This is a placeholder for the actual implementation
  if (query.toLowerCase().includes("sf") || query.toLowerCase().includes("san francisco")) {
    return "It's 60 degrees and foggy."
  }
  return "It's 90 degrees and sunny."
}, {
  name: "weather",
  description:
    "Call to get the current weather for a location.",
  schema: z.object({
    query: z.string().describe("The query to use in your search."),
  }),
});

const tools = [weatherTool];
const toolNode = new ToolNode(tools);

const model = new ChatOpenAI({
  model: process.env["MODULE"],
  temperature: 0
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
  const response = await model.invoke(messages);
  console.log("callModel response\n", JSON.stringify(response));

  // We return a list, because this will get added to the existing list
  return { messages: [response] };
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
export const graph = builder.compile({ checkpointer });
graph.name = "MemoryAgent";
