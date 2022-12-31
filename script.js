const canvas = createCanvas();
const ctx = canvas.getContext('2d');

//#001011

class Column{
    constructor(x, value){
        let gapMultiplier = unsortedArray.length/(unsortedArray.length*5)**2
        this.gap = (canvas.width)*gapMultiplier;
        this.x = x;
        this.value = value;
        this.width = ((canvas.width-(sideMargin*2))-(this.gap*(unsortedArray.length-1)))/unsortedArray.length
        this.height = mapNumberRange(
            value,
            0,
            unsortedArray.length,
            canvas.height*0.15, //min column height
            topMargin //max column height
        );
    }

    draw(){
        ctx.fillStyle = "#FFFFFC";
        ctx.fillRect(this.x, canvas.height-bottomMargin, this.width, -this.height);
        return;
    }

    static getGap(){
        return new Column().gap;
    }

    static getWidth(){
        return new Column().width;
    }
}

class BubbleSort{
    constructor(sortOrder){
        this.sortOrder = sortOrder;
        this.i = 0;
        this.isSortedCounter = 0;
    }

    sort(){
        if(this.sortOrder === 'increasing'){
            this.increasing();
            return;
        }
        else if(this.sortOrder === 'decreasing'){
            this.decreasing();
            return;
        }
    }

    increasing(){
        this.sortingAlgorithm(unsortedArray[this.i] > unsortedArray[this.i + 1]);
        return;
    }

    decreasing(){
        this.sortingAlgorithm(unsortedArray[this.i] < unsortedArray[this.i + 1]);
        return;
    }

    sortingAlgorithm(sortCondition){
            //sort increasing
            if (sortCondition) {
                let c = unsortedArray[this.i];
                unsortedArray[this.i] = unsortedArray[this.i + 1];
                unsortedArray[this.i + 1] = c;
                this.isSortedCounter = 0;
            }
            else{
                this.isSortedCounter++
            }

            //check if its sorted
            if(this.isSortedCounter >= unsortedArray.length){
                isSorting = false; 
            }
    
            this.i++; //next index

            //if loop through the array back from the start
            if (this.i >= unsortedArray.length - 1) {
                this.i = 0;
            }
    }
}

//inner settings
var sideMargin = canvas.width*0.05;
var topMargin = canvas.height*0.95;
var bottomMargin = canvas.height*0.02;

//global variables
var unsortedArray;
var isSorting = true;

//user input / settings
var unsortedArraySize = 1000;
var sortOrder = 'increasing';
var sortingSpeed = 0 //delay between operations
var sortersQnt = 3000; //comparisons per operation


start();
//click anywhere on the screen to start sorting
canvas.addEventListener('click', sortNumberArray);

//FUNCTIONS
function start(){
    unsortedArray = createUnsortedArray(unsortedArraySize);    
    updateCanvas();
    return;
}

function updateCanvas(){
    window.requestAnimationFrame(updateCanvas);
    resetCanvas();
    drawGraph();
    return;
}

function sortNumberArray(){
    let bubbleSort = new BubbleSort(sortOrder);

    var loop = function () { //infinite loop
        let timeout = setTimeout(function () { //delay between operations
            if(isSorting){
                //define comparisons per operation
                for(let k =0; k<sortersQnt; k++){
                    bubbleSort.sort();  
                }
                
            }
            else{
                //clear set timeouts and return
                clearTimeout(timeout);
                return;
            }
            //mantain loop if it doesn't return
            window.requestAnimationFrame(loop);
        }, sortingSpeed); //delay value
    }

    if(isSorting){
        window.requestAnimationFrame(loop);
    }
    return;
}

function createUnsortedArray(size){
    let array = [];
    
    fillArray(array);
    shuffleArray(array);

    function shuffleArray(array) {
        for (let i = 0; i < size * 2; i++) {
            let a = Math.floor(Math.random() * size);
            let b = Math.floor(Math.random() * size);
            let c;
            c = array[a];
            array[a] = array[b];
            array[b] = c;
        }
    }

    function fillArray(array) {
        for (let i = 0; i < size; i++) {
            array.push(i);
        }
    }

    /*USING SETS - complexity directly dependent on Math.random(), 
    which may generate instances with a overwhelming amount of loops.
    Usage limited to small array sizes
    while(array.length != size){
        let num = Math.floor(Math.random()*size+1);
        array.push(num)

        array.forEach(i=>{
            array.forEach(j=>{
                if(i == j){
                    let set = new Set(array);
                    array = Array.from(set);
                }
            })
        })
    }  */ 
    return array;
}

function drawGraph(){
    for(let i = 0; i<unsortedArray.length; i++){
        drawColumn(
            canvas.width*0.05+(Column.getWidth()+Column.getGap())*i,
            unsortedArray[i],
            unsortedArray.length
        )
    }
    return;
}

function drawColumn(x, value, maxValue){
    column = new Column(x, value, maxValue);
    column.draw();
    return;
}

function mapNumberRange(number, fromLow, toLow, fromHigh, toHigh){
    //rule of three considering ranges
    i = toLow - fromLow;
    j = toHigh - fromHigh;

    return number*j/i+fromHigh;
}

function resetCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawCanvasBackground('#EF2D56');

    function drawCanvasBackground(color){
        ctx.fillStyle = color;
        ctx.fillRect(0,0,canvas.width,canvas.height);
        return;
    }

    return;
}

function createCanvas(){
    let canvas = document.querySelector('canvas');
    let ratio = Math.ceil(window.devicePixelRatio);

    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;

    canvas.style.width = window.innerWidth+'px';
    canvas.style.height = window.innerHeight+'px';

    return canvas;
}
