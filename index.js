const canvas = document.getElementById("canvas");
const toolbar = document.getElementById("toolbar")

const ctx = canvas.getContext("2d");  // 2D rendering context of canvas element

canvas.width = canvas.clientWidth; // Set the canvas width to its container's client width
canvas.height = canvas.clientHeight;

let line_width = 5;
let isWriting = false;

//coordinates of X and Y where the mouse is pointing to
let startX; 
let startY;

let history = []; // Array to store drawing history
let historyIndex = -1; // Current position in history array

// Function to save current canvas state to history
function saveState() {
    // Increment history index
    historyIndex++;
    // Remove any actions that exist after the current position in history
    history.splice(historyIndex);
    // Save the current canvas state
    history.push(canvas.toDataURL());
}

// Function to undo the last drawing action
function undo() {
    if (historyIndex > 0) {
        historyIndex--;
        const img = new Image();
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = history[historyIndex];
    }
}

// Function to redo the last undone drawing action
function redo() {

        historyIndex++;
        const img = new Image();
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = history[historyIndex];
    
}

// Add event listener for keydown event to capture keyboard shortcuts for undo and redo
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key === 'z') { // Ctrl + Z for undo
        undo();
    } else if (e.ctrlKey && e.key === 'y') { // Ctrl + Y for redo
        redo();
    }
});

document.addEventListener('keydown' , e=>{ // keydown refers to any key on keyboard being pressed
    if(e.code == "Enter")            // when enter is pressed prevent it from its default behaviour ie reloading the page
    {
        e.preventDefault();
    }
});

toolbar.addEventListener('click' ,e=>{
    if(e.target.id == "clear")
    {
        ctx.clearRect(0 , 0 , canvas.width , canvas.height) //whole rect area is cleared hence (x,y) = (0,0)
        saveState();
    }
});

toolbar.addEventListener('change' , e=>{
    if(e.target.id == "stroke")
    {
        console.log(e.target.value);
        ctx.strokeStyle = e.target.value;  //strokeStyle is used to change color , gradient , pattern
    }

    if(e.target.id == "line-width")
    {    
        console.log(e.target.value);
        line_width = e.target.value;
        ctx.lineWidth = e.target.value;
    }
});

const draw = (e) =>{
    if(!isWriting)
        {
            return;
        }
    
    ctx.lineWidth = line_width;
    ctx.lineCap = 'round';
    ctx.lineTo(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
    ctx.stroke();
}

// This event is triggered when a mouse button is pressed down (i.e., clicked) while the pointer is over an element, such as a button or a canvas. It can be used to initiate actions like starting a drag operation, triggering a drawing action, or handling user interactions.
canvas.addEventListener('mousedown' , e=>{
    isWriting = true; 
    // clientX and client Y will give the coordinates where the mouse is pointing to
    startX = e.clientX; 
    startY= e.clientY;
    saveState();
});


canvas.addEventListener('mouseup', e=>{
    isWriting = false;
    ctx.stroke();       // To draw a line
    ctx.beginPath();    //this starts a new path , this is required because when we next start drawing it shouldnt be   connected to the previous line
});

canvas.addEventListener('mousemove' , draw);


let ext = 'pdf';
extension = document.getElementById("format");
extension.addEventListener('change', e=>{

    ext = extension.value;
}); 

function downloadImage()
{
    const dataURL = canvas.toDataURL();

    const downnloadLink = document.createElement('a');
    downnloadLink.href = dataURL;

    downnloadLink.download = 'image'+'.'+ ext;
    downnloadLink.click();

}

downloadButton = document.getElementById("save");
downloadButton.addEventListener('click' , downloadImage);



