import {AgentState, CriticResult, NodeName} from "../state";
import {RunnableConfig} from "@langchain/core/runnables";
import {getLLm} from "../llm";
import {HumanMessage, SystemMessage} from "@langchain/core/messages";
import {critic_prompt} from "../prompts";
import {jsonParse} from "../../../utiils";

const llm = getLLm();

// .withStructuredOutput(CriticOutputSchema);

export async function CodeCriticNode(
    state: typeof AgentState.State,
    config?: RunnableConfig,
): Promise<Partial<typeof AgentState.State>> {
    const name = NodeName.CODE_CRITIC;
    const auditOutput = state.auditOutput;
    const systemMessage = new SystemMessage({content: critic_prompt.replace('{audit_result}', JSON.stringify(auditOutput))});
    let criticOutput = jsonParse((await llm.invoke([
        systemMessage
    ], config)).content as string).output_list as CriticResult;
    return {
        messages: [systemMessage, new HumanMessage({content: 'code critic finished', name: name})],
        sender: name,
        // @ts-ignore
        criticOutput: criticOutput
            .map((critic, index) => {
                return {
                    ...critic,
                    code: auditOutput[index].code,
                    reason: auditOutput[index].reason,
                    final_score: 0.5 * critic.correctness + 0.25 * critic.severity + 0.25 * critic.profitability
                }
            })
            .sort((a, b) => b.final_score - a.final_score)
    };
}