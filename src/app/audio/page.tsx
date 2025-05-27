"use client"; // Nécessaire pour les hooks React et les API navigateur

import type React from "react";
import { useState, useRef } from "react";

export default function AudioRecorder() {
	const [isRecording, setIsRecording] = useState(false);
	const [audioURL, setAudioURL] = useState<string | null>(null);
	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);

	const handleStartRecording = async () => {
		setAudioURL(null); // Réinitialiser l'URL audio précédente

		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorderRef.current = new MediaRecorder(stream);
			audioChunksRef.current = []; // Vider les morceaux précédents

			mediaRecorderRef.current.ondataavailable = (event) => {
				if (event.data.size > 0) {
					audioChunksRef.current.push(event.data);
				}
			};

			mediaRecorderRef.current.onstop = () => {
				const audioBlob = new Blob(audioChunksRef.current, {
					type: "audio/wav",
				}); // Ou 'audio/webm', 'audio/ogg' selon le support
				const audioUrl = URL.createObjectURL(audioBlob);
				setAudioURL(audioUrl);
				// Arrêter les pistes du stream pour libérer le microphone
				for (const track of stream.getTracks()) {
					track.stop();
				}
			};

			mediaRecorderRef.current.start();
			setIsRecording(true);
		} catch (err) {
			console.error("Erreur lors de l'accès au microphone:", err);
			alert(
				"Impossible d'accéder au microphone. Veuillez vérifier les permissions.",
			);
		}
	};

	const handleStopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
		}
	};

	return (
		<div>
			<h2>Enregistreur Audio Simple</h2>
			<div>
				{!isRecording ? (
					<button
						type="button"
						onClick={handleStartRecording}
						disabled={isRecording}
					>
						Commencer l&apos;enregistrement
					</button>
				) : (
					<button
						type="button"
						onClick={handleStopRecording}
						disabled={!isRecording}
					>
						Arrêter l&apos;enregistrement
					</button>
				)}
			</div>

			{audioURL && (
				<div style={{ marginTop: "20px" }}>
					<h3>Écouter l&apos;enregistrement :</h3>
					{/* biome-ignore lint/a11y/useMediaCaption: <explanation> */}
					<audio src={audioURL} controls />
					<br />
					<a href={audioURL} download="enregistrement.wav">
						Télécharger l&apos;enregistrement
					</a>
				</div>
			)}
		</div>
	);
}
