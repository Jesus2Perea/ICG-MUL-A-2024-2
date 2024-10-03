// Clase que representa un punto en el plano
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

// Clase que representa un polígono formado por varios puntos
class Poligono {
    #puntos;

    // Constructor para inicializar el polígono generando puntos aleatorios
    constructor() {
        this.#puntos = this.#generarPuntosAleatorios();
    }

    // Método privado para generar puntos aleatorios para el polígono
    #generarPuntosAleatorios() {
        const numPuntos = Math.floor(Math.random() * 13) + 3; // Genera entre 3 y 15 puntos
        const puntos = [];

        for (let i = 0; i < numPuntos; i++) {
            const x = Math.floor(Math.random() * 500); // Coordenada x aleatoria entre 0 y 500
            const y = Math.floor(Math.random() * 500); // Coordenada y aleatoria entre 0 y 500
            puntos.push(new Punto(x, y)); // Crear un nuevo punto y añadirlo al arreglo
        }

        return puntos;
    }

    // Getter para obtener los puntos del polígono
    get puntos() {
        return this.#puntos;
    }

    // Método que dibuja el polígono en un contenedor Canvas
    dibujarPoligonoCanvas(canvas) {
        const ctx = canvas.getContext('2d'); // Obtener el contexto 2D del Canvas

        // Limpiar el canvas antes de dibujar
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Comenzar a dibujar el polígono
        ctx.beginPath();
        this.ordenarPuntosSentidoHorario(); // Ordenar los puntos en sentido horario
        this.#puntos.forEach((p, index) => {
            if (index === 0) {
                ctx.moveTo(p.x, p.y); // Moverse al primer punto
            } else {
                ctx.lineTo(p.x, p.y); // Dibujar una línea hacia el siguiente punto
            }
        });
        ctx.closePath(); // Cerrar el trazado del polígono
        ctx.strokeStyle = 'black'; // Definir el color de la línea
        ctx.lineWidth = 2; // Definir el grosor de la línea
        ctx.stroke(); // Dibujar las líneas del polígono
    }

    // Método para calcular el centroide del polígono
    calcularCentroide() {
        let sumaX = 0;
        let sumaY = 0;
        const numPuntos = this.#puntos.length;

        // Sumar las coordenadas x e y de todos los puntos
        this.#puntos.forEach(p => {
            sumaX += p.x;
            sumaY += p.y;
        });

        // Calcular el centroide promediando las coordenadas
        return new Punto(sumaX / numPuntos, sumaY / numPuntos);
    }

    // Método que ordena los puntos del polígono en sentido horario
    ordenarPuntosSentidoHorario() {
        const centroide = this.calcularCentroide(); // Obtener el centroide del polígono
        this.#puntos.sort((a, b) => {
            const anguloA = Math.atan2(a.y - centroide.y, a.x - centroide.x);
            const anguloB = Math.atan2(b.y - centroide.y, b.x - centroide.x);
            return anguloA - anguloB; // Ordenar en sentido antihorario
        });
        this.#puntos.reverse(); // Invertir el orden para que sea horario
    }

    // Método para determinar si el polígono es cóncavo o convexo
    esConcavoOConvexo() {
        let esConcavo = false;
        let numPuntos = this.#puntos.length;
        let signo = 0;

        for (let i = 0; i < numPuntos; i++) {
            let dx1 = this.#puntos[(i + 2) % numPuntos].x - this.#puntos[(i + 1) % numPuntos].x;
            let dy1 = this.#puntos[(i + 2) % numPuntos].y - this.#puntos[(i + 1) % numPuntos].y;
            let dx2 = this.#puntos[i].x - this.#puntos[(i + 1) % numPuntos].x;
            let dy2 = this.#puntos[i].y - this.#puntos[(i + 1) % numPuntos].y;
            let z = dx1 * dy2 - dy1 * dx2;

            if (z < 0) {
                if (signo > 0) {
                    esConcavo = true;
                    break;
                }
                signo = -1;
            } else if (z > 0) {
                if (signo < 0) {
                    esConcavo = true;
                    break;
                }
                signo = 1;
            }
        }

        return esConcavo ? 'Cóncavo' : 'Convexo';
    }

    // Método para mostrar en el HTML si el polígono es cóncavo o convexo
    mostrarResultado() {
        const resultado = this.esConcavoOConvexo(); // Determinar si es cóncavo o convexo
        document.getElementById('resultado').innerText = `El polígono es: ${resultado}`; // Mostrar el resultado
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