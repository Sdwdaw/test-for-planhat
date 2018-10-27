function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}

// get random integer from range
function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }


// vars for mouse click events
var canvasOffset = $("#customers-canvas").offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;

// days for a game
var days = 30;
// mouse clicks per day
var actions = 5;
// highScores
var highScores = readCookie('highScores') ? readCookie('highScores') : [];

$('.high-scores').html(highScores); 

// customers set generation
var canvasWidth = document.getElementById('customers-canvas').offsetWidth;
var canvasHeight = document.getElementById('customers-canvas').offsetHeight;
var customers = [];
function customersGenerator () {
    customersNumber = getRandomArbitrary(15, 25);
    for(var i = 0; i<customersNumber; i++) {
        customers[i] = Object();
        customers[i].health = getRandomArbitrary(1, 5);
        customers[i].xInteract = getRandomArbitrary(0, canvasWidth);
        customers[i].yActive = getRandomArbitrary(0, canvasHeight);
        customers[i].val =  getRandomArbitrary(100, 5000);
    }
}
customersGenerator();

// customer values summ formatted
function customerTotalValue(customersObj) {
    var amount = 0;
    for (customer in customersObj) {
        amount += customers[customer].val;
    }
    amount = (amount/1000).toFixed(2) + 'K';
    return amount;
}

// customer values summ
function customerTotal(customersObj) {
    var amount = 0;
    for (customer in customersObj) {
        amount += customers[customer].val;
    }
    amount
    return amount;
}

// average health score
function averageHealthScore(customersObj) {
    var sum = 0;
    var avg = 0;
    var count = 0;
    for (customer in customersObj) {
        sum += parseInt(customers[customer].health);
        count += 1;
    }
    avg = (sum/count).toFixed(1);
    return avg;
}

$('.paying-customers-value').text(customersNumber);
$('.potfolio-value').text(customerTotalValue(customers));
$('.health-score-value').text(averageHealthScore(customers));

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

// check circles for click event
function handleMouseDown(e) {
    // get canvasXY of click
    canvasMouseX = parseInt(e.clientX - offsetX);
    canvasMouseY = parseInt(e.clientY - offsetY);
    // test if we clicked in any circle
    for (customer in customers) {
        var dx = canvasMouseX - customers[customer].xInteract;
        var dy = canvasMouseY - customers[customer].yActive;
        var isInCircle = (dx * dx + dy * dy) < (valueToRadius(customers[customer].val) * valueToRadius(customers[customer].val));
        if (isInCircle) {
            // payment grows
            customers[customer].val += 100;
            // health grows
            customers[customer].health +=  customers[customer].health > 4 ? 0 : 1;
            // random activity
            if (getRandomArbitrary(0, 30) > getRandomArbitrary(0, 100)) {
                customers[customer].yActive +=  1;
            }

            actions -= 1;

            console.log('You have got ' + actions + ' action left');
            //alert("You clicked in the " + customer);
        }
    }
}


$("#customers-canvas").mousedown(function (e) {
    if (days > 0) {
        if (actions > 0) {
            handleMouseDown(e);
        } else {
            newCustomers = [];
            for (customer in customers) {
                if (customers[customer].health !== 1) {
                    newCustomers.push(customers[customer]);
                }
            }
            customers = newCustomers;
            $('.paying-customers-value').text(customers.length);
            $('.potfolio-value').text(customerTotalValue(customers));
            $('.health-score-value').text(averageHealthScore(customers));
            alert('Day ends');

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            drawCustomers(customers);
            actions = 5;
            days -=1;
        }
    } else {
        newHighScore = customerTotal(customers);
        newHighScores = [];
        if (highScores.length < 5) {
            newHighScores.push(newHighScore);
        } else {
            newHighScores.sort(function(a, b){return a - b});
            for (var i = 0; i < highScores.length; i++) {
                if (newHighScore > highScores[i]) {
                    newHighScores.push(newHighScore);
                    break;
                } else {
                    newHighScores.push(highScores[i]);
                }
            }
            newHighScores.push(highScores.slice(i, highScores.length));
        }
        console.log(newHighScores);
        newHighScores.sort(function(a, b){return b - a});
        newHighScores = newHighScores.slice(0,5);

        eraseCookie('highScores');
        createCookie('highScores',newHighScores, 30);
        
        alert ('GAME OVER! Your score is ' + customerTotalValue(customers));
        location.reload();
    }
});

function drawCustomers(customersObj) {
    $('.message-container').append(' Day starts');
    for (customer in customersObj) {
        getArc(
            customersObj[customer].xInteract, 
            customersObj[customer].yActive, 
            valueToRadius(customersObj[customer].val), 
            colorDecision(customersObj[customer].health)
        );
    }
}

// drawing start
var canvas = document.getElementById('customers-canvas');
if (canvas.getContext)
{
    
    var ctx = canvas.getContext('2d');
    console.log('Month starts');

    //initial customers drawing
    drawCustomers(customers);
}


