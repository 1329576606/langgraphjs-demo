import {z} from "zod";

const VulnerabilitySchema =
    z.array(z.object({
        function_name: z.string().describe('Function name'),
        code: z.string().describe('Original function code'),
        vulnerability: z.string().describe('Short vulnerability description'),
        reason: z.string().describe('Reason'),
    }).describe('A JSON object to describe the vulnerability')).describe('Output list')

export const AuditorOutputSchema = z.object({
    output_list: VulnerabilitySchema
}).describe('llm output');

const CriticismSchema = z.array(z.object({
    function_name: z.string(),
    vulnerability: z.string(),
    criticism: z.string().describe('criticism for reasoning and explanation for scoring'),
    correctness: z.number().describe('0~9'),
    severity: z.number().describe('0~9'),
    profitability: z.number().describe('0~9')
}))

export const CriticOutputSchema = z.object({
    output_list: CriticismSchema
})

export const MultiLanguageAuditorResultSchema = z.object({
    output_list: z.array(
        z.object({
            language: z.string().describe('language'),
            multiLanguageOutput: z.array(z.object({
                reason: z.string(),
                vulnerability: z.string(),
                criticism: z.string(),
            }))
        })
    )
}).describe('llm output');