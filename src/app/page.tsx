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

const raleway = Raleway({ subsets: ["latin"] });

export default function Page() {
	const { messages, setMessages, input, setInput, append, stop } = useChat();
	const [tab, setTab] = useState("real");

	function professionalize() {
		setTab("professional");
		append({ content: input, role: "user" });
	}

	function reset() {
		setInput("");
		setMessages([]);
		setTab("real");
		stop();
	}

	return (
		<div className={`flex flex-col w-full h-screen p-2 ${raleway.className}`}>
			<h1 className="text-4xl font-semibold text-center mt-6">
				PROFESSIONATOR{" "}
			</h1>
			<h2 className="text-center flex items-center justify-center text-sm mb-6">
				Speak your mind <ChevronsRight className="size-4 mx-2" />
				Be Professional
			</h2>
			<Tabs value={tab} onValueChange={setTab} className="w-full h-full flex">
				<TabsList className="w-full">
					<TabsTrigger value="real" className="flex-1">
						<AngryIcon className="size-4 mr-2" />
						Be Real
					</TabsTrigger>
					<TabsTrigger
						value="professional"
						className="flex-1"
						disabled={!input}
					>
						<SmilePlus className="size-4 mr-2" />
						Be Professional
					</TabsTrigger>
				</TabsList>
				<TabsContent value="real" className="flex flex-1 flex-col gap-4">
					<textarea
						className="relative textarea flex-1 w-full bg-base-300 text-white text-lg p-6"
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
								setTab("professional");
								append({ content: input, role: "user" });
							}
						}}
					/>
					{messages[1] ? (
						<button
							type="button"
							className="btn btn-primary py-4"
							onClick={() => reset()}
						>
							<RotateCcw className="size-4" />
							Start a new one
						</button>
					) : (
						<button
							type="button"
							className="btn btn-accent py-4"
							onClick={() => professionalize()}
						>
							<RotateCcw className="size-4" />
							Professionalize
						</button>
					)}
				</TabsContent>
				<TabsContent
					value="professional"
					className="flex flex-1 flex-col gap-4"
				>
					{messages[1] ? (
						<div className="w-full flex flex-1 flex-col gap-4">
							<div className="relative flex-1 bg-base-300 text-white/80 p-6 font-mono text-sm overflow-y-auto">
								{messages[1].content}
							</div>
							<div className="flex gap-2">
								<button
									type="button"
									className="btn btn-primary flex-2 py-4"
									onClick={() => reset()}
								>
									<RotateCcw className="size-4" />
									New one
								</button>
								<button
									type="button"
									className="btn btn-accent flex-1"
									onClick={() =>
										navigator.clipboard.writeText(messages[1].content)
									}
								>
									<Clipboard className="size-4" />
									Copy
								</button>
							</div>
						</div>
					) : (
						<div className="flex flex-1 items-center justify-center">
							Making it professional{" "}
							<span className="mr-2 loading loading-dots loading-md" />
						</div>
					)}
				</TabsContent>
			</Tabs>
		</div>
	);
}
