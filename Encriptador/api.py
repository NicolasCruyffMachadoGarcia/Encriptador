from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Esto permite peticiones desde el navegador

# Configura la conexión a tu base de datos
conexion = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="cifrador"
)

@app.route('/guardar', methods=['POST'])
def guardar():
    datos = request.json
    metodo = datos.get("metodo")
    original = datos.get("original")
    cifrado = datos.get("cifrado")
    descifrado = datos.get("descifrado")
    proceso = datos.get("proceso")

    try:
        cursor = conexion.cursor()
        cursor.execute("""
            INSERT INTO historial (texto_original, texto_cifrado, texto_descifrado, metodo, procedimiento)
            VALUES (%s, %s, %s, %s, %s)
        """, (metodo, original, cifrado, descifrado, proceso))
        conexion.commit()
        cursor.close()
        return jsonify({"mensaje": "Datos guardados correctamente"}), 200
    except Exception as e:
        print("Error:", e)
        return jsonify({"mensaje": "Error al guardar datos"}), 500

if __name__ == '__main__':
    app.run(debug=True)
