import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { Raleway } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

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
			<meta
				name="viewport"
				content="width=device-width, initial-scale=1.0, user-scalable=no"
			/>
			<body
				className={`${raleway.variable} ${geistMono.variable} antialiased overflow-y-auto h-[100dvh] text-xl md:text-lg`}
			>
				<main>
					{children}
					<Toaster richColors position="top-center" />
				</main>
			</body>
		</html>
	);
}
