import {getLLm} from "../llm";
import {MULTI_LANGUAGE_AUDITOR_RESULT_SCHEMA} from "../scheam";
import {AgentState, AuditResult, NodeName} from "../state";
import {RunnableConfig} from "@langchain/core/runnables";
import {HumanMessage, SystemMessage} from "@langchain/core/messages";
import {multi_language_prompt} from "../prompts";

const llm = getLLm().withStructuredOutput(MULTI_LANGUAGE_AUDITOR_RESULT_SCHEMA);

export async function multiLanguageNode(
    state: typeof AgentState.State,
    config?: RunnableConfig,
): Promise<Partial<typeof AgentState.State>> {
    const name = NodeName.MULTI_LANGUAGE_AGENT;
    if (state.auditResult && state.multiLanguage.length > 0) {
        const systemMessage = new SystemMessage({
            content: multi_language_prompt
                .replace('{language}', state.multiLanguage.join(','))
                .replace('{audit_result}', JSON.stringify(state.auditResult))
        });
        let auditResult = await llm.invoke([
            systemMessage
        ], config)
        return {
            messages: [systemMessage, new HumanMessage({content: 'translate finished', name: name})],
            multiLanguageAuditResult: auditResult.output_list.reduce((record,b)=>{
                // @ts-ignore
                record[b.language]=b.auditorResult.output_list;
                return record;
            },{} as Record<string, AuditResult>),
            sender: name,
        };
    }
    return {};
}