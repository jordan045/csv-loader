'use client'

import Image from 'next/image'
import Link from 'next/link'
import FileUpload from './ui/FileUpload'
import Header from './ui/header'
import { useState } from 'react'

import CardWrapper from './ui/cardWrapper'

export default function Home() {
	const [graphs, setGraphs] = useState<string[]>([]); // Cambia el estado a un arreglo de gráficos

	const handleGraphGenerated = (graph: string) => {
		setGraphs((prevGraphs) => [graph, ...prevGraphs]); // Agrega el nuevo gráfico al arreglo
	};

	return (
		<main className="flex flex-col min-h-screen justify-between pt-10 w-11/12 mx-auto">
			<Header />
			<div className="flex flex-row mt-2">
				<div className="flex justify-start w-1/2">
					<CardWrapper graphs={graphs} />
				</div>
				<div className="flex justify-end w-1/2">
					<FileUpload onGraphGenerated={handleGraphGenerated} />
				</div>
			</div>
		</main>
	)
}
