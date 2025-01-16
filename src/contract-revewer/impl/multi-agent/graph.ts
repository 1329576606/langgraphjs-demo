import {END, START, StateGraph} from "@langchain/langgraph";
import {CodeAuditorNode, CodeCriticNode, multiLanguageNode, Router, ToolsNode} from "./nodes";
import {AgentState, NodeName} from "./state";

const workflow = new StateGraph(AgentState)
    // 2. Add the nodes; these will do the work
    .addNode(NodeName.CODE_AUDITOR, CodeAuditorNode)
    .addNode(NodeName.CODE_CRITIC, CodeCriticNode)
    .addNode(NodeName.MULTI_LANGUAGE_AGENT, multiLanguageNode)
    .addNode(NodeName.CALL_TOOL, ToolsNode);

workflow.addEdge(START, NodeName.CODE_AUDITOR);

workflow.addConditionalEdges(NodeName.CODE_AUDITOR, Router);
workflow.addConditionalEdges(NodeName.CODE_CRITIC, Router);
workflow.addConditionalEdges(NodeName.MULTI_LANGUAGE_AGENT, Router);

workflow.addConditionalEdges(
    NodeName.CALL_TOOL,
    (x) => x.sender,
);

export const graph = workflow.compile();
graph.name = "Multi-Code-Auditor-Agent";