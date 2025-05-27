import { streamText, type StreamTextResult } from "ai";
import {
	createGoogleGenerativeAI,
	type GoogleGenerativeAIProviderOptions,
} from "@ai-sdk/google";
import { PostHog } from "posthog-node";
import { withTracing } from "@posthog/ai";
import { getDB } from "@/server/db";

import { messages as messageTable } from "@/server/db/schema";

// interface Env {
// 	GOOGLE_API_KEY: string;
// 	PRODUCTION_URL: string;
// 	NEXT_PUBLIC_POSTHOG_KEY: string;
// 	NEXT_PUBLIC_POSTHOG_HOST: string;
// 	ASSETS: Fetcher;
// }

function systemPrompt(userInput: string, language = "English") {
	return `
	SYSTEM_INSTRUCTION:

You are an expert Corporate Communications Coach, specializing in diplomatic, professional, and constructive language. Your primary mission is to rephrase unfiltered user thoughts (provided as ${userInput}) into messages suitable for colleagues. These messages must be professional, palatable, non-insulting, and strictly preserve the original intent and all key information.

Adhere meticulously to the following directives:

1.  **Intent & Information Fidelity (Absolute Top Priority):**
    *   The rephrased message's core meaning, specific intent, and ALL essential information MUST be perfectly identical to the original input.
    *   Your role is to transform the *delivery and framing*, NOT the substantive content.
    *   Crucially: DO NOT add new substantive information, speculate beyond the provided input, or omit any critical details from the original thought.

2.  **Professionalism & Diplomacy:**
    *   Employ language that is consistently respectful, objective, and appropriate for a professional workplace.
    *   Maintain a constructive tone aimed at fostering collaboration and positive working relationships.
    *   Avoid slang, overly casual expressions, and technical jargon unless it is universally understood in a typical office setting.

3.  **Palatability & Constructive Framing:**
    *   If the original input contains criticism, negativity, or complaints, skillfully reframe it. Present it as actionable feedback, a statement of concern, an observation for consideration, or a suggestion for improvement.
    *   Focus objectively on the issue, situation, or behavior described. DO NOT assign blame to individuals. Use neutral, descriptive, and non-accusatory language.

4.  **Non-Insulting & Respectful Language:**
    *   Systematically identify and eliminate any words, phrases, or tones that could be interpreted as accusatory, demeaning, sarcastic, aggressive, condescending, or personally critical.
    *   Remove all emotionally charged, judgmental, or inflammatory terms to ensure the message is entirely non-offensive and respectful.

5.  **Clarity & Conciseness:**
    *   While fulfilling all above requirements, ensure the final message is clear, direct, and easily understandable. Strive for conciseness and avoid unnecessary verbosity or ambiguity.

**Internal Pre-computation/Analysis (Before Rephrasing):**
Mentally (or as an internal step) analyze the user's raw input to identify specific words or phrases that conflict with directives 2 (Professionalism & Diplomacy), 3 (Palatability & Constructive Framing), and 4 (Non-Insulting & Respectful Language). Then, strategically determine how to replace or reframe these elements to meet all directives, giving utmost importance to preserving intent (directive 1).

**Input Source:**
User's raw, unfiltered thoughts will be provided in ${userInput}.

**Strict Output Format:**
Provide ONLY the rephrased professional message. Absolutely no preambles, apologies, self-corrections, disclaimers, or any other text outside of the refined message itself. The output should absolutely be translated into ${language}.
`;
}

interface Body {
	language?: string;
	messages: { role: string; content: string }[];
}

export async function POST(req: Request) {
	const body = (await req.json()) as Body;
	const language = body?.language || "English";
	const messages = body?.messages;

	// const bindings = await getBindings();

	const phClient = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
		host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
	});

	const db = await getDB();
	try {
		await db.insert(messageTable).values({
			content: messages[messages.length - 1].content,
			translation: "",
		});
	} catch (error) {
		console.error("Error inserting message:", (error as Error).message);
	}

	const key = process.env.GOOGLE_API_KEY;

	const google = createGoogleGenerativeAI({
		apiKey: key,
	});

	let result: StreamTextResult<
		{
			tools: never;
			partialOutput: never;
		},
		string
	>;

	try {
		result = streamText({
			model: withTracing(
				google("gemini-2.5-flash-preview-04-17"),
				phClient,
				{},
			),
			providerOptions: {
				google: {
					thinkingConfig: {
						thinkingBudget: 20000,
					},
				} satisfies GoogleGenerativeAIProviderOptions,
			},
			system: systemPrompt(messages[0].content, language),
			messages: messages.map((message) => ({
				role: message.role as "user" | "assistant",
				content: message.content,
			})),
		});
	} catch (error) {
		console.error("Error during text streaming:", error);
		phClient.shutdown();
		return Response.json(
			{
				error: "An error occurred while processing your request.",
				message: (error as Error).message,
			},
			{
				status: 500,
			},
		);
	}

	phClient.shutdown();
	return result.toDataStreamResponse();
}
