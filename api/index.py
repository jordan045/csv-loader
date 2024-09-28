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

    if file and file.filename.endswith('.csv') and y_attribute and (x_attribute or on_time):
        # Leer el archivo CSV desde el archivo subido
        df = pd.read_csv(file)

        y_axis = df[y_attribute]
        if on_time:
            x_axis = range(len(y_axis)) 
        else:
            if x_attribute == y_attribute:
                x_axis = df[x_attribute]
                y_axis = x_axis
            else:
                x_axis = df[x_attribute]
                y_axis = df[y_attribute] 
             
        

        plt.figure(figsize=(10, 6))
        plt.plot(x_axis,y_axis)
        plt.title("Grafico re cheto!")
        if on_time:
            plt.xlabel("Tiempo")
        else:
            plt.xlabel(x_attribute)
        plt.ylabel(y_attribute)
        img = BytesIO()
        plt.savefig(img, format='png', dpi=300)
        img.seek(0)
        graph_url = base64.b64encode(img.getvalue()).decode()

        return jsonify({'graph': f"data:image/png;base64,{graph_url}"})
    return jsonify({'error': 'Invalid file format or missing attributes'}), 400