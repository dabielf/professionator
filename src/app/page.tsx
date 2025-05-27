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
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

import { languages } from "@/modules/languages";
import posthog from "posthog-js";

const raleway = Raleway({ subsets: ["latin"] });

export default function Page() {
	const [tab, setTab] = useState("real");
	const [language, setLanguage] = useState<string | "base">("base");
	const [processingStage, setProcessingStage] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const {
		messages,
		setMessages,
		input,
		setInput,
		append,
		stop,
		error: chatError,
	} = useChat();
	const isLoading =
		messages.length === 1 && messages[0]?.role === "user" && !messages[1];
	const hasResponse = messages.length >= 2 && !!messages[1];
	const isInputDisabled = hasResponse || isLoading || !!error;

	// Handle processing stages only
	useEffect(() => {
		const timeouts: NodeJS.Timeout[] = [];

		if (isLoading) {
			setProcessingStage("Analyzing your message...");

			timeouts.push(
				setTimeout(() => {
					setProcessingStage("Making it professional...");
				}, 2000),
			);

			timeouts.push(
				setTimeout(() => {
					setProcessingStage("Almost done...");
				}, 4000),
			);
		} else {
			setProcessingStage(null);
		}

		return () => {
			for (const timeout of timeouts) {
				clearTimeout(timeout);
			}
		};
	}, [isLoading]);

	// Simple error detection
	useEffect(() => {
		if (chatError) {
			setError("Failed to process your message. Please try again.");
		}
	}, [chatError]);

	function LanguageSelector() {
		return (
			<div className="flex-1 flex items-center w-full">
				<select
					value={language}
					onChange={(e) => {
						setLanguage(e.target.value);
					}}
					className="select select-accent w-full p-2"
				>
					<option disabled={true} value="base">
						Select the language for your answer
					</option>
					{languages.map((language) => (
						<option key={language.value} value={language.value}>
							{language.label}
						</option>
					))}
				</select>
			</div>
		);
	}

	function professionalize() {
		if (!input || input.trim() === "") return;
		setTab("professional");
		setError(null); // Clear any previous errors
		posthog.capture("professionalize", {
			message: input,
			language: language === "base" ? undefined : language,
		});
		append({ content: input, role: "user" }, { body: { language } });
	}

	function retry() {
		// Simple: just clear everything and go back to input
		setError(null);
		setMessages([]);
		setTab("real");
		setProcessingStage(null);
	}

	function reset() {
		setInput("");
		setMessages([]);
		setTab("real");
		setProcessingStage(null);
		setError(null);
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
						disabled={!input || !messages[1]}
					>
						<SmilePlus className="size-4 mr-2" />
						Be Professional
					</TabsTrigger>
				</TabsList>
				<TabsContent value="real" className="flex flex-1 flex-col gap-4">
					<div className="relative flex-1">
						<textarea
							className="relative textarea flex-1 w-full bg-base-300 min-h-[30vh] text-base-content text-lg md:text-base mb-2 p-6 pr-20"
							placeholder="Be Real"
							disabled={isInputDisabled}
							value={input}
							onChange={(event) => {
								setInput(event.target.value);
							}}
							onKeyDown={async (event) => {
								if (event.key === "Enter" && !event.shiftKey) {
									event.stopPropagation();
									event.preventDefault();
									professionalize();
								}
							}}
						/>
						{input && (
							<div className="absolute bottom-4 right-4 text-sm text-base-content/60 bg-base-100/80 px-2 py-1 rounded">
								{input.length} chars
							</div>
						)}
					</div>
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
								disabled={!input || input.trim() === "" || isInputDisabled}
								onClick={() => professionalize()}
							>
								{isLoading ? (
									<span className="loading loading-spinner loading-sm" />
								) : (
									<RotateCcw className="size-4" />
								)}
								{isLoading ? "Processing..." : "Professionalize"}
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
							<div className="relative flex-1 bg-base-300 text-base-content/80 p-6 font-mono text-lg md:text-base overflow-y-auto">
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
					) : error ? (
						<div className="flex flex-col flex-1 text-lg items-center justify-center text-center mt-8 gap-4">
							<div className="text-xl font-semibold text-error">
								Oops! Something went wrong
							</div>
							<div className="text-sm text-base-content/70 max-w-md">
								{error}
							</div>
							<div className="flex flex-col gap-2">
								<button
									type="button"
									className="btn btn-accent btn-lg"
									onClick={retry}
								>
									<RotateCcw className="size-4" />
									Try Again
								</button>
								<button type="button" className="btn btn-ghost" onClick={reset}>
									Start Over
								</button>
							</div>
							{input && (
								<div className="text-xs text-base-content/50 mt-2">
									{input.length} characters •{" "}
									{language !== "base" ? language : "Default language"}
								</div>
							)}
						</div>
					) : (
						<div className="flex flex-col flex-1 text-lg items-center justify-center text-center mt-8 gap-4">
							<div className="text-xl font-semibold">
								{processingStage || "Analyzing your message..."}
							</div>
							<div className="text-sm text-base-content/70 max-w-md">
								{isLoading
									? "We are crafting the perfect professional response"
									: "Getting ready to professionalize"}
							</div>
							<div className="flex items-center gap-2">
								<span className="loading loading-dots loading-lg text-accent" />
								<span className="text-sm">Processing</span>
							</div>
							{input && (
								<div className="text-xs text-base-content/50 mt-2">
									{input.length} characters •{" "}
									{language !== "base" ? language : "Default language"}
								</div>
							)}
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
