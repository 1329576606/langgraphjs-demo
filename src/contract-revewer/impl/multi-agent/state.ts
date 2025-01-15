import {BaseMessage} from "@langchain/core/messages";
import {Annotation} from "@langchain/langgraph";

export enum NodeName {
    USER = 'user',
    CODE_AUDITOR = 'code_auditor',
    CALL_TOOL = "call_tool"
}

// This defines the object that is passed between each node
// in the graph. We will create different nodes for each agent and tool
export const AgentState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
        reducer: (x, y) => x.concat(y),
    }),
    code: Annotation<string>({
        reducer: (x, y) => x ?? y,
    }),
    sender: Annotation<NodeName>({
        reducer: (x, y) => y ?? x ?? NodeName.USER,
        default: () => NodeName.USER,
    }),
})