"use client"

import React, { useState } from 'react';
import Image from 'next/image';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { generateGraph } from '@/lib/utils';

const FormSchema = z.object({
	email: z
		.string({
			required_error: "Please select an email to display.",
		})
		.email(),
})

interface FileUploadProps {
	onGraphGenerated: (graph: string) => void
}

function FileUpload(
	{ onGraphGenerated }: FileUploadProps
) {
	const [file, setFile] = useState(null);
	const [attributes, setAttributes] = useState([]);
	const [xAttribute, setXAttribute] = useState('');
	const [yAttribute, setYAttribute] = useState('');
	const [graph, setGraph] = useState('');
	const [onTime, setOnTime] = useState(false);

	const handleFileChange = async (e: any) => {
		const uploadedFile = e.target.files[0];
		setFile(uploadedFile);

		// Obtener los atributos del CSV
		const formData = new FormData();
		formData.append('file', uploadedFile);

		const response = await fetch('http://localhost:3000/api/get_attributes', {
			method: 'POST',
			body: formData,
		});

		const data = await response.json();
		setAttributes(data.attributes);
	};

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		if (!file || !yAttribute) {
			alert("Por favor selecciona un archivo y los atributos");
			return;
		}

		// Crear FormData con archivo y atributos seleccionados
		const formData = new FormData();
		formData.append('file', file);
		formData.append('xAttribute', xAttribute);
		formData.append('yAttribute', yAttribute);
		formData.append('onTime', onTime ? '1' : '0');

		const graph = await generateGraph(formData);
		onGraphGenerated(graph);
	};

	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
	})

	return (
		<div>
			<Card className="w-[500px]">
				<CardHeader>
					<CardTitle>Crear gráfico</CardTitle>
					<CardDescription>Genera un grafico con matplotlib</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form onSubmit={handleSubmit} className="space-y-6">
							<div className='grid w-full items-center gap-4'>
								<FormField
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Nombre del Grafico</FormLabel>
											<FormControl>
												<Input id="name" placeholder="Graph 1" />
											</FormControl>
										</FormItem>
									)}
								/>
								<FormField
									name="file"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Archivo</FormLabel>
											<FormControl>
												<Input id="picture" type="file" accept=".csv" onChange={handleFileChange} />
											</FormControl>
											<FormDescription>
												Soporte de archivos .csv
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									name="eje_x"
									render={({ field }) => (
										<div className='rounded-md border p-4'>
											<FormItem className='mb-3'>
												<FormLabel>Eje X</FormLabel>
												<Select onValueChange={(value: any) => {
													field.onChange(value);
													setXAttribute(value);
												}} defaultValue={field.value} disabled={!attributes.length}>
													<FormControl>
														<SelectTrigger id="eje_x">
															<SelectValue placeholder="Selecciona un atributo" />
														</SelectTrigger>
													</FormControl>
													<SelectContent position="popper">
														{attributes.map((attr: any) => (
															<SelectItem key={attr} value={attr}>{attr}</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
											<FormItem className="flex flex-row items-start space-x-3 space-y-0 ">
												<FormControl>
													<Checkbox
														checked={field.value}
														onCheckedChange={(value) => {
															field.onChange(value);
															setOnTime(Boolean(value));
														}}
														disabled={!attributes.length}
													/>
												</FormControl>
												<div className="space-y-1 leading-none">
													<FormLabel>
														Graficar en función del tiempo
													</FormLabel>
													<FormDescription>
														Para utilizar como atributo la cantidad de muestras
													</FormDescription>
												</div>
											</FormItem>
										</div>
									)}
								/>
								<FormField
									name="eje_y"
									render={({ field }) => (
										<FormItem className='rounded-md border p-4'>
											<FormLabel>Eje Y</FormLabel>
											<Select onValueChange={(value: any) => {
												field.onChange(value);
												setYAttribute(value);
											}} defaultValue={field.value} disabled={!attributes.length}>
												<FormControl>
													<SelectTrigger id="eje_y">
														<SelectValue placeholder="Selecciona un atributo" />
													</SelectTrigger>
												</FormControl>
												<SelectContent position="popper">
													{attributes.map((attr: any) => (
														<SelectItem key={attr} value={attr}>{attr}</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<Button type="submit">Generar gráfico</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>

			
		</div>

	);
}

export default FileUpload;
