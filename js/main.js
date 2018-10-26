
// get random integer from range
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

// customers set generation
var canvasWidth = document.getElementById('customers-canvas').offsetWidth;
var canvasHeight = document.getElementById('customers-canvas').offsetHeight;
var customers = Object();
function customersGenerator () {
    customersNumber = getRandomArbitrary(15, 25);
    for(var i = 0; i<customersNumber; i++) {
        customers[i] = Object();
        customers[i].health = getRandomArbitrary(1, 5);
        customers[i].xInteract = getRandomArbitrary(0, canvasWidth);
        customers[i].yActive = getRandomArbitrary(0, canvasHeight);
        customers[i].val =  getRandomArbitrary(100, 10000);
    }
}
customersGenerator();


// circle drawing
function getArc(x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
}

// circle color decision of health
function colorDecision(healthValue) {
    switch (healthValue) {
        case 1:
            color = 'red';
            break;
        case 2:
            color = 'red';
            break;
        case 3:
            color = 'orange';
            break;
        case 4:
            color = 'green';
            break;
        case 5:
            color = 'green';
            break;

        default:
            color = 'black';
            break;
    }
    return color;
}

// non-linear conversion customer value to circle radius
function valueToRadius(val) {
    //return Math.floor(Math.log(val)*2);
    return Math.floor(Math.sqrt(val/3));
}

// drawing start
var canvas = document.getElementById('customers-canvas');
if (canvas.getContext)
{
    var ctx = canvas.getContext('2d');
    console.log(customers);
    for (customer in customers) {
        console.log(customers[customer]);
        getArc(
            customers[customer].xInteract, 
            customers[customer].yActive, 
            valueToRadius(customers[customer].val), 
            colorDecision(customers[customer].health)
            );
    }
}