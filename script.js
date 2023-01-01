class Settings {
    constructor(method, order, speed, quantity) {
        this.method = method;
        this.order = order;
        this.speed = speed;
        this.quantity = quantity;
    }

    switchSortMethod() {
        if (this.method === 'bubblesort') {
            return new BubbleSort(this.order, unsortedArray.access);
        }
        else if (this.method === 'selectionsort') {
            return new SelectionSort(this.order, unsortedArray.access);
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
        this.topMargin = this.element.height * 0.95;
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
            self.element.addEventListener('click', sortNumberArray);
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
            self.element.width = window.innerWidth * self.ratio;
            self.element.height = window.innerHeight * self.ratio;
            return;
        }

        return;
    }

    reset() {
        let self = this

        clearScreen();
        drawBackground('#EF2D56');

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
    constructor(xPos, value) {
        let gapMultiplier = unsortedArray.access.length / (unsortedArray.access.length * 5) ** 2
        this.gap = (canvas.width) * gapMultiplier;
        this.x = xPos;
        this.value = value;
        this.width = ((canvas.width - (canvas.sideMargin * 2)) - (this.gap * (unsortedArray.access.length - 1))) / unsortedArray.access.length
        this.height = mapNumberRange(
            value,
            0,
            unsortedArray.access.length,
            canvas.height * 0.15, //min column height
            canvas.topMargin //max column height
        );
    }

    draw() {
        CTX.fillStyle = "#FFFFFC";
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

class BubbleSort {
    constructor(order, array) {
        this.order = order
        this.i = 0;
        this.isSortedCounter = 0;
        this.isSorting = true;
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
            this.isSorting = false;
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
        this.isSorting = true;

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
        /*
        console.log(`isSortedCounter=${this.isSortedCounter}`)
        console.log(`I=${this.i}`)
        console.log(`J=${this.j}`)
*/
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
            else{
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
            if(self.j >= self.array.length){
                self.isSorting = false;
                console.log('finished sorting')
            }
        }
    }
}

//global variables
const canvas = new Canvas('#EF2D56');
const CTX = canvas.context;
const sortSettings = new Settings('bubblesort', 'decreasing', 0, 3000);
var unsortedArray = new uArray(1000);

start();

//FUNCTIONS
function start() {

    updateCanvas();
    return;
}

function updateCanvas() {
    window.requestAnimationFrame(updateCanvas);
    canvas.reset();
    drawGraph();

    return;
}

function sortNumberArray() {
    let sortMethod = sortSettings.switchSortMethod();
    var loop = function () { //infinite loop
        let timeout = setTimeout(() => { //delay between operations
            if (sortMethod.isSorting) {
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
        }, sortSettings.speed); //delay value
    }

    if (sortMethod.isSorting) {
        window.requestAnimationFrame(loop);
    }

    return;
}

function drawGraph() {
    for (let i = 0; i < unsortedArray.access.length; i++) {
        let column = new Column(
            canvas.width * 0.05 + (Column.getWidth() + Column.getGap()) * i,
            unsortedArray.access[i],
            unsortedArray.access.length
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
