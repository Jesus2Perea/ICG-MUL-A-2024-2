// Desarollo de la clase para la representacion de un punto en el plano
class Punto {
    #x;
    #y;

    // Constructor para inicializar un punto con coordenadas x e y
    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }

    // Getter para obtener el valor de la coordenada x
    get x() {
        return this.#x;
    }

    // Getter para obtener el valor de la coordenada y
    get y() {
        return this.#y;
    }

    // Setter para asignar un nuevo valor a la coordenada x
    set x(value) {
        this.#x = value;
    }

    // Setter para asignar un nuevo valor a la coordenada y
    set y(value) {
        this.#y = value;
    }
}



// Función para generar y dibujar un nuevo polígono
function dibujarPoligonoR() {
    const poligono = new Poligono(); // Crear una nueva instancia de Poligono
    const canvas = document.getElementById('canvas'); // Obtener el contenedor Canvas
    poligono.dibujarPoligonoCanvas(canvas); // Dibujar el polígono en el Canvas
    poligono.mostrarResultado(); // Mostrar si es cóncavo o convexo
}

// Al cargar la página, se genera un polígono automáticamente
dibujarPoligonoR();

// Asociar la función de generar un nuevo polígono al evento 'click' del botón
document.getElementById('generarPoligonoBtn').addEventListener('click', dibujarPoligonoR);