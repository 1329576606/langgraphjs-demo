import {AgentState} from "../state";
import {ToolNode} from "@langchain/langgraph/prebuilt";

export const ToolsNode = new ToolNode<typeof AgentState.State>([]);
