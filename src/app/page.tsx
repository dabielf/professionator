"use client";

import { useChat } from "@ai-sdk/react";
import { Raleway } from "next/font/google";
import {
	AngryIcon,
	SmilePlus,
	Clipboard,
	ChevronsRight,
	RotateCcw,
} from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import { languages } from "@/modules/languages";
import posthog from "posthog-js";

const raleway = Raleway({ subsets: ["latin"] });

export default function Page() {
	const [tab, setTab] = useState("real");
	const [language, setLanguage] = useState<string | "base">("base");
	const { messages, setMessages, input, setInput, append, stop } = useChat();

	console.log(language);

	function LanguageSelector() {
		return (
			<div className="flex-1 flex items-center w-full">
				<select
					value={language}
					onChange={(e) => {
						setLanguage(e.target.value);
					}}
					className="select select-accent w-full"
				>
					<option disabled={true} value="base">
						Select the language for your answer
					</option>
					{languages.map((language) => (
						<option key={language.value}>{language.label}</option>
					))}
				</select>
			</div>
		);
	}

	function professionalize() {
		if (!input || input.trim() === "") return;
		setTab("professional");
		posthog.capture("professionalize", {
			message: input,
			language: language === "base" ? undefined : language,
		});
		append({ content: input, role: "user" }, { body: { language } });
	}

	function reset() {
		setInput("");
		setMessages([]);
		setTab("real");
		stop();
	}

	return (
		<div className={`flex flex-col w-full h-full p-2 ${raleway.className}`}>
			<h1 className="text-4xl font-semibold text-center mt-6">
				PROFESSIONATOR{" "}
			</h1>
			<h2 className="text-center flex items-center justify-center text-sm mb-6">
				Speak your mind <ChevronsRight className="size-4 mx-2" />
				Be Professional
			</h2>
			<Tabs value={tab} onValueChange={setTab} className="w-full h-full flex">
				<TabsList className="w-full">
					<TabsTrigger value="real" className="flex-1 text-base">
						<AngryIcon className="size-4 mr-2" />
						Be Real
					</TabsTrigger>
					<TabsTrigger
						value="professional"
						className="flex-1 text-base"
						disabled={!input}
					>
						<SmilePlus className="size-4 mr-2" />
						Be Professional
					</TabsTrigger>
				</TabsList>
				<TabsContent value="real" className="flex flex-1 flex-col gap-4">
					<textarea
						className="relative textarea flex-1 w-full bg-base-300 min-h-[30vh] text-white text-lg md:text-base mb-2 p-6"
						placeholder="Be Real"
						disabled={!!messages[1]}
						value={input}
						onChange={(event) => {
							setInput(event.target.value);
						}}
						onKeyDown={async (event) => {
							if (event.key === "Enter") {
								event.stopPropagation();
								event.preventDefault();
								if (!input || input.trim() === "") return;
								setTab("professional");
								append({ content: input, role: "user" });
							}
						}}
					/>
					{messages[1] ? (
						<button
							type="button"
							className="btn btn-primary btn-lg py-4"
							onClick={() => reset()}
						>
							<RotateCcw className="size-4" />
							Start a new one
						</button>
					) : (
						<div className="flex flex-col md:flex-row gap-4 items-center">
							<LanguageSelector />
							<button
								type="button"
								className="btn flex-1 w-full md:w-auto btn-accent btn-lg py-2"
								disabled={!input || input.trim() === ""}
								onClick={() => professionalize()}
							>
								<RotateCcw className="size-4" />
								Professionalize
							</button>
						</div>
					)}
				</TabsContent>
				<TabsContent
					value="professional"
					className="flex flex-1 flex-col gap-4"
				>
					{messages[1] ? (
						<div className="w-full flex flex-1 flex-col gap-4">
							<div className="relative flex-1 bg-base-300 text-white/80 p-6 font-mono text-lg md:text-base overflow-y-auto">
								{messages[1].content}
							</div>
							<div className="flex flex-col gap-2">
								<button
									type="button"
									className="btn btn-lg btn-accent flex-1 py-4"
									onClick={() => {
										navigator.clipboard.writeText(messages[1].content);
										toast.success(
											"Your VERY professional message has been copied to clipboard!",
											{
												style: {
													fontFamily: "var(--font-raleway)",
													fontSize: "1rem",
													fontWeight: "normal",
												},
											},
										);
									}}
								>
									<Clipboard className="size-4" />
									Copy to clipboard
								</button>
								<button
									type="button"
									className="btn btn-lg btn-primary flex-2 py-4"
									onClick={() => reset()}
								>
									<RotateCcw className="size-4" />
									Write a new message
								</button>
							</div>
						</div>
					) : (
						<div className="flex flex-col flex-1 text-lg items-center justify-center text-center mt-8">
							Making it <br />
							as professional <br />
							as can be
							<span className="mt-2 loading loading-dots loading-md" />
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
