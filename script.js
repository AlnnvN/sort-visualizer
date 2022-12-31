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
var sideMargin = canvas.width*0.05;
var topMargin = canvas.height*0.95;
var bottomMargin = canvas.height*0.02;
var unsortedArray;
var isSorting = true;
var sortingSpeed = 0 //delay between operations
var sortersQnt = 3000; //comparisons per operation

class BubbleSort{
    constructor(){
        this.i = 0;
        this.isSortedCounter = 0;
    }

    increasing(){
        this.sort(unsortedArray[this.i] > unsortedArray[this.i + 1]);
        return;
    }

    decreasing(){
        this.sort(unsortedArray[this.i] < unsortedArray[this.i + 1]);
        return;
    }

    sort(sortCondition){
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

start();

canvas.addEventListener('click', sortNumberArray)

//FUNCTIONS
function start(){
    unsortedArray = createUnsortedArray(1000);    
    update();
    return;
}

function update(){
    window.requestAnimationFrame(update);
    resetCanvas();
    drawGraph();
}

function sortNumberArray(){
    //let isSortedCounter = 0;
    let bubbleSort = new BubbleSort();

    var loop = function () {
        setTimeout(function () {
            if(isSorting){
                for(let k =0; k<sortersQnt; k++){
                    //sortLoop();    
                    bubbleSort.increasing();     
                }
                window.requestAnimationFrame(loop);
            }
            else{
                return;
            }
              
        }, sortingSpeed);
    }

    if(isSorting){
        window.requestAnimationFrame(loop);
    }
    

    //FUNCTIONS
    function sortLoop() {
        let i;
            //initialize i
            if(i === undefined){
                i = 0;
                console.log(i)
            }

            //sort increasing
            if (unsortedArray[i] > unsortedArray[i + 1]) {
                let c = unsortedArray[i];
                unsortedArray[i] = unsortedArray[i + 1];
                unsortedArray[i + 1] = c;
                isSortedCounter = 0;
            }
            else{
                isSortedCounter++
            }

            //check if its sorted
            if(isSortedCounter >= unsortedArray.length){
                isSorting = false; 
            }
    
            i++; //next index

            //if loop through the array back from the start
            if (i >= unsortedArray.length - 1) {
                i = 0;
            }
    }

}

function createUnsortedArray(size){
    let array = [];
    
    for(let i = 0; i<size;i++){
        array.push(i);
    }
    for(let i = 0; i<size*2;i++){
        let a = Math.floor(Math.random()*size);
        let b = Math.floor(Math.random()*size);
        let c;
        c = array[a];
        array[a] = array[b];
        array[b] = c;
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
    cleiton = new Column(x, value, maxValue);
    cleiton.draw();
    return;
}

function mapNumberRange(number, fromLow, toLow, fromHigh, toHigh){
    i = toLow - fromLow;
    j = toHigh - fromHigh;

    return number*j/i+fromHigh;
}

function resetCanvas(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    drawCanvasBackground('#EF2D56');
    return;
}

function drawCanvasBackground(color){
    ctx.fillStyle = color;
    ctx.fillRect(0,0,canvas.width,canvas.height);
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
