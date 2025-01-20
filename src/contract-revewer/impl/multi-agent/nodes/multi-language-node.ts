import {getLLm} from "../llm";
import {AgentState, AuditResult, NodeName} from "../state";
import {RunnableConfig} from "@langchain/core/runnables";
import {HumanMessage, SystemMessage} from "@langchain/core/messages";
import {multi_language_prompt} from "../prompts";
import {jsonParse} from "../../../utiils";

const llm = getLLm();

// .withStructuredOutput(MultiLanguageAuditorResultSchema);

export async function multiLanguageNode(
    state: typeof AgentState.State,
    config?: RunnableConfig,
): Promise<Partial<typeof AgentState.State>> {
    const name = NodeName.MULTI_LANGUAGE_AGENT;
    if (state.auditOutput && state.multiLanguage.length > 0) {
        const systemMessage = new SystemMessage({
            content: multi_language_prompt
                .replace('{language}', state.multiLanguage.join(','))
                .replace('{audit_result}', JSON.stringify(state.criticOutput.map(critic => ({
                        reason: critic.reason,
                        vulnerability: critic.vulnerability,
                        criticism: critic.criticism
                    })
                )))
        });
        let multiLanguageOutput = jsonParse((await llm.invoke([
            systemMessage
        ], config)).content as string).output_list as Record<string, any>;
        return {
            messages: [systemMessage, new HumanMessage({content: 'translate finished', name: name})],
            // @ts-ignore
            multiLanguageCriticOutput: multiLanguageOutput.reduce((record, b) => {
                record[b.language] = b.multiLanguageOutput.map((item: any, index: number) => ({
                    ...state.criticOutput[index],
                    ...item,
                }));
                return record;
            }, {} as Record<string, AuditResult>),
            sender: name,
        };
    }
    return {};
}