import {AgentState} from "../state";
import {ToolNode} from "@langchain/langgraph/prebuilt";

export const toolNode = new ToolNode<typeof AgentState.State>([]);
