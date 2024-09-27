from flask import Flask, request, jsonify

from flask_cors import CORS
import pandas as pd
import matplotlib
matplotlib.use('Agg')  # Usar el backend no interactivo
import matplotlib.pyplot as plt
from io import BytesIO
import base64

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/api/python")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route('/api/get_attributes', methods=['POST'])
def get_attributes():
    file = request.files['file']
    if file and file.filename.endswith('.csv'):
        df = pd.read_csv(file)
        attributes = df.columns.tolist()
        num_lines = len(df)  # Cantidad de filas, excluyendo el encabezado
        attributes.insert(0, f"Cantidad de líneas: {num_lines}")
        return jsonify({'attributes': attributes})
    return jsonify({'error': 'File format not supported'}), 400

@app.route('/api/generate_graph', methods=['POST'])
def upload_file():
    # Verifica que el archivo esté presente en la solicitud
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    x_attribute = request.form.get('xAttribute')  # Debe venir desde form, no JSON
    y_attribute = request.form.get('yAttribute')  # Debe venir desde form, no JSON
    on_time = request.form.get('onTime') == '1'

    if file and file.filename.endswith('.csv') and x_attribute and (y_attribute or on_time):
        # Leer el archivo CSV desde el archivo subido
        df = pd.read_csv(file)
        x_axis = df[x_attribute]
        y_axis = df[y_attribute]
        
        # Generar gráfico en base a los atributos seleccionados
        plt.figure(figsize=(10, 6))
        if on_time:
            df.plot(x_axis, y_axis, label="On Time", color="green")
        else:
            df.plot(x=x_attribute, y=y_attribute)
        plt.title("Grafico re cheto!")
        plt.xlabel(x_attribute)
        plt.ylabel(y_attribute)
        img = BytesIO()
        plt.savefig(img, format='png', dpi=300)
        img.seek(0)
        graph_url = base64.b64encode(img.getvalue()).decode()

        return jsonify({'graph': f"data:image/png;base64,{graph_url}"})
    return jsonify({'error': 'Invalid file format or missing attributes'}), 400