from flask import Flask, request, jsonify

from flask_cors import CORS  # Importar la extensión
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

@app.route("/api/hola")
def hola():
    return "<p>Hola</p>"

@app.route('/api/get_attributes', methods=['POST'])
def get_attributes():
    file = request.files['file']
    if file and file.filename.endswith('.csv'):
        df = pd.read_csv(file)
        attributes = df.columns.tolist()
        return jsonify({'attributes': attributes})
    return jsonify({'error': 'File format not supported'}), 400

@app.route('/api/generate_graph', methods=['POST'])
def upload_file():
    data = request.json
    file = request.files['file']
    x_attribute = data.get('xAttribute')
    y_attribute = data.get('yAttribute')

    file = request.files['file']
    if file and file.filename.endswith('.csv') and x_attribute and y_attribute:
        # Cargar el archivo CSV
        file_path = '../public/lap1.csv'  # Cambia por la ruta de tu archivo
        df = pd.read_csv(file)
        
        # Aquí puedes generar gráficos en base a los atributos que el usuario elija
        plt.figure()
        df.plot(x='Speed GPS', y='RPM')  # Ejemplo simple
        img = BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        graph_url = base64.b64encode(img.getvalue()).decode()

        return jsonify({'graph': f"data:image/png;base64,{graph_url}"})
    return jsonify({'error': 'File format not supported'}), 400