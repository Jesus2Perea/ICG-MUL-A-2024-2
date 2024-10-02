
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
}

class Figura {
    constructor() {
        this.canvas = document.getElementById('canvas');
    }

    dibujarPunto(x, y) {
        const punto = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        punto.setAttribute("x", x);
        punto.setAttribute("y", y);
        punto.setAttribute("width", "1");
        punto.setAttribute("height", "1");
        punto.setAttribute("fill", "black");
        this.canvas.appendChild(punto);
    }
}

class Linea extends Figura {
    #punto1;
    #punto2;

    constructor(p1, p2) {
        super();
        this.#punto1 = p1;
        this.#punto2 = p2;
    }

    dibujar() {
        // Implementación del algoritmo de Bresenham
        let x1 = this.#punto1.x;
        let y1 = this.#punto1.y;
        let x2 = this.#punto2.x;
        let y2 = this.#punto2.y;

        let dx = Math.abs(x2 - x1);
        let dy = Math.abs(y2 - y1);
        let sx = (x1 < x2) ? 1 : -1;
        let sy = (y1 < y2) ? 1 : -1;
        let err = dx - dy;

        while (true) {
            this.dibujarPunto(x1, y1); // Dibuja el punto actual

            if (x1 === x2 && y1 === y2) break;

            let e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x1 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y1 += sy;
            }
        }
    }
}

class Circunferencia extends Figura {
    #centro;
    #radio;

    constructor(centro, radio) {
        super();
        this.#centro = centro;
        this.#radio = radio;
    }

    dibujar() {
        const circ = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circ.setAttribute("cx", this.#centro.x);
        circ.setAttribute("cy", this.#centro.y);
        circ.setAttribute("r", this.#radio);
        circ.setAttribute("stroke", "black");
        circ.setAttribute("stroke-width", "2");
        circ.setAttribute("fill", "none");
        this.canvas.appendChild(circ);
    }
}

class Elipse extends Figura {
    #centro;
    #radioX;
    #radioY;

    constructor(centro, radioX, radioY) {
        super();
        this.#centro = centro;
        this.#radioX = radioX;
        this.#radioY = radioY;
    }

    dibujar() {
        const elipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        elipse.setAttribute("cx", this.#centro.x);
        elipse.setAttribute("cy", this.#centro.y);
        elipse.setAttribute("rx", this.#radioX);
        elipse.setAttribute("ry", this.#radioY);
        elipse.setAttribute("stroke", "black");
        elipse.setAttribute("stroke-width", "2");
        elipse.setAttribute("fill", "none");
        this.canvas.appendChild(elipse);
    }
}

// Usando la clase Punto
const punto1 = new Punto(50, 50);
const punto2 = new Punto(200, 200);
const linea = new Linea(punto1, punto2);
linea.dibujar();

const centroCircunferencia = new Punto(300, 100);
const circunferencia = new Circunferencia(centroCircunferencia, 50);
circunferencia.dibujar();

const centroElipse = new Punto(400, 300);
const elipse = new Elipse(centroElipse, 80, 50);
elipse.dibujar();
