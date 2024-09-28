import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export async function generateGraph(
	formData: FormData,
) {
	try {
		const response = await fetch('http://localhost:3000/api/generate_graph', {
			method: 'POST',
			body: formData,  // Enviar FormData
		});

		if (!response.ok) {
			throw new Error('Error al generar el gráfico');
		}

		const data = await response.json();
		return data.graph;
	} catch (error: any) {
		console.error('Error:', error);
		alert(error.message);
	}
}
