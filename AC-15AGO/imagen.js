function dibujarFigura() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const figura = document.getElementById('figura').value;
    const colorRelleno = document.getElementById('color').value;
    const colorBorde = document.getElementById('borde').value;
    const anchoBorde = document.getElementById('anchoBorde').value;
    const posX = parseInt(document.getElementById('posX').value);
    const posY = parseInt(document.getElementById('posY').value);
    const ancho = parseInt(document.getElementById('ancho').value);
    const alto = parseInt(document.getElementById('alto').value);
    const tipo = document.getElementById('tipo').value;

    ctx.lineWidth = anchoBorde;
    ctx.strokeStyle = colorBorde;
    ctx.fillStyle = colorRelleno;

    if (tipo === 'raster') {
        ctx.imageSmoothingEnabled = true;
    } else {
        ctx.imageSmoothingEnabled = false;
    }

    switch (figura) {
        case 'circulo':
            ctx.beginPath();
            ctx.arc(posX, posY, ancho, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            break;
        case 'cuadrado':
            ctx.beginPath();
            ctx.rect(posX, posY, ancho, ancho);
            ctx.fill();
            ctx.stroke();
            break;
        case 'rectangulo':
            ctx.beginPath();
            ctx.rect(posX, posY, ancho, alto);
            ctx.fill();
            ctx.stroke();
            break;
        case 'triangulo':
            ctx.beginPath();
            ctx.moveTo(posX, posY);
            ctx.lineTo(posX + ancho / 2, posY - alto);
            ctx.lineTo(posX - ancho / 2, posY - alto);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
        case 'pentagono':
            const angulo = (2 * Math.PI) / 5;
            const radio = ancho / 2;
            ctx.beginPath();
            for (let i = 0; i < 5; i++) {
                const x = posX + radio * Math.cos(angulo * i - Math.PI / 2);
                const y = posY + radio * Math.sin(angulo * i - Math.PI / 2);
                ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            break;
        default:
            break;
    }

    // Aquí se elimina la descarga automática de la imagen rasterizada
    if (tipo === 'raster') {
        // No se realiza ninguna acción adicional
    } else {
        const svgData = createSVGData(ctx, canvas.width, canvas.height);
        const link = document.createElement('a');
        link.href = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgData);
        link.download = 'figura_vector.svg';
        link.click();
    }
}

function createSVGData(ctx, width, height) {
    const svgHeader = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">`;
    const svgFooter = '</svg>';
    const svgContent = ctx.getSerializedSvg();
    return svgHeader + svgContent + svgFooter;
}

function borrarFiguras() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
