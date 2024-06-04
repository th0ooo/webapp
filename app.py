from flask import Flask, render_template, request, jsonify
import serial
import time
from serial.tools import list_ports

app = Flask(__name__)
ser = None

def find_pico_port():
    ports = list_ports.comports()
    for port in ports:
        if 'Pico' in port.description or 'Устройство с последовательным интерфейсом USB' in port.description:
            return port.device
    return None

def connect_to_com_port(port, baudrate=115200, timeout=1):
    global ser
    try:
        ser = serial.Serial(port, baudrate, timeout=timeout)
        if ser.is_open:
            return f"Подключение к {port} успешно"
    except Exception as e:
        return f"Ошибка подключения к {port}: {e}"
    return None

def send_data(ser, data):
    if ser:
        try:
            ser.write((data + '\r\n').encode())
            return f"Отправлено: {data}"
        except Exception as e:
            return f"Ошибка при отправке данных: {e}"

def receive_data(ser):
    if ser:
        try:
            time.sleep(1)
            lines = []
            while ser.in_waiting > 0:
                line = ser.readline().decode().strip()
                lines.append(line)
            return lines
        except Exception as e:
            return [f"Ошибка при получении данных: {e}"]
    return []

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/connect', methods=['POST'])
def connect():
    port = find_pico_port()
    if port is None:
        return jsonify(result="Не удалось найти устройство Pico")
    result = connect_to_com_port(port)
    return jsonify(result=result)

@app.route('/execute', methods=['POST'])
def execute():
    if ser is None or not ser.is_open:
        return jsonify(result="Не подключено к COM порту")
    
    code = request.form['code']
    result = send_data(ser, code)
    response = receive_data(ser)
    
    return jsonify(result=result, response=response)

if __name__ == '__main__':
    app.run(debug=True)
