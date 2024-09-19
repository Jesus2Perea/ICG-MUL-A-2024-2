class Figura {
    constructor() {
        this.canvas = document.getElementById('canvas');
    }
}

class Linea extends Figura {
    constructor(x1, y1, x2, y2) {
        super();
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    dibujar() {
        // Crea un nuevo elemento SVG de tipo 'line'
        // El espacio de nombres 'http://www.w3.org/2000/svg' es necesario para trabajar con SVG "se usa para enunciar las librerias para complementar"
        const linea = document.createElementNS("http://www.w3.org/2000/svg", "line");
        
        linea.setAttribute("x1", this.x1);
        linea.setAttribute("y1", this.y1);
        
        linea.setAttribute("x2", this.x2);
        linea.setAttribute("y2", this.y2);
        
        linea.setAttribute("stroke", "black");  // Asegura que la línea sea visible con un trazo negro
        
        linea.setAttribute("stroke-width", "2");  // Establece el grosor para que la línea sea más visible
        
        this.canvas.appendChild(linea);
    }
}


class Circunferencia extends Figura {
    constructor(cx, cy, r) {
        super();
        this.cx = cx;
        this.cy = cy;
        this.r = r;
    }

    dibujar() {
        const circ = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circ.setAttribute("cx", this.cx);
        circ.setAttribute("cy", this.cy);
        circ.setAttribute("r", this.r);
        circ.setAttribute("stroke", "black");  // Asegurando que el trazo sea negro
        circ.setAttribute("stroke-width", "2");
        circ.setAttribute("fill", "none");
        this.canvas.appendChild(circ);
    }
}

class Elipse extends Figura {
    constructor(cx, cy, rx, ry) {
        super();
        this.cx = cx;
        this.cy = cy;
        this.rx = rx;
        this.ry = ry;
    }

    dibujar() {
        const elipse = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
        elipse.setAttribute("cx", this.cx);
        elipse.setAttribute("cy", this.cy);
        elipse.setAttribute("rx", this.rx);
        elipse.setAttribute("ry", this.ry);
        elipse.setAttribute("stroke", "black");  // Asegurando que el trazo sea negro
        elipse.setAttribute("stroke-width", "2");
        elipse.setAttribute("fill", "none");
        this.canvas.appendChild(elipse);
    }
}

// Dibujar las primitivas
const linea = new Linea(50, 50, 200, 200);
linea.dibujar();

const circunferencia = new Circunferencia(300, 100, 50);
circunferencia.dibujar();

const elipse = new Elipse(400, 300, 80, 50);
elipse.dibujar();
