import '../env';
import {getLLm} from "../contract-revewer/impl/multi-agent/llm";
import {z} from "zod";
import {HumanMessage, SystemMessage} from "@langchain/core/messages";
import {franc} from 'franc'

const llm = getLLm();
console.log(llm)

const SYSTEM_PROMPT = `You are a professional Web3 domain analyst and question classification assistant. You need to extract questions from user input and classify them.

Question classification rules:
1. Categorize questions into three types:
   - people: A person's name or keyword
   - project: The name or keyword of the project
   - crypto_token: The name or keyword of the crypto token
2. A single user input may contain multiple questions, which need to be extracted and classified separately
3. Do not modify the original content of the user's questions
4. Don't use vague phrases such as "his project" in the results
`;

// const SYSTEM_PROMPT = `你是一个专业的web3领域分析师和问题分类助手。你需要从用户的输入中提取出问题并进行分类。
//
// 问题分类规则:
// 1. 将问题分为三类：
//    - People: 与人物相关的问题，需提取人名
//    - Project: 与项目相关的问题，需提取项目名称
//    - General: 通用问题
// 2. 一段用户输入可能包含多个问题，需要分别提取和分类
// 3. 不要修改用户的原始问题内容
// 4. 结果中不要使用模糊的短语，如“他的token”
// `;


const ClassificationSchema = z.object({
    people: z.array(z.string().describe('A person\'s name or a person\'s keyword'))
        .describe('If there is no match, an empty array is output').optional(),
    project: z.array(z.string().describe('The name of the project or project keywords'))
        .describe('If there is no match, an empty array is output').optional(),
    crypto_token: z.array(z.string().describe('The name of the token or token keywords'))
        .describe('If there is no match, an empty array is output').optional(),
});

const TranslationSchema = z.object({
    output: z.object({
        original_language: z.string().describe('original language'),
        results: z.string().describe('translation results'),
    }).optional().describe('If no translation is needed, this field will be left empty.')
});

(async function () {
    const question = 'Introduce me to Trump and their project';
    // const francRes = franc(question);
    // console.log(francRes);
    // const question = 'Introduce Trump and his projects.';
    const translationResult = await llm.withStructuredOutput(TranslationSchema)
        .invoke([new SystemMessage('You are a professional, authentic machine translation engine.If no translation is needed, this field will be left empty.'),new HumanMessage(`Treat next line as plain text input and translate it into English.If translation is unnecessary (e.g. proper nouns, codes, etc.), return the original text. NO explanations. NO notes. Input:\n${question}`)]);
    console.log(translationResult);
    const englishQuestion = translationResult.output ? translationResult.output.results : question;
    const res =
        await llm.withStructuredOutput(ClassificationSchema)
            .invoke([new SystemMessage(SYSTEM_PROMPT), new HumanMessage(englishQuestion)]);
    console.log(JSON.stringify(res));
})();