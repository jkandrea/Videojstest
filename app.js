const folderselecter = document.querySelector(".folderselect");
const file_list = document.querySelector(".file_list");

const folderdialog = document.createElement('input');

const preview = document.querySelector('.sc_priview');
const fromSlider = document.querySelector('#fromSlider');
const toSlider = document.querySelector('#toSlider');

const inputstarttime = document.querySelector('#inputstarttime');
const inputendtime = document.querySelector('#inputendtime');
const timelength = document.querySelector('#timelength');

const buttonCut = document.querySelector('#button-cut');

let files = [];
let duration = 100;

let fromtime,totime;

function initStatus(){
    fromtime = 0;
    totime = duration;
    
    fromSlider.value = 0;
    toSlider.value = duration;
    
    
    const pbBefore = document.querySelector('#pbBefore');
    const pbNow = document.querySelector('#pbNow');
    const pbAfter = document.querySelector('#pbAfter');
    
    inputstarttime.max = duration;
    inputendtime.max = duration;
    
    inputstarttime.value = 0;
    inputendtime.value = duration;
    
    timelength.value = duration;
    
    pbBefore.style.width = (fromtime / duration) * 100 + "%";
    pbNow.style.width = ((totime - fromtime) / duration) * 100 + "%";
    pbAfter.style.width = ((duration - totime) / duration) * 100 + "%";
}

function FileOpen(event) {
    const selectedFile = files[parseInt(event.target.id.split('_')[1])];
    const videourl = URL.createObjectURL(selectedFile);
    
    preview.setAttribute("src", videourl);
    
}

function FildLoaded(event){
    duration = Math.floor(preview.duration * 100) / 100;
    fromSlider.max = duration;
    toSlider.max = duration;
    
    initStatus();
    
    preview.play();
}

function createlist(event) {
    files = folderdialog.files;

    let i = 0;

    Array.from(files).forEach(element => {
        if (element.type.split('/')[0] == 'video') {
            // console.log(element);
            const btn = document.createElement('button');
            btn.classList.add('list-group-item');
            btn.classList.add('list-group-item-action');
            btn.innerText = element.name;
            btn.id = `file_${i}`;
            btn.addEventListener("click", FileOpen)
            file_list.appendChild(btn);
        }
        i = i + 1;
    });
}

function selectFolder(event) {
    folderdialog.type = 'file';
    folderdialog.webkitdirectory = true;
    folderdialog.addEventListener("change", createlist);
    folderdialog.click();
}

function moveRange(event){
    [fromtime,totime] = [Math.floor(parseFloat(fromSlider.value)*100)/100 ,Math.floor(parseFloat(toSlider.value)*100)/100].sort(function(a,b) { return a - b;});
    
    const pbBefore = document.querySelector('#pbBefore');
    const pbNow = document.querySelector('#pbNow');
    const pbAfter = document.querySelector('#pbAfter');
    
    inputstarttime.value = fromtime
    inputendtime.value = totime;
    timelength.value = (totime - fromtime).toFixed(2);
    
    pbBefore.style.width = (fromtime / duration) * 100 + "%";
    pbNow.style.width = ((totime - fromtime) / duration) * 100 + "%";
    pbAfter.style.width = ((duration - totime) / duration) * 100 + "%";
    
    preview.currentTime = fromtime;
    preview.play()
}

function videoPlaying(event){
    if(preview.currentTime >= totime){
        preview.pause();
        preview.currentTime = fromtime;
        // preview.play();
    }
}


function setInputTime(event){
    if(inputstarttime.value > inputendtime.value){
        const tmp = inputstarttime.value;
        inputstarttime.value =  inputendtime.value;
        inputendtime.value = tmp;
    }
    timelength.value = inputendtime.value - inputstarttime.value;
    fromSlider.value = inputstarttime.value;
    toSlider.value = inputendtime.value;
    moveRange();
}

function createFile(event){
    const vwidth = preview.videoWidth;
    const vheight = preview.videoHeight;
    console.log('finished');
    
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const gif = new GIF({
      workers: 2,
      quality: 10, // You can adjust the quality (1 to 30)
      width: video.videoWidth,
      height: video.videoHeight,
    });
    
    console.log('finished');
    
}
    function convertVideoToGIF(){
        const vwidth = preview.videoWidth;
        const vheight = preview.videoHeight;
        const gif = new GIF({
          workers: 1,
          quality: 10, // You can adjust the quality (1 to 30)
          width: vwidth,
          height: vheight,
        });
        gif.on("finished", function(blob) {
          window.open(URL.createObjectURL(blob));
        });
        gif.on("progress", function(p) {
          console.log(p);
        });
        gif.on("error", function(reason) {
          console.error(reason);
        });
        gif.on("abort", function() {
          console.error("abort");
        });
        
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        
        const fps = 10;
        const frameCount = Math.floor(duration * fps);
        const frameInterval = 1 / fps;
        
        canvas.width = vwidth;
        canvas.height = vheight;
        
        let i = 0;
        let time = 0;

        // ctx.drawImage(preview, 0, 0, vwidth, vheight);

        // console.log(ctx);

        // const win = document.getElementById("cutted");

        // win.appendChild(canvas);

        

        for(i = fromtime; i < totime; i = i + frameInterval){
          preview.currentTime = fromtime;
          ctx.drawImage(preview, 0, 0, vwidth, vheight);
          gif.addFrame(ctx, {copy: true, delay: frameInterval * 1000});
        }
        console.log(gif);
        gif.render();

        // for(i = fromtime; i < totime; i = i + frameInterval){
        //   ctx.drawImage(preview, 0, 0, vwidth, vheight);
        // }
        // const drawFrame = function() {
        //     ctx.drawImage(preview, 0, 0, vwidth, vheight);
        //     gif.addFrame(ctx, {copy: true, delay: frameInterval * 1000});
        //     i = i + 1;
        //     time = time + frameInterval;
        //     if(i < frameCount){
        //         preview.currentTime = time;
        //         requestAnimationFrame(drawFrame);
        //     }else{
        //         gif.render();
        //     }
        // }
        // drawFrame();
    }

folderselecter.addEventListener("click", selectFolder);
fromSlider.addEventListener("input",moveRange);
toSlider.addEventListener("input",moveRange);
preview.addEventListener("loadeddata",FildLoaded);
preview.addEventListener("timeupdate",videoPlaying);
preview.addEventListener("ended",videoPlaying);

inputstarttime.addEventListener("change",setInputTime);
inputendtime.addEventListener("change",setInputTime);

buttonCut.addEventListener("click",convertVideoToGIF);