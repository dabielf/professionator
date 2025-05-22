import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

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
		url: "https://professionator.frandab.com",
		siteName: "Professionator",
		images: [
			{
				url: "https://professionator.frandab.com/Professionator@2x.jpg",
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
				url: "https://professionator.frandab.com/Professionator@2x.jpg",
				width: 1200,
				height: 630,
				alt: "Professionator",
			},
		],
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-y-auto`}
			>
				<main>{children}</main>
			</body>
		</html>
	);
}
