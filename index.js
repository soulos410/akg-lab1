let canvas = document.querySelector('canvas');

let ctx = canvas.getContext('2d');
ctx.fillStyle = '#000';
ctx.strokeStyle = '#000';

let currentPolygon = [[20, 140], [70, 75], [120, 10], [170, 75], [220, 140], [120, 140]];
const resultPolygon = [[1550, 920], [1650, 1000], [1750, 1000], [1850, 920], [1750, 840], [1650, 840]];
const centerPolygon = [[870, 560], [920, 495], [970, 430], [1020, 495], [1070, 560], [970, 560]];
let differencesBetweenFigures = [[], [], [], [], [], []];
const separatorCoords = [[930, 0], [930, 1000]];
const maxSteps = 160;

function calculateDifferences(figureToCalculate) {
    figureToCalculate.forEach((el, index) => {
        differencesBetweenFigures[index].push((el[0] - currentPolygon[index][0]) / (maxSteps / 2));
        differencesBetweenFigures[index].push((el[1] - currentPolygon[index][1]) / (maxSteps / 2));
    });
}

function createSeparator(separator) {
    ctx.lineWidth = 2;
    ctx.beginPath();
    separator.forEach((el, index) => {
        index === 0 ? ctx.moveTo(el[0], el[1]) : ctx.lineTo(el[0], el[1]);
    });
    ctx.closePath();       // Рисует линию к нижнему левому углу
    ctx.stroke();
    ctx.lineWidth = 1;
}

function createPolygon(coords) {
    ctx.beginPath();
    coords.forEach((el, index) => {
        index === 0 ? ctx.moveTo(el[0], el[1]) : ctx.lineTo(el[0], el[1]);
    });
    ctx.closePath();       // Рисует линию к нижнему левому углу
    ctx.fill();
}

function updatePolygonCoords() {
    currentPolygon.forEach((el, index) => {
        el[0] += differencesBetweenFigures[index][0];
        el[1] += differencesBetweenFigures[index][1];
    });
}



function start() {
    return new Promise(res => {
        let currentSteps = 0;
        const startAnimation = setInterval(() => {
            if (currentSteps < maxSteps / 2) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                createSeparator(separatorCoords);
                updatePolygonCoords();
                createPolygon(currentPolygon);
                currentSteps++;
            }
            else {
                differencesBetweenFigures = [[], [], [], [], [], []];
                clearInterval(startAnimation);
                res();
            }
        }, 16);
    });
};

calculateDifferences(centerPolygon);
start().then(() => {
    calculateDifferences(resultPolygon);
    start();
});
