import {AgentState, AuditResult, NodeName} from "../state";
import {RunnableConfig} from "@langchain/core/runnables";
import {getLLm} from "../llm";
import {HumanMessage, SystemMessage} from "@langchain/core/messages";
import {auditor_agent_prompt} from "../prompts";
import {jsonParse} from "../../../utiils";

const llm = getLLm();

// .withStructuredOutput(AuditorOutputSchema);

export async function CodeAuditorNode(
    state: typeof AgentState.State,
    config?: RunnableConfig,
): Promise<Partial<typeof AgentState.State>> {
    const name = NodeName.CODE_AUDITOR;
    if (state.sender == NodeName.USER) {
        const code = state.code;
        const systemMessage = new SystemMessage({content: auditor_agent_prompt.replace('{topk}', '20').replace('{code}', code)});
        let auditOutput = jsonParse((await llm.invoke([
            systemMessage
        ], config)).content as string).output_list as AuditResult;
        return {
            messages: [systemMessage, new HumanMessage({content: 'code audit finished', name: name})],
            auditOutput: auditOutput,
            sender: name,
        };
    }
    return {sender: name};
}