// Variables globales
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;
let imageData, selectedImage = null;

// Referencias a los botones
const scanFillButton = document.getElementById('scanFillButton');
const floodFillButton = document.getElementById('floodFillButton');
const imageSelect = document.getElementById('imageSelect');
const imageName = document.getElementById('imageName');

// Escuchar la seleccion de imagen
imageSelect.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = function(e) {
            img.src = e.target.result;
            img.onload = function() {
                // Dibujar la imagen en el canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                selectedImage = img;
                imageName.textContent = `Nombre de la imagen seleccionada: ${file.name}`;
            };
        };
        reader.readAsDataURL(file);
    }
});

// Obtener el color de un pixel en una coordenada (x, y)
function getPixel(x, y) {
    const index = (y * canvas.width + x) * 4;
    return [
        imageData.data[index],     // R
        imageData.data[index + 1], // G
        imageData.data[index + 2], // B
        imageData.data[index + 3]  // A
    ];
}

// Establecer el color de un pixel en una coordenada (x, y)
function setPixel(x, y, color) {
    const index = (y * canvas.width + x) * 4;
    imageData.data[index] = color[0];     // R
    imageData.data[index + 1] = color[1]; // G
    imageData.data[index + 2] = color[2]; // B
    imageData.data[index + 3] = color[3]; // A
}

// Comparar dos colores (R, G, B, A)
function colorsMatch(a, b) {
    return a[0] === b[0] && a[1] === b[1] && a[2] === b[2] && a[3] === b[3];
}

// Verificar si un pixel es negro (usado para bordes)
function isBlack(pixel) {
    return colorsMatch(pixel, [0, 0, 0, 255]); // Detectar color negro
}

// Algoritmo Flood-Fill (relleno por propagacion)
function floodFill(x, y, fillColor) {
    const targetColor = getPixel(x, y);
    if (colorsMatch(targetColor, fillColor) || isBlack(targetColor)) return;

    const queue = [[x, y]];
    const totalPixels = canvas.width * canvas.height;
    const intervalDuration = 7000 / totalPixels; // Dividimos 7 segundos entre el numero total de pixeles

    const interval = setInterval(() => {
        // Ajustamos la cantidad de pixeles procesados por intervalo para que se complete en 7 segundos
        let iterationsPerInterval = Math.ceil(totalPixels / 420); // Ajuste para rellenar en ~7 segundos (60 FPS * 7 seg)

        while (iterationsPerInterval > 0 && queue.length > 0) {
            const [cx, cy] = queue.shift();
            if (cx < 0 || cx >= canvas.width || cy < 0 || cy >= canvas.height) continue;
            if (!colorsMatch(getPixel(cx, cy), targetColor) || isBlack(getPixel(cx, cy))) continue;

            setPixel(cx, cy, fillColor);

            queue.push([cx + 1, cy]);
            queue.push([cx - 1, cy]);
            queue.push([cx, cy + 1]);
            queue.push([cx, cy - 1]);

            iterationsPerInterval--; // Reducimos el numero de iteraciones por intervalo
        }

        // Si ya no hay mas pixeles por procesar, detenemos el intervalo
        if (queue.length === 0) {
            clearInterval(interval);
            ctx.putImageData(imageData, 0, 0); // Actualizar el canvas despues de finalizar el relleno
        }

        ctx.putImageData(imageData, 0, 0); // Actualizar el canvas en cada intervalo

    }, intervalDuration);
}


// Algoritmo Scan-Fill
function scanFill() {
    if (!selectedImage) {
        alert('Primero selecciona una imagen.');
        return;
    }

    const fillColor = [255, 0, 0, 255]; // Color rojo para el relleno
    let y = 0; // Comenzamos por la primera fila

    const totalLines = canvas.height;
    const intervalDuration = 2000 / totalLines; // Dividimos 2 segundos entre el numero total de filas

    const interval = setInterval(() => {
        if (y >= canvas.height) {
            clearInterval(interval); // Si hemos recorrido todas las lineas, detenemos el proceso
            return;
        }

        let inside = false;
        let startX = -1;
        let isEnclosed = true; // Asumimos que esta cerrada al principio

        for (let x = 0; x < canvas.width; x++) {
            const pixelColor = getPixel(x, y);

            if (isBlack(pixelColor)) {
                if (inside) {
                    // Termina un area cerrada
                    inside = false;

                    if (isEnclosed) {
                        // Si se ha determinado que el area esta cerrada, realizamos el relleno
                        for (let fillX = startX; fillX < x; fillX++) {
                            setPixel(fillX, y, fillColor);
                        }
                    }

                    isEnclosed = true; // Reiniciamos la verificacion de cerradura
                } else {
                    // Detecta el inicio de una nueva area cerrada
                    inside = true;
                    startX = x;
                }
            } else if (inside) {
                // Si estamos dentro de un area potencial para rellenar y encontramos un pixel que no es negro
                if (x === 0 || x === canvas.width - 1) {
                    // Si estamos en un borde del canvas, marcamos el area como no cerrada
                    isEnclosed = false;
                }
            }
        }

        ctx.putImageData(imageData, 0, 0); // Actualizar el canvas despues de procesar cada fila
        y++; // Avanzar a la siguiente linea

    }, intervalDuration);
}



// Funcion para seleccionar el punto inicial del flood-fill con clic en el canvas
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    floodFill(Math.floor(x), Math.floor(y), [0, 0, 255, 255]); // Relleno de color azul
});

// Escuchar eventos de los botones
scanFillButton.addEventListener('click', scanFill);
floodFillButton.addEventListener('click', () => alert('Haz clic en el canvas para aplicar flood-fill.'));
