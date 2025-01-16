import {AgentState, NodeName} from "../state";
import {RunnableConfig} from "@langchain/core/runnables";
import {getLLm} from "../llm";
import {HumanMessage, SystemMessage} from "@langchain/core/messages";
import {auditor_agent_prompt} from "../prompts";
import {AUDITOR_RESULT_SCHEMA} from "../scheam";

const llm = getLLm().withStructuredOutput(AUDITOR_RESULT_SCHEMA);

export async function codeAuditorNode(
    state: typeof AgentState.State,
    config?: RunnableConfig,
): Promise<Partial<typeof AgentState.State>> {
    const name = NodeName.CODE_AUDITOR;
    if (state.sender == NodeName.USER) {
        const code = state.code;
        const systemMessage = new SystemMessage({content: auditor_agent_prompt.replace('{topk}', '20').replace('{code}', code)});
        let auditResult = await llm.invoke([
            systemMessage
        ], config)
        return {
            messages: [systemMessage, new HumanMessage({content: 'code audit finished', name: name})],
            // @ts-ignore
            auditResult: auditResult.output_list,
            sender: name,
        };
    }
    return {sender: name};
}