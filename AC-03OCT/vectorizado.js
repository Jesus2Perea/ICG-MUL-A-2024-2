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
    #puntos; // Propiedad privada para almacenar los puntos del polígono

    constructor() {
        // Inicializa los puntos del polígono de forma aleatoria
        this.#puntos = this.#generarPuntosAleatorios();
    }

    // Método privado para generar una cantidad aleatoria de puntos
    #generarPuntosAleatorios() {
        const numPuntos = Math.floor(Math.random() * 13) + 3; // Genera entre 3 y 15 puntos
        const puntos = [];

        for (let i = 0; i < numPuntos; i++) {
            const x = Math.floor(Math.random() * 500); // Coordenada x entre 0 y 500
            const y = Math.floor(Math.random() * 500); // Coordenada y entre 0 y 500
            puntos.push(new Punto(x, y)); // Crea un nuevo punto y lo agrega a la lista
        }

        return puntos;
    }

    // Getter para acceder a los puntos del polígono
    get puntos() {
        return this.#puntos;
    }

    // Método que dibuja el polígono en un contenedor SVG
    dibujarPoligonoSVG(svg) {
        // Limpia el contenedor SVG antes de dibujar
        while (svg.firstChild) {
            svg.removeChild(svg.firstChild);
        }

        // Crea una cadena de puntos a partir de las coordenadas del polígono
        const puntosPoligono = this.#puntos.map(p => `${p.x},${p.y}`).join(" ");
        const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
        
        // Asigna atributos al elemento <polygon>
        polygon.setAttribute("points", puntosPoligono);
        polygon.setAttribute("stroke", "black");
        polygon.setAttribute("stroke-width", "2");
        polygon.setAttribute("fill", "none");

        // Añade el polígono al contenedor SVG
        svg.appendChild(polygon);
    }

    // Método para calcular el centroide (punto medio) del polígono
    calcularCentroide() {
        let sumaX = 0;
        let sumaY = 0;
        const numPuntos = this.#puntos.length;

        // Suma todas las coordenadas x e y de los puntos
        this.#puntos.forEach(p => {
            sumaX += p.x;
            sumaY += p.y;
        });

        // Calcula el centroide como el promedio de las coordenadas
        return new Punto(sumaX / numPuntos, sumaY / numPuntos);
    }

    // Método que ordena los puntos en sentido horario
    ordenarPuntosSentidoHorario() {
        const centroide = this.calcularCentroide(); // Calcula el centroide del polígono

        // Ordena los puntos en sentido antihorario según el ángulo respecto al centroide
        this.#puntos.sort((a, b) => {
            const anguloA = Math.atan2(a.y - centroide.y, a.x - centroide.x);
            const anguloB = Math.atan2(b.y - centroide.y, b.x - centroide.x);
            return anguloA - anguloB;
        });

        // Invertimos el orden para que sea en sentido horario
        this.#puntos.reverse();
    }

    // Método para determinar si el polígono es cóncavo o convexo
    esConcavoOConvexo() {
        let esConcavo = false;
        const numPuntos = this.#puntos.length;
        let signo = 0;

        // Recorre los puntos para analizar el signo de las áreas entre triples de puntos
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

        // Retorna si el polígono es cóncavo o convexo
        return esConcavo ? 'Cóncavo' : 'Convexo';
    }

    // Método que muestra si el polígono es cóncavo o convexo en el HTML
    mostrarResultado() {
        const resultado = this.esConcavoOConvexo();
        document.getElementById('resultado').innerText = `El polígono es: ${resultado}`;
    }

    // Método que dibuja el polígono en un contenedor SVG en sentido horario
    dibujarPoligonoSVGHorario(svg) {
        this.ordenarPuntosSentidoHorario(); // Ordena los puntos en sentido horario
        this.dibujarPoligonoSVG(svg); // Dibuja el polígono en el contenedor SVG
    }
}

// Función para crear y dibujar un nuevo polígono en el SVG
function dibujarPoligonoV() {
    const poligono = new Poligono(); // Crear una nueva instancia de Poligono
    const svg = document.getElementById('svg'); // Obtener el elemento contenedor SVG
    poligono.ordenarPuntosSentidoHorario(); // Ordenar los puntos del polígono en sentido horario
    poligono.dibujarPoligonoSVG(svg); // Dibujar el polígono en el contenedor SVG
    poligono.mostrarResultado(); // Mostrar si el polígono es cóncavo o convexo
}

// Al cargar la página, se genera y dibuja un polígono por defecto
dibujarPoligonoV();

// Asocia la función de crear un nuevo polígono al evento 'click' del botón "Generar Polígono"
document.getElementById('generarPoligonoBtn').addEventListener('click', dibujarPoligonoV);

// Asocia el evento 'click' del botón "Generar Polígono en Sentido Horario"
// para crear un nuevo polígono y dibujarlo en sentido horario
document.getElementById('generarPoligonoHorarioBtn').addEventListener('click', () => {
    const poligono = new Poligono(); // Crear una nueva instancia de Poligono
    const svg = document.getElementById('svg'); // Obtener el elemento contenedor SVG
    poligono.dibujarPoligonoSVGHorario(svg); // Dibujar el polígono en sentido horario en el SVG
});