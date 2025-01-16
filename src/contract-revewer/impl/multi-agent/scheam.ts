import {z} from "zod";

const VULNERABILITY_SCHEMA =
    z.array(z.object({
        function_name: z.string().describe('Function name'),
        code: z.string().describe('Original function code'),
        vulnerability: z.string().describe('Short vulnerability description'),
        reason: z.string().describe('Reason'),
    }).describe('A JSON object to describe the vulnerability')).describe('Output list')

export const AUDITOR_RESULT_SCHEMA = z.object({
    output_list: VULNERABILITY_SCHEMA
}).describe('llm output');

export const MULTI_LANGUAGE_AUDITOR_RESULT_SCHEMA = z.object({
    output_list: z.array(
        z.object({
            language: z.string().describe('language'),
            auditorResult: AUDITOR_RESULT_SCHEMA
        })
    )
}).describe('llm output');