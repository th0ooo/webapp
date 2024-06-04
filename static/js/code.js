function generatePicoCode(workspaceSelector) {
    let code = ""; // Генерация кода на основе блоков в рабочей области
    $(workspaceSelector + " .draggable").each(function() {
        let color = $(this).data("color");
        if (color === "red") {
            code += "import time; from machine import Pin; led = Pin(15, Pin.OUT); led.value(1); time.sleep(5); led.value(0)\n";
        } else if (color === "blue") {
            code += "from machine import Pin; led = Pin(15, Pin.OUT); led.value(0)\n";
        }
        // Добавить дополнительные условия для других цветов по необходимости
    });
    return code;
}
