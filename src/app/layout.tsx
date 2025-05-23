import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Raleway } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

import SafariViewportFix from "@/components/safari-viewport-fix";

const raleway = Raleway({ variable: "--font-raleway", subsets: ["latin"] });

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Professionator",
	description: "Stay professional while respecting your inner asshole",
	openGraph: {
		title: "Professionator",
		description: "Stay professional while respecting your inner asshole",
		type: "website",
		url: process.env.PRODUCTION
			? process.env.PRODUCTION_URL
			: "http://localhost:3000",
		siteName: "Professionator",
		images: [
			{
				url: process.env.PRODUCTION
					? `${process.env.PRODUCTION_URL}/Professionator@2x.jpg`
					: "http://localhost:3000/Professionator@2x.jpg",
				width: 1200,
				height: 630,
				alt: "Professionator",
			},
		],
	},
	twitter: {
		title: "Professionator",
		description: "Stay professional while respecting your inner asshole",
		card: "summary_large_image",
		images: [
			{
				url: process.env.PRODUCTION
					? `${process.env.PRODUCTION_URL}/Professionator@2x.jpg`
					: "http://localhost:3000/Professionator@2x.jpg",
				width: 1200,
				height: 630,
				alt: "Professionator",
			},
		],
	},
	viewport: {
		width: "device-width",
		initialScale: 1.0,
		maximumScale: 1.0, // This is key for the zoom issue
		userScalable: false, // Next.js will translate this to user-scalable=no
	},
};

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
					{children}
					<Toaster richColors position="top-center" />
					<SafariViewportFix />
				</main>
			</body>
		</html>
	);
}
