// Desarollo de la clase para la representacion de un punto en el plano
class Punto {
    #x;
    #y;

    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }

    get x() {
        return this.#x;
    }

    get y() {
        return this.#y;
    }

    set x(value) {
        this.#x = value;
    }

    set y(value) {
        this.#y = value;
    }
}

// Clase que representa un polígono formado por varios puntos
class Poligono {
    #puntos;

    constructor() {
        this.#puntos = this.#generarPuntosAleatorios();
    }

    #generarPuntosAleatorios() {
        const numPuntos = Math.floor(Math.random() * 13) + 3;
        const puntos = [];

        for (let i = 0; i < numPuntos; i++) {
            const x = Math.floor(Math.random() * 500);
            const y = Math.floor(Math.random() * 500);
            puntos.push(new Punto(x, y));
        }

        return puntos;
    }

    get puntos() {
        return this.#puntos;
    }

    dibujarPoligonoSVG(svg) {
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }

        const puntosPoligono = this.#puntos.map(p => `${p.x},${p.y}`).join(" ");
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        
        polygon.setAttribute("points", puntosPoligono);
        polygon.setAttribute("stroke", "black");
        polygon.setAttribute("stroke-width", "2");
        polygon.setAttribute("fill", "none");

        svg.appendChild(polygon);
    }

    calcularCentroide() {
        let sumaX = 0;
        let sumaY = 0;
        const numPuntos = this.#puntos.length;

        this.#puntos.forEach(p => {
            sumaX += p.x;
            sumaY += p.y;
        });

        return new Punto(sumaX / numPuntos, sumaY / numPuntos);
    }

    ordenarPuntosSentidoHorario() {
        const centroide = this.calcularCentroide();

        this.#puntos.sort((a, b) => {
            const anguloA = Math.atan2(a.y - centroide.y, a.x - centroide.x);
            const anguloB = Math.atan2(b.y - centroide.y, b.x - centroide.x);
            return anguloA - anguloB;
        });

        this.#puntos.reverse();
    }

    esConcavoOConvexo() {
        let esConcavo = false;
        const numPuntos = this.#puntos.length;
        let signo = 0;

        for (let i = 0; i < numPuntos; i++) {
            const dx1 = this.#puntos[(i + 2) % numPuntos].x - this.#puntos[(i + 1) % numPuntos].x;
            const dy1 = this.#puntos[(i + 2) % numPuntos].y - this.#puntos[(i + 1) % numPuntos].y;
            const dx2 = this.#puntos[i].x - this.#puntos[(i + 1) % numPuntos].x;
            const dy2 = this.#puntos[i].y - this.#puntos[(i + 1) % numPuntos].y;
            const z = dx1 * dy2 - dy1 * dx2;

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

    mostrarResultado() {
        const resultado = this.esConcavoOConvexo();
        document.getElementById('resultado').innerText = `El polígono es: ${resultado}`;
    }
}

// Variable para verificar si las líneas al centroide ya están dibujadas
let lineasCentroideDibujadas = false;
let poligonoActual; // Variable para guardar el polígono actual

// Función para crear y dibujar un nuevo polígono en el SVG
function dibujarPoligonoV() {
    poligonoActual = new Poligono(); // Guardar el polígono generado
    const svg = document.getElementById('svg');
    poligonoActual.ordenarPuntosSentidoHorario();
    poligonoActual.dibujarPoligonoSVG(svg);
    poligonoActual.mostrarResultado();
    
    // Reiniciar el estado de las líneas al centroide al dibujar un nuevo polígono
    lineasCentroideDibujadas = false;
}

// Función para dibujar o eliminar las líneas punteadas hacia el centroide
function toggleLineasCentroide() {
    const svg = document.getElementById('svg');
    
    // Si las líneas ya están dibujadas, las eliminamos
    if (lineasCentroideDibujadas) {
        // Eliminar todas las líneas del SVG
        const lineas = svg.querySelectorAll('line');
        lineas.forEach(linea => svg.removeChild(linea));
        lineasCentroideDibujadas = false;
    } else {
        // Si no están dibujadas, las dibujamos desde el polígono actual
        const centroide = poligonoActual.calcularCentroide(); // Calcular el centroide

        // Dibujar las líneas desde cada punto del polígono hasta el centroide
        poligonoActual.puntos.forEach(punto => {
            const linea = document.createElementNS("http://www.w3.org/2000/svg", "line");
            linea.setAttribute("x1", punto.x);
            linea.setAttribute("y1", punto.y);
            linea.setAttribute("x2", centroide.x);
            linea.setAttribute("y2", centroide.y);
            linea.setAttribute("stroke", "black");
            linea.setAttribute("stroke-width", "1");
            linea.setAttribute("stroke-dasharray", "5,5"); // Líneas punteadas

            svg.appendChild(linea);
        });

        lineasCentroideDibujadas = true;
    }
}

// Al cargar la página, se genera y dibuja un polígono por defecto
dibujarPoligonoV();

// Asocia la función para activar/desactivar las líneas al centroide al evento 'click' del botón
document.getElementById('generarPoligonoBtn').addEventListener('click', toggleLineasCentroide);