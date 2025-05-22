// file: components/SafariViewportFix.js (or .tsx)
"use client"; // This directive is crucial to mark it as a Client Component

import { useEffect } from "react";

const SafariViewportFix = () => {
	useEffect(() => {
		// This code will only run on the client-side after the component mounts
		if (typeof window !== "undefined") {
			// Ensure window object is available
			if (/iPad|iPhone|iPod/.test(navigator.platform)) {
				let viewportMeta = document.head.querySelector('meta[name="viewport"]');
				const targetContent =
					"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";

				if (viewportMeta) {
					// If the meta tag exists, check if its content needs updating
					if (viewportMeta.getAttribute("content") !== targetContent) {
						viewportMeta.setAttribute("content", targetContent);
						// console.log('Viewport meta tag updated for iOS Safari.'); // Optional: for debugging
					}
				} else {
					// If no viewport meta tag exists (less likely if using Next.js metadata API), create one.
					viewportMeta = document.createElement("meta");
					viewportMeta.setAttribute("name", "viewport");
					viewportMeta.setAttribute("content", targetContent);
					document.head.appendChild(viewportMeta);
					// console.log('Viewport meta tag created for iOS Safari.'); // Optional: for debugging
				}
			}
		}
	}, []); // The empty dependency array ensures this effect runs only once on mount

	return null; // This component does not render any visible UI
};

export default SafariViewportFix;
