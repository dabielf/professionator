import type { Viewport } from "next";
import { Geist_Mono } from "next/font/google";
import { Raleway } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { PostHogProvider } from "./providers";

import SafariViewportFix from "@/components/safari-viewport-fix";

const raleway = Raleway({ variable: "--font-raleway", subsets: ["latin"] });

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1.0,
	maximumScale: 1.0,
	userScalable: false,
};

export async function generateMetadata() {
	const title = process.env.PRODUCTION
		? "Professionator"
		: "LOCAL: Communicator";
	const url = process.env.PRODUCTION
		? process.env.PRODUCTION_URL
		: "http://localhost:3000";

	return {
		title,
		description: "Stay professional while respecting your inner asshole",
		openGraph: {
			title,
			description: "Stay professional while respecting your inner asshole",
			type: "website",
			url,
			siteName: "Professionator",
			images: [
				{
					url: `${url}/Professionator@2x.jpg`,
					width: 1200,
					height: 630,
					alt: "Professionator",
				},
			],
		},
		twitter: {
			title,
			description: "Stay professional while respecting your inner asshole",
			card: "summary_large_image",
			images: [
				{
					url: `${url}/Professionator@2x.jpg`,
					width: 1200,
					height: 630,
					alt: "Professionator",
				},
			],
		},
	};
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${raleway.variable} ${geistMono.variable} antialiased overflow-y-auto h-[100dvh] text-xl md:text-lg`}
			>
				<main>
					<PostHogProvider>{children}</PostHogProvider>
					<Toaster richColors position="top-center" />
					<SafariViewportFix />
				</main>
			</body>
		</html>
	);
}
