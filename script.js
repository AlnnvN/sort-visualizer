class Settings {
    constructor(method, order, delay, quantity) {
        this.method = method;
        this.order = order;
        this.delay = delay; //delay between operations
        this.quantity = quantity; //comparisons per operation
        this.showColors = true;
    }

    getSortMethod() {

        if (this.method === 'bubblesort') {

            return new BubbleSort(this.order, graph.array);
        }
        else if (this.method === 'selectionsort') {
            return new SelectionSort(this.order, graph.array);
        }

    }
}

class uArray {

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
    constructor(value) {
        let gapMultiplier = input.size / (input.size * 5) ** 2
        this.gap = (canvas.width) * gapMultiplier;
        this.color = "#EFE9E7";
        this.value = value;
        this.width = ((canvas.width - (canvas.sideMargin * 2)) - (this.gap * (input.size - 1))) / input.size
        this.height = mapNumberRange(
            value,
            0,
            input.size,
            canvas.height * 0.15, //min column height
            canvas.topMargin //max column height
        );
    }

    draw(x) {
        CTX.fillStyle = this.color;
        CTX.fillRect(
            x,
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
    constructor(size) {
        this.size = size;
        this.array = this.createColumnArray(this.size);
        this.colors = {
            default: "#EFE9E7",
            unsorted: "red",
            sorted: "green",
            current: "blue",
            comparison: "purple"
        };
    }

    draw() {
        this.array.forEach((column, index) => {
            column.draw(canvas.width * 0.05 + (Column.getWidth() + Column.getGap()) * index);
        })
        return;
    }

    createColumnArray(size) {
        let array = [];
        let numbers = uArray.createUnsortedArray(size);

        numbers.forEach(number => {
            array.push(new Column(number));
        })
        return array;
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
        this.sortingAlgorithm(this.array[this.i].value > this.array[this.i + 1].value);
        return;
    }

    decreasing() {
        this.sortingAlgorithm(this.array[this.i].value < this.array[this.i + 1].value);
        return;
    }

    sortingAlgorithm(sortCondition) {

        if(sortSettings.showColors){
            if(this.i>0){
                this.array[this.i-1].color = graph.colors.default;
                this.array[this.i].color = graph.colors.default;
            }
            this.array[this.i].color = graph.colors.current;
            this.array[this.i+1].color = graph.colors.comparison;
        }
        

        //switch places
        if (sortCondition) {
            [this.array[this.i],
            this.array[this.i + 1]] = [this.array[this.i + 1],
            this.array[this.i]]

            this.isSortedCounter = 0;
        }
        else {
            this.isSortedCounter++
        }

        //check if its sorted
        if (this.isSortedCounter >= graph.size) {
            if(sortSettings.showColors){
                this.array[this.i].color = graph.colors.default;
                this.array[this.i+1].color = graph.colors.default;
            }
            isSorting = false;
        }


        

        this.i++; //next index
        //if loop through the array back from the start
        if (this.i >= graph.size - 1) {
            if(sortSettings.showColors){
                this.array[this.i-1].color = graph.colors.default;
                this.array[this.i].color = graph.colors.default;
            }
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
            value: this.array[0].value,
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
            this.array[this.i].value < this.minMax.value
        );
        return;
    }

    decreasing() {
        this.sortingAlgorithm(
            this.array[this.i].value > this.minMax.value
        );
        return;
    }

    sortingAlgorithm(sortCondition) {
        let self = this;

        if(isSorting){
            finMinMaxNumber();
            switchPositions();
            checkIsSorted();
        }
        
        //functions
        function switchPositions() {
            if (self.i >= graph.size - 1 && self.j < graph.size) {

                //loop i through the array back from the last switched position
                self.i = self.j + 1;

                //switching positions
                [self.array[self.j],
                self.array[self.minMax.index]] = [self.array[self.minMax.index],
                self.array[self.j]]

                //preparing for next loop
                self.j++;
                console.log(self.j)
                self.minMax.value = self.array[self.j].value;
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
                self.minMax.value = self.array[self.i].value;
                self.minMax.index = self.i;
            }
        }

        function checkIsSorted() {
            if (self.j >= graph.size-1) {
                console.log('ACABOU PORRA CARALHO')
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
var isSorting;

start();

//TODO Fix pixelrate for mobile resolutions
//TODO Add colors showing the sorting progress

//FUNCTIONS
function setup() {
    isSorting = false;
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
    graph.draw(); //TODO Add method to column class

    return;
}

function sortArray() { //TODO Add method to array class
    let sortMethod = sortSettings.getSortMethod();

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

function mapNumberRange(number, fromLow, toLow, fromHigh, toHigh) {
    //rule of three considering ranges
    i = toLow - fromLow;
    j = toHigh - fromHigh;

    return number * j / i + fromHigh;
}

