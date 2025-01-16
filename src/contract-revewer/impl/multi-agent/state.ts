import {BaseMessage} from "@langchain/core/messages";
import {Annotation} from "@langchain/langgraph";
import {CodeCriticNode} from "./nodes";

export enum NodeName {
    USER = 'user',
    CODE_AUDITOR = 'code_auditor',
    CODE_CRITIC = 'code_critic',
    MULTI_LANGUAGE_AGENT = 'multi_language_agent',
    CALL_TOOL = "call_tool"
}

export type AuditResult = Array<{
    function_name: string,
    code: string,
    vulnerability: string,
    reason: string
}>

export type CriticResult = Array<{
    function_name: string,
    vulnerability: string,
    criticism: string,
    correctness: number,
    severity: number,
    profitability: number,
    code: string,
    reason: string,
    final_score: number,
}>

// This defines the object that is passed between each node
// in the graph. We will create different nodes for each agent and tool
export const AgentState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
        reducer: (x, y) => x.concat(y),
        default: () => [],
    }),
    code: Annotation<string>({
        reducer: (x, y) => y ?? x,
    }),
    sender: Annotation<NodeName>({
        reducer: (x, y) => y ?? x,
        default: () => NodeName.USER,
    }),
    multiLanguage: Annotation<Array<string>>({
        reducer: (x, y) => y ?? x,
        default: () => [],
    }),
    auditOutput: Annotation<AuditResult>({
        reducer: (x, y) => y ?? x,
        default: () => undefined,
    }),
    criticOutput: Annotation<CriticResult>({
        reducer: (x, y) => y ?? x,
        default: () => undefined,
    }),
    multiLanguageCriticOutput: Annotation<Record<string, CriticResult>>({
        reducer: (x, y) => y ?? x,
        default: () => ({} as Record<string, CriticResult>),
    }),
})