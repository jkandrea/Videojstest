const preview = document.querySelector('#sc_priview');
const wmtext = document.querySelector('#inputtext');
const wmtextsize = document.querySelector('#inputFontSize');
const imgresize = document.querySelector('#inputResize');
const fontcolor = document.querySelector('#inputFontColor');
const fontopacity = document.querySelector('#inputFontOpacity');
const fontalign = document.querySelector('#inputFontAlign');

const downbtn = document.querySelector('#button-download');
const copybtn = document.querySelector('#button-copy');

let origin_src = preview.src;

function dropFile(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file.type.includes("image")) {
        preview.src = URL.createObjectURL(file);
        origin_src = preview.src;
        setWatermark();
    } else {
        alert("이미지 파일을 선택해주세요.");
    }
}

function imagePaste(event) {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (const item of items) {
        console.log(item.type);
        if (item.type.includes("image")) {
            const blob = item.getAsFile();
            preview.src = URL.createObjectURL(blob);
            origin_src = preview.src;
            setWatermark();
        } else {
            alert("이미지 파일을 선택해주세요.");
        }
    }
}

function previewClick(event) {
    event.preventDefault();
    const fileinput = document.createElement("input");
    fileinput.type = "file";
    fileinput.accept = "image/*";
    fileinput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        if (file.type.includes("image")) {
            preview.src = URL.createObjectURL(file);
            origin_src = preview.src;
            setWatermark()
        }   
    });
    fileinput.click();
}

function setWatermark(){
    // const wmtext = localStorage.getItem("wmtext");
    wmtextvalue = wmtext.value;
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const img = new Image();
    img.src = origin_src;
    textsize = parseInt(wmtextsize.value);
    img.onload = function () {
        saveatlocalstorage();
        setSizeText();
        const imgwidth = img.width * imgresize.value / 100;
        const imgheight = img.height * imgresize.value / 100;
        if(fontalign.value == "6"||fontalign.value == "7"){
            canvas.width = imgwidth;
            canvas.height = imgheight + textsize + 5;
        }else{
            canvas.width = imgwidth;
            canvas.height = imgheight;
        }
        if (fontcolor.value == "#ffffff") {
            context.fillStyle = "rgba(0, 0, 0, 1.0)";
        } else {
            context.fillStyle = "rgba(255, 255, 255, 1.0)";
        }
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0,imgwidth,imgheight);
        // context.font = "bold 30px sans-serif";
        context.font = "bold " + textsize + "px sans-serif";
        context.fillStyle = "rgba(" + parseInt(fontcolor.value.substr(1,2),16) + ", " + parseInt(fontcolor.value.substr(3,2),16) + ", "+ parseInt(fontcolor.value.substr(5,2),16) + ", " + fontopacity.value + ")";
        if(fontalign.value == "1"){
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(wmtextvalue, canvas.width / 2, canvas.height / 2);
        }else if(fontalign.value == "2"){
            context.textAlign = "left";
            context.textBaseline = "top";
            context.fillText(wmtextvalue, 5, 5);
        }else if(fontalign.value == "3"){
            context.textAlign = "right";
            context.textBaseline = "top";
            context.fillText(wmtextvalue, canvas.width, 5);
        }else if(fontalign.value == "4"||fontalign.value == "6"){
            context.textAlign = "left";
            context.textBaseline = "bottom";
            context.fillText(wmtextvalue, 5, canvas.height);
        }else if(fontalign.value == "5"||fontalign.value == "7"){
            context.textAlign = "right";
            context.textBaseline = "bottom";
            context.fillText(wmtextvalue, canvas.width, canvas.height);
        }else{
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillText(wmtextvalue, canvas.width / 2, canvas.height / 2);
        }
        // context.fillStyle = "rgba(255, 255, 255, 0.5)";
        
        preview.src = canvas.toDataURL("image/png");
    }
}

function setSizeText(){
    const width = document.querySelector('#outputwidth');
    const height = document.querySelector('#outputheight');
    width.value = preview.width;
    height.value = preview.height;
}

function saveatlocalstorage() {
    localStorage.setItem("wmtext", wmtext.value);
    localStorage.setItem("wmtextsize", wmtextsize.value);
    localStorage.setItem("imgresize", imgresize.value);
    localStorage.setItem("fontcolor", fontcolor.value);
    localStorage.setItem("fontopacity", fontopacity.value);
    localStorage.setItem("fontalign", fontalign.value);
}

function downloadImage() {
    const a = document.createElement("a");
    a.href = preview.src;
    a.download = "Blogtooltoolwm.png";
    a.click();
}

function copyImage() {
    const { ClipboardItem } = window;
    const imgsrc = preview.src;
    fetch(imgsrc).then(res => res.blob()).then(blob => {
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]);
    });
}

preview.addEventListener("drop", dropFile);
preview.addEventListener("dragover", (event) => {
    event.preventDefault();
});
preview.addEventListener("click", previewClick);

if (localStorage.getItem("wmtext") != null) {
    wmtext.value = localStorage.getItem("wmtext");
}
if (localStorage.getItem("wmtextsize") != null) {
    wmtextsize.value = localStorage.getItem("wmtextsize");
}
if (localStorage.getItem("imgresize") != null) {
    imgresize.value = localStorage.getItem("imgresize");
}
if (localStorage.getItem("fontcolor") != null) {
    fontcolor.value = localStorage.getItem("fontcolor");
}
if (localStorage.getItem("fontopacity") != null) {
    fontopacity.value = localStorage.getItem("fontopacity");
}
if (localStorage.getItem("fontalign") != null) {
    fontalign.value = localStorage.getItem("fontalign");
}

wmtext.addEventListener("change", setWatermark);
wmtextsize.addEventListener("change", setWatermark);
imgresize.addEventListener("change", setWatermark);
fontcolor.addEventListener("change", setWatermark);
fontopacity.addEventListener("change", setWatermark);
fontalign.addEventListener("change", setWatermark);

downbtn.addEventListener("click", downloadImage);
copybtn.addEventListener("click", copyImage);


//화면 띄워놓고 붙여넣기 단축키 누를 경우 이벤트
document.addEventListener("paste", imagePaste);
document.addEventListener("copy", copyImage);