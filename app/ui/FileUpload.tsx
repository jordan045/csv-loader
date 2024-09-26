"use client"

import React, { useState } from 'react';

function FileUpload() {
  const [file, setFile] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [xAttribute, setXAttribute] = useState('');
  const [yAttribute, setYAttribute] = useState('');
  const [graph, setGraph] = useState('');

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

  const handleSubmit = async (e:any) => {
    e.preventDefault();
  
    if (!file || !xAttribute || !yAttribute) {
      alert("Por favor selecciona un archivo y los atributos");
      return;
    }
  
    // Crear FormData con archivo y atributos seleccionados
    const formData = new FormData();
    formData.append('file', file);
    formData.append('xAttribute', xAttribute);
    formData.append('yAttribute', yAttribute);
  
    try {
      const response = await fetch('http://localhost:3000/api/generate_graph', {
        method: 'POST',
        body: formData,  // Enviar FormData
      });
  
      if (!response.ok) {
        throw new Error('Error al generar el gráfico');
      }
  
      const data = await response.json();
      setGraph(data.graph);
    } catch (error: any) {
      console.error('Error:', error);
      alert(error.message);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".csv" onChange={handleFileChange} />
        {attributes.length > 0 && (
          <div>
            <label>
              Atributo X:
              <select value={xAttribute} onChange={(e) => setXAttribute(e.target.value)}>
                <option value="">Seleccionar</option>
                {attributes.map((attr) => (
                  <option key={attr} value={attr}>{attr}</option>
                ))}
              </select>
            </label>
            <label>
              Atributo Y:
              <select value={yAttribute} onChange={(e) => setYAttribute(e.target.value)}>
                <option value="">Seleccionar</option>
                {attributes.map((attr) => (
                  <option key={attr} value={attr}>{attr}</option>
                ))}
              </select>
            </label>
          </div>
        )}
        <button type="submit">Generar Gráfico</button>
      </form>
      {graph && <img src={graph} alt="Graph" />}
    </div>
  );
}

export default FileUpload;
