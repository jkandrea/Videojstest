const preview = document.querySelector('#sc_priview');
const wmtext = document.querySelector('#inputtext');
const wmtextsize = document.querySelector('#inputFontSize');
const imgresize = document.querySelector('#inputResize');
const fontcolor = document.querySelector('#inputFontColor');
const fontopacity = document.querySelector('#inputFontOpacity');
const fontalign = document.querySelector('#inputFontAlign');

const thumbnailtype = document.querySelector('#inputThumbnailType'); 
const outlineyn = document.querySelector('#inputOutlineYN');
const outlinecolor = document.querySelector('#inputOutlineColor');
const outlineThick = document.querySelector('#inputOutlineThick');

const downbtn = document.querySelector('#button-download');
const copybtn = document.querySelector('#button-copy');

let origin_src = preview.src;

const page_name = document.querySelector("h1").innerText=="워터마크 추가"?"wmark":"bthumb";

function dropFile(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file.type.includes("image")) {
        preview.src = URL.createObjectURL(file);
        origin_src = preview.src;
        setText();
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
            setText();
            return;
        } else {
            alert("이미지 파일을 선택해주세요.");
            return;
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
            setText()
        }   
    });
    fileinput.click();
}

function setText(){
    if(page_name == "wmark"){
        setWatermark()
    }else if(page_name == "bthumb"){
        setThumbnail()
    }
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

function setThumbnail(){
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
        let imgwidth = imgresize.value;
        let imgheight = imgresize.value;
        if(thumbnailtype.value == "1"||thumbnailtype.value == "3"){
            imgwidth = imgresize.value;
            imgheight = imgwidth;
        }else if(thumbnailtype.value == "2"||thumbnailtype.value == "4"){
            imgwidth = imgresize.value;
            imgheight = imgwidth * 9 / 16;
        }
        canvas.width = imgwidth;
        canvas.height = imgheight;

        if (fontcolor.value == "#ffffff") {
            context.fillStyle = "rgba(0, 0, 0, 1.0)";
        } else {
            context.fillStyle = "rgba(255, 255, 255, 1.0)";
        }
        context.fillRect(0, 0, canvas.width, canvas.height);
        if(thumbnailtype.value == "3"||thumbnailtype.value == "4"){
            context.drawImage(img, 0, 0,imgwidth,imgheight);
        }else{
            const imgsx = img.width;
            const imgsy = img.height;
            let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;
            
            if(thumbnailtype.value == "1"){
                // Crop to square
                if(imgsx > imgsy){
                    sourceX = (img.width - img.height) / 2;
                    sourceWidth = img.height;
                } else if(imgsx < imgsy){
                    sourceY = (img.height - img.width) / 2;
                    sourceHeight = img.width;
                }
            } else if(thumbnailtype.value == "2"){
                // Crop to 16:9
                const targetRatio = 16 / 9;
                const imgRatio = imgsx / imgsy;
                if(imgRatio > targetRatio){
                    sourceX = (img.width - img.height * targetRatio) / 2;
                    sourceWidth = img.height * targetRatio;
                } else if(imgRatio < targetRatio){
                    sourceY = (img.height - img.width / targetRatio) / 2;
                    sourceHeight = img.width / targetRatio;
                }
            }
            context.drawImage(img, sourceX, sourceY, sourceWidth, sourceHeight, 0, 0, imgwidth, imgheight);
        }
        // context.font = "bold 30px sans-serif";
        const lineoutline = "rgba(" + parseInt(outlinecolor.value.substr(1,2),16) + ", " + parseInt(outlinecolor.value.substr(3,2),16) + ", "+ parseInt(outlinecolor.value.substr(5,2),16) + ", " + fontopacity.value + ")";
        context.font = "bold " + textsize + "px sans-serif";
        context.fillStyle = "rgba(" + parseInt(fontcolor.value.substr(1,2),16) + ", " + parseInt(fontcolor.value.substr(3,2),16) + ", "+ parseInt(fontcolor.value.substr(5,2),16) + ", " + fontopacity.value + ")";
        context.strokeStyle = lineoutline; // Set the color of the text outline
        context.lineWidth = parseInt(outlineThick.value, 10); // Set the width of the text outline
        const lines = wmtextvalue.split('\\n');
        const lineHeight = parseInt(textsize, 10) + 5; // Or whatever line height you want
        
        if(fontalign.value == "1"){
            context.textAlign = "center";
            context.textBaseline = "middle";
            const initialY = canvas.height / 2 - (lines.length-1)/2*lineHeight;
            for (let i = 0; i < lines.length; i++) {
                if(outlineyn.checked){
                    context.strokeText(lines[i], canvas.width / 2, initialY + i*lineHeight); // Draw the text outline
                }
                context.fillText(lines[i], canvas.width / 2, initialY + i*lineHeight);
            }
        }else if(fontalign.value == "2"){
            context.textAlign = "left";
            context.textBaseline = "top";
            for (let i = 0; i < lines.length; i++) {
                if(outlineyn.checked){
                    context.strokeText(lines[i], 5, 5 + i*lineHeight); // Draw the text outline
                }
                context.fillText(lines[i], 5, 5 + i*lineHeight);
            }
        }else if(fontalign.value == "3"){
            context.textAlign = "right";
            context.textBaseline = "top";
            for (let i = 0; i < lines.length; i++) {
                if(outlineyn.checked){
                    context.strokeText(lines[i], canvas.width, 5 + i*lineHeight); // Draw the text outline
                }
                context.fillText(lines[i], canvas.width, 5 + i*lineHeight);
            }
        }else if(fontalign.value == "4"){
            context.textAlign = "left";
            context.textBaseline = "bottom";
            for (let i = 0; i < lines.length; i++) {
                if(outlineyn.checked){
                    context.strokeText(lines[i], 5, canvas.height - (lines.length-1-i)*lineHeight); // Draw the text outline
                }
                context.fillText(lines[i], 5, canvas.height - (lines.length-1-i)*lineHeight);
            }
        }else if(fontalign.value == "5"){
            context.textAlign = "right";
            context.textBaseline = "bottom";
            for (let i = 0; i < lines.length; i++) {
                if(outlineyn.checked){
                    context.strokeText(lines[i], canvas.width, canvas.height - (lines.length-1-i)*lineHeight); // Draw the text outline
                }
                context.fillText(lines[i], canvas.width, canvas.height - (lines.length-1-i)*lineHeight);
            }
        }else{
            context.textAlign = "center";
            context.textBaseline = "middle";
            const initialY = canvas.height / 2 - (lines.length-1)/2*lineHeight;
            for (let i = 0; i < lines.length; i++) {
                if(outlineyn.checked){
                    context.strokeText(lines[i], canvas.width / 2, initialY + i*lineHeight); // Draw the text outline
                }
                context.fillText(lines[i], canvas.width / 2, initialY + i*lineHeight);
            }
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
    localStorage.setItem(page_name + "_wmtext", wmtext.value);
    localStorage.setItem(page_name + "_wmtextsize", wmtextsize.value);
    localStorage.setItem(page_name + "_imgresize", imgresize.value);
    localStorage.setItem(page_name + "_fontcolor", fontcolor.value);
    localStorage.setItem(page_name + "_fontopacity", fontopacity.value);
    localStorage.setItem(page_name + "_fontalign", fontalign.value);

    if(page_name == "bthumb"){
        localStorage.setItem("bthumb_ttype", thumbnailtype.value);
        localStorage.setItem("bthumb_outlineyn", outlineyn.checked);
        localStorage.setItem("bthumb_outlinecolor", outlinecolor.value);
        localStorage.setItem("bthumb_outlinethick", outlineThick.value);
    }
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


if (localStorage.getItem(page_name + "_wmtext") != null) {
    wmtext.value = localStorage.getItem(page_name + "_wmtext");
}
if (localStorage.getItem(page_name +"_wmtextsize") != null) {
    wmtextsize.value = localStorage.getItem(page_name +"_wmtextsize");
}
if (localStorage.getItem(page_name +"_imgresize") != null) {
    imgresize.value = localStorage.getItem(page_name +"_imgresize");
}
if (localStorage.getItem(page_name +"_fontcolor") != null) {
    fontcolor.value = localStorage.getItem(page_name +"_fontcolor");
}
if (localStorage.getItem(page_name +"_fontopacity") != null) {
    fontopacity.value = localStorage.getItem(page_name +"_fontopacity");
}
if (localStorage.getItem(page_name +"_fontalign") != null) {
    fontalign.value = localStorage.getItem(page_name +"_fontalign");
}

if(page_name == "bthumb"){
    if(localStorage.getItem("bthumb_ttype") != null){
        thumbnailtype.value = localStorage.getItem("bthumb_ttype");
        outlineyn.checked = localStorage.getItem("bthumb_outlineyn");
        outlinecolor.value = localStorage.getItem("bthumb_outlinecolor");
        outlineThick.value = localStorage.getItem("bthumb_outlinethick");
    }
}
    

wmtext.addEventListener("change", setText);
wmtextsize.addEventListener("change", setText);
imgresize.addEventListener("change", setText);
fontcolor.addEventListener("change", setText);
fontopacity.addEventListener("change", setText);
fontalign.addEventListener("change", setText);

if(page_name == "bthumb"){
    thumbnailtype.addEventListener("change", setText);
    outlineyn.addEventListener("change", setText);
    outlinecolor.addEventListener("change", setText);
    outlineThick.addEventListener("change", setText);
}

downbtn.addEventListener("click", downloadImage);
copybtn.addEventListener("click", copyImage);


//화면 띄워놓고 붙여넣기 단축키 누를 경우 이벤트
document.addEventListener("paste", imagePaste);
document.addEventListener("copy", copyImage);