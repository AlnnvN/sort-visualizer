class Settings {
    constructor(method, order, delay, quantity) {
        this.method = method;
        this.order = order;
        this.delay = delay; //delay between operations
        this.quantity = quantity; //comparisons per operation
    }

    switchSortMethod() {
        if (this.method === 'bubblesort') {
            return new BubbleSort(this.order, graph.array.access);
        }
        else if (this.method === 'selectionsort') {
            return new SelectionSort(this.order, graph.array.access);
        }

    }
}

class uArray {
    constructor(size) {
        this.size = size;
        this.access = uArray.createUnsortedArray(this.size)
    }
    
    static createUnsortedArray(size) {
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

        return array;
    }
}

class Canvas {
    constructor(color) {
        this.element = document.getElementById('canvas');
        this.context = document.getElementById('canvas').getContext('2d');
        this.ratio = Math.ceil(window.devicePixelRatio);
        this.setup();

        //global variables
        this.height = this.element.height;
        this.width = this.element.width;

        //inner settings
        this.sideMargin = this.element.width * 0.05;
        this.topMargin = this.element.height * 0.85;
        this.bottomMargin = this.element.height * 0.02;


        this.color = color
    }

    setup() {
        self = this;
        adjustFromPixelRatio();
        limitCanvasSize();
        addScreenInput();


        function addScreenInput() {
            //click anywhere on the screen to start sorting
            self.element.addEventListener('click', () => {
                if (!isSorting) {
                    sortArray()
                }
            });
            return;
        }

        function limitCanvasSize() {
            //limiting the canvas size on the screen with css
            self.element.style.width = window.innerWidth + 'px';
            self.element.style.height = window.innerHeight + 'px';
            return;
        }

        function adjustFromPixelRatio() {
            //adjusting W/H proportionally to the pixel ratio with html
            self.element.width = window.innerWidth //* self.ratio; //TODO fix pixel adjustment so it can work with bootstrap
            self.element.height = window.innerHeight //* self.ratio; //TODO fix pixel adjustment so it can work with bootstrap 
            return;
        }

        return;
    }

    reset() {
        let self = this

        clearScreen();
        drawBackground(this.color);

        function clearScreen() {
            self.context.clearRect(0, 0, self.element.width, self.element.height);
        }

        function drawBackground(color) {
            self.context.fillStyle = color;
            self.context.fillRect(0, 0, self.element.width, self.element.height);
            return;
        }

        return;
    }
}

class Column {
    //352D39
    constructor(xPos, value) {
        let gapMultiplier = graph.array.access.length / (graph.array.access.length * 5) ** 2
        this.gap = (canvas.width) * gapMultiplier;
        this.x = xPos;
        this.color = "#EFE9E7";
        this.value = value;
        this.width = ((canvas.width - (canvas.sideMargin * 2)) - (this.gap * (graph.array.access.length - 1))) / graph.array.access.length
        this.height = mapNumberRange(
            value,
            0,
            graph.array.access.length,
            canvas.height * 0.15, //min column height
            canvas.topMargin //max column height
        );
    }

    draw() {
        CTX.fillStyle = this.color;
        CTX.fillRect(
            this.x,
            (canvas.height - canvas.bottomMargin),
            this.width,
            -this.height
        );
        return;
    }

    static getGap() {
        return new Column().gap;
    }

    static getWidth() {
        return new Column().width;
    }

    static getHeight() {
        return new Column().height;
    }
}

class Graph {
    constructor(size){
        this.size = size;
        this.array = new uArray(this.size);
        this.colors = {
            default:"#EFE9E7",
            unsorted: "red",
            sorted: "green",
            current: "blue",
            comparison: "purple"
        };
    }

   draw() {
        for (let i = 0; i < this.array.access.length; i++) {
            let column = new Column(
                canvas.width * 0.05 + (Column.getWidth() + Column.getGap()) * i,
                this.array.access[i]
            );
            column.draw()
        }
        return;
    }
}

class BubbleSort {
    constructor(order, array) {
        this.order = order
        this.i = 0;
        this.isSortedCounter = 0;
        isSorting = true;
        this.array = array;
    }

    sort() {
        if (this.order === 'increasing') {
            this.increasing();
            return;
        }
        else if (this.order === 'decreasing') {
            this.decreasing();
            return;
        }
    }

    increasing() {
        this.sortingAlgorithm(this.array[this.i] > this.array[this.i + 1]);
        return;
    }

    decreasing() {
        this.sortingAlgorithm(this.array[this.i] < this.array[this.i + 1]);
        return;
    }

    sortingAlgorithm(sortCondition) {

        if (sortCondition) {
            let c = this.array[this.i];
            this.array[this.i] = this.array[this.i + 1];
            this.array[this.i + 1] = c;
            this.isSortedCounter = 0;
        }
        else {
            this.isSortedCounter++
        }

        //check if its sorted
        if (this.isSortedCounter >= this.array.length) {
            isSorting = false;
        }

        this.i++; //next index

        //if loop through the array back from the start
        if (this.i >= this.array.length - 1) {
            this.i = 0;
        }
    }
}

class SelectionSort {
    constructor(order, array) {
        this.array = array;
        this.order = order
        this.isSortedCounter = 1;
        isSorting = true;

        this.minMax = {
            value: this.array[0],
            index: 0
        }

        this.k = 0;
        this.i = 0;
        this.j = 0;
    }

    sort() {
        if (this.order === 'increasing') {
            this.increasing();
            return;
        }
        else if (this.order === 'decreasing') {
            this.decreasing();
            return;
        }
    }

    increasing() {
        this.sortingAlgorithm(
            this.array[this.i] < this.minMax.value,
            this.array[this.k] < this.array[this.k + 1]
        );
        return;
    }

    decreasing() {
        this.sortingAlgorithm(
            this.array[this.i] > this.minMax.value,
            this.array[this.k] > this.array[this.k + 1]
        );
        return;
    }

    sortingAlgorithm(sortCondition, checkSortedCondition) {
        let self = this;

        checkIsSorted();
        finMinMaxNumber();
        switchPositions();


        //functions
        function switchPositions() {
            if (self.i >= self.array.length - 1 && self.j < self.array.length) {

                //loop i through the array back from the last switched position
                self.i = self.j + 1;

                //switching positions
                let c = self.array[self.j];
                self.array[self.j] = self.array[self.minMax.index];
                self.array[self.minMax.index] = c;

                //preparing for next loop
                self.j++;
                self.minMax.value = self.array[self.j];
                self.minMax.index = self.j;
            }
            else {
                //next index
                self.i++;
                return;
            }
            return;
        }

        function finMinMaxNumber() {
            if (sortCondition) {
                self.minMax.value = self.array[self.i];
                self.minMax.index = self.i;
            }
        }

        function checkIsSorted() {
            if (self.j >= self.array.length) {
                isSorting = false;
            }
        }
    }
}

class Input {
    constructor() {
        this.methodElement = document.getElementById('method-select');
        this.orderElement = document.getElementById('order-select');
        this.sizeElement = document.getElementById('size-input');
        this.sizeRangeElement = document.getElementById('size-range')
        this.delayElement = document.getElementById('delay-input');
        this.delayRangeElement = document.getElementById('delay-range');
        this.quantityElement = document.getElementById('qnt-input');
        this.quantityRangeElement = document.getElementById('qnt-range');
        this.resetBtn = document.getElementById('reset-btn');

        this.method = this.methodElement.value;
        this.order = this.orderElement.value;
        this.size = this.sizeElement.value;
        this.delay = this.delayElement.value;
        this.quantity = this.quantityElement.value;



        //method
        this.methodElement.addEventListener('change', () => {
            setup();
        })

        //order
        this.orderElement.addEventListener('change', () => {
            setup();
        })

        //size
        this.sizeElement.addEventListener('change', () => {
            setup();
        })
        this.sizeRangeElement.addEventListener('input', () => {
            this.sizeElement.value = this.sizeRangeElement.value;
        })
        this.sizeRangeElement.addEventListener('change', () => {
            setup();
        })

        //delay
        this.delayElement.addEventListener('change', () => {
            setup();
        })
        this.delayRangeElement.addEventListener('input', () => {
            this.delayElement.value = this.delayRangeElement.value;
        })
        this.delayRangeElement.addEventListener('change', () => {
            setup();
        })

        //quantity
        this.quantityElement.addEventListener('change', () => {
            setup();
        })
        this.quantityRangeElement.addEventListener('input', () => {
            this.quantityElement.value = this.quantityRangeElement.value;
        })
        this.quantityRangeElement.addEventListener('change', () => {
            setup();
        })

        //reset button
        this.resetBtn.addEventListener('click', () => {
            setup();
        })
    }

    update() {
        this.method = this.methodElement.value;
        this.order = this.orderElement.value;
        this.size = this.sizeElement.value;
        this.delay = this.delayElement.value;
        this.quantity = this.quantityElement.value;
    }
}

//global variables
const canvas = new Canvas('#05020a');
const CTX = canvas.context;
var input = new Input();

var sortSettings;
var graph;


//var graph.array;
var isSorting = false;

start();

//TODO Fix pixelrate for mobile resolutions
//TODO Add colors showing the sorting progress

//FUNCTIONS
function setup() {
    input.update();

    //graph.array = new uArray(input.size);
    graph = new Graph(input.size);
    sortSettings = new Settings(input.method, input.order, input.delay, input.quantity);
    return;
}

function start() {
    setup();
    updateCanvas(); //TODO Add method to canvas class
    return;
}

function updateCanvas() { //TODO Add method to canvas class
    window.requestAnimationFrame(updateCanvas);
    canvas.reset();
    drawGraph(); //TODO Add method to column class

    return;
}

function sortArray() { //TODO Add method to array class
    let sortMethod = sortSettings.switchSortMethod();

    var loop = function () { //infinite loop
        let timeout = setTimeout(() => { //delay between operations
            if (isSorting) {
                //define comparisons per operation
                for (let k = 0; k < sortSettings.quantity; k++) {
                    sortMethod.sort();
                }
            }
            else {
                //clear set timeouts and return
                clearTimeout(timeout);
                return;
            }
            //mantain loop if it doesn't return
            window.requestAnimationFrame(loop);
        }, input.delay); //delay value
    }

    if (isSorting) {
        window.requestAnimationFrame(loop);
    }

    return;
}

function drawGraph() {
    for (let i = 0; i < graph.array.access.length; i++) {
        let column = new Column(
            canvas.width * 0.05 + (Column.getWidth() + Column.getGap()) * i,
            graph.array.access[i]
        );
        column.draw()

    }
    return;
}

function mapNumberRange(number, fromLow, toLow, fromHigh, toHigh) {
    //rule of three considering ranges
    i = toLow - fromLow;
    j = toHigh - fromHigh;

    return number * j / i + fromHigh;
}

