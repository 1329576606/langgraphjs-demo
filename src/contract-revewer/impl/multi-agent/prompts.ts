// ####### Basic Prompt ########
const topk_prompt1: string = 'Output {topk} most severe vulnerabilities.\n'
const topk_prompt2: string = 'If no vulnerability is detected, you should only output in this json format {"output_list": []}.\n'
// ####### Auditor Prompt #######
const auditor_prompt: string = 'You are a smart contract auditor, identify and explain severe vulnerabilities in the provided smart contract. Make sure that they are exploitable in real world and beneficial to attackers. Provide each identified vulnerability with intermediate reasoning and its associated function. Remember, you must provide the entire function code and do not use "...". Make your reasoning comprehensive and detailed. Smart contract code:\n\n {code}'
const auditor_format_constrain: string = `\nYou should only output in below json format:
{
    "output_list": [
        {
            "function_name": "<function_name_1>",
            "code": "<original_function_code_1>",
            "vulnerability": "<short_vulnera_desc_1>",
            "reason": "<reason_1>"
        },
        {
            "function_name": "<function_name_2>",
            "code": "<original_function_code_2>",
            "vulnerability": "<short_vulnera_desc_2>",
            "reason": "<reason_2>"
        }
    ]
}
`
export const auditor_agent_prompt = auditor_prompt +
    // auditor_format_constrain +
    topk_prompt1 + topk_prompt2;

export const multi_language_prompt = `Please translate the audit results into [{language}].
audit result:

{audit_result}
`
