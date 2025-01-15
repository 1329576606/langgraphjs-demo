import {END, START, StateGraph} from "@langchain/langgraph";
import {codeAuditorNode, router, toolNode} from "./nodes";
import {AgentState, NodeName} from "./state";

const workflow = new StateGraph(AgentState)
    // 2. Add the nodes; these will do the work
    .addNode(NodeName.CODE_AUDITOR, codeAuditorNode)
    .addNode(NodeName.CALL_TOOL, toolNode);

workflow.addEdge(START, NodeName.CODE_AUDITOR);

workflow.addConditionalEdges(NodeName.CODE_AUDITOR, router);

workflow.addConditionalEdges(
    NodeName.CALL_TOOL,
    (x) => x.sender,
);

export const graph = workflow.compile();
graph.name = "Multi-Code-Auditor-Agent";