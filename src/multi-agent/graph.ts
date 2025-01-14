import { END, START, StateGraph } from "@langchain/langgraph";
import {chartNode, researchNode, router, toolNode} from "./nodes";
import {AgentState} from "./state";

// 1. Create the graph
const workflow = new StateGraph(AgentState)
    // 2. Add the nodes; these will do the work
    .addNode("Researcher", researchNode)
    .addNode("ChartGenerator", chartNode)
    .addNode("call_tool", toolNode);


workflow.addEdge(START, "Researcher");

// 3. Define the edges. We will define both regular and conditional ones
// After a worker completes, report to supervisor
workflow.addConditionalEdges("Researcher", router, {
    // We will transition to the other agent
    continue: "ChartGenerator",
    call_tool: "call_tool",
    end: END,
});

workflow.addConditionalEdges("ChartGenerator", router, {
    // We will transition to the other agent
    continue: "Researcher",
    call_tool: "call_tool",
    end: END,
});

workflow.addConditionalEdges(
    "call_tool",
    // Each agent node updates the 'sender' field
    // the tool calling node does not, meaning
    // this edge will route back to the original agent
    // who invoked the tool
    (x) => x.sender,
    {
        Researcher: "Researcher",
        ChartGenerator: "ChartGenerator",
    },
);

export const graph = workflow.compile();
graph.name = "Multi-Agent";

