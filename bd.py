import mysql.connector

def guardar_en_bd(texto_original, texto_cifrado, texto_descifrado, metodo, procedimiento):
    conexion = None
    try:
        conexion = mysql.connector.connect(
            host="localhost",
            user="root",
            password="",
            database="cifrador",
            port=3307  # Usa este si XAMPP está corriendo en el puerto 3307
        )
        cursor = conexion.cursor()

        consulta = """
        INSERT INTO historial (texto_original, texto_cifrado, texto_descifrado, metodo, procedimiento)
        VALUES (%s, %s, %s, %s, %s)
        """
        valores = (texto_original, texto_cifrado, texto_descifrado, metodo, procedimiento)
        cursor.execute(consulta, valores)
        conexion.commit()
        print("✅ Resultado guardado en la base de datos correctamente.")
    except mysql.connector.Error as err:
        print(f"❌ Error al guardar en la base de datos: {err}")
    finally:
        if conexion and conexion.is_connected():
            cursor.close()
            conexion.close()

# Prueba de guardado
guardar_en_bd(
    texto_original="Hola mundo",
    texto_cifrado="Khoor pxqgr",
    texto_descifrado="Hola mundo",
    metodo="Cifrado César",
    procedimiento="Desplazamiento de 3"
)
