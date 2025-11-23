const folderselecter = document.querySelector(".folderselect");
const file_list = document.querySelector(".file_list");

const folderdialog = document.createElement('input');

const preview = document.querySelector('.sc_priview');
const fromSlider = document.querySelector('#fromSlider');
const toSlider = document.querySelector('#toSlider');

const inputstarttime = document.querySelector('#inputstarttime');
const inputendtime = document.querySelector('#inputendtime');
const timelength = document.querySelector('#timelength');
const inputFrameRate = document.querySelector('#inputFrameRate');
const inputResize = document.querySelector('#inputResize');

const buttonCut = document.querySelector('#button-cut');
const cutted_container = document.querySelector("#cutted");

const inlineRadio1 = document.querySelector('#inlineRadio1');
const inlineRadio2 = document.querySelector('#inlineRadio2');

const folderselet = document.querySelector('#col-folderselet');

const btnfile = document.querySelector('#btnfile');

const HIDDEN_CLASSNAME = "hidden";

const MobileYN = MobileCheck();

let files = [];
let duration = 100;

let fromtime, totime;
let num_of_sample = 0;

let onRecording = false;

let sizetxt;
let downbtn;
let pimage;

let vwidth;
let vheight;
let vfps;
let frameInterval;

let captime = 0;

let canvas;
let ctx;

let encoder;

let spinner;

function MobileCheck() {
    const UserAgent = navigator.userAgent;
    if (UserAgent.indexOf('iPhone') > 0 || UserAgent.indexOf('iPod') > 0 || UserAgent.indexOf('Android') > 0) {
        inlineRadio1.checked = true;
        folderselet.classList.add(HIDDEN_CLASSNAME);
    
        const radiodiv = document.querySelector('#file-or-folder');
        radiodiv.classList.add(HIDDEN_CLASSNAME);
        return true;
    }
    return false;
}

function createspinner(){
    const inner_spinner = document.createElement('div');
    inner_spinner.classList.add('spinner-border');
    inner_spinner.setAttribute('role', 'status');
    inner_spinner.classList.add('m-5');
    spinner = document.createElement('div');
    spinner.classList.add('d-flex');
    spinner.classList.add('justify-content-center');
    spinner.classList.add('align-items-center');
    spinner.appendChild(inner_spinner);
}


function setProgressBar(){
    const pbBefore = document.querySelector('#pbBefore');
    const pbPlayed = document.querySelector('#pbPlayed');
    const pbNow = document.querySelector('#pbNow');
    const pbAfter = document.querySelector('#pbAfter');

    pbBefore.style.width = (fromtime / duration) * 100 + "%";
    pbPlayed.style.width = 0;
    pbNow.style.width = ((totime - fromtime) / duration) * 100 + "%";
    pbAfter.style.width = ((duration - totime) / duration) * 100 + "%";
}

function setoutsize(event){
    const outputwidth = document.querySelector('#outputwidth');
    const outputheight = document.querySelector('#outputheight');

    outputwidth.value = vwidth * inputResize.value / 100;
    outputheight.value = vheight * inputResize.value / 100;
}


function fpsChanged(event){
    vfps = inputFrameRate.value;
    frameInterval = 1 / vfps;
}

function initStatus() {
    fromtime = 0;
    totime = duration;

    fromSlider.value = 0;
    toSlider.value = duration;


    inputstarttime.max = duration;
    inputendtime.max = duration;

    inputstarttime.value = 0;
    inputendtime.value = duration;

    timelength.value = duration;
    
    vwidth = preview.videoWidth;
    vheight = preview.videoHeight;
    vfps = inputFrameRate.value;

    inputResize.value = 100;
    setoutsize();
    

    // const frameCount = Math.floor(duration * vfps);
    frameInterval = 1 / vfps;

    captime = 0;

    setProgressBar();
}

function moveRange(event) {
    [fromtime, totime] = [Math.floor(parseFloat(fromSlider.value) * 100) / 100, Math.floor(parseFloat(toSlider.value) * 100) / 100].sort(function (a, b) { return a - b; });

    inputstarttime.value = fromtime
    inputendtime.value = totime;
    timelength.value = (totime - fromtime).toFixed(2);

    preview.currentTime = fromtime;
    
    setProgressBar();
}

function setInputTime(event) {
    if (inputstarttime.value > inputendtime.value) {
        const tmp = inputstarttime.value;
        inputstarttime.value = inputendtime.value;
        inputendtime.value = tmp;
    }
    timelength.value = inputendtime.value - inputstarttime.value;
    fromSlider.value = inputstarttime.value;
    toSlider.value = inputendtime.value;
    moveRange();
}

function FileOpen(event) {
    const selectedFile = files[parseInt(event.target.id.split('_')[1])];
    const videourl = URL.createObjectURL(selectedFile);

    preview.setAttribute("src", videourl);

}

function FildLoaded(event) {
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


function videoPlaying(event) {
    const pbPlayed = document.querySelector('#pbPlayed');
    const pbNow = document.querySelector('#pbNow');
    
    pbPlayed.style.width = ((preview.currentTime - fromtime) / duration) * 100 + "%";
    pbNow.style.width = ((totime - preview.currentTime) / duration) * 100 + "%";

    if (preview.currentTime >= totime) {
        if(onRecording){
            onRecording = false;
            encoder.finish();
            const gif_url = 'data:image/gif;base64,' + encode64(encoder.stream().getData());
            pimage.src = gif_url;
            downbtn.href = gif_url;
            downbtn.download = 'BlogToolToolGIF.gif';

            fromSlider.disabled = false;
            toSlider.disabled = false;
            inputstarttime.disabled = false;
            inputendtime.disabled = false;
            inputFrameRate.disabled = false;
            inputResize.disabled = false;
            buttonCut.disabled = false;

            console.log(encoder);
            //get encoder file size to MegaByte
            const filesize = Math.floor(encoder.stream().getData().length / 1024 / 1024 * 100) / 100;
            // console.log(filesize);
            sizetxt.innerText = `파일 크기 : ${filesize}MB`;
            spinner.remove();
            pimage.classList.remove(HIDDEN_CLASSNAME);
            sizetxt.classList.remove(HIDDEN_CLASSNAME);
            downbtn.classList.remove(HIDDEN_CLASSNAME);
            
        }
        preview.currentTime = fromtime;
        preview.play();
    }else if(onRecording){
        preview.pause();
        if(preview.currentTime >= captime){
            ctx.drawImage(preview, 0, 0, vwidth  * inputResize.value / 100, vheight * inputResize.value / 100);
            encoder.addFrame(ctx);
            // console.log(preview.currentTime);
            captime += frameInterval;
        }
        preview.play();
    }
}

function createGIF() {
    // alert("변환에는 시간이 어느 정도 소요될 수 있습니다.");
    if(preview.src == ""){
        alert("변환할 파일을 선택해주세요.");
        return;
    }
    
    const tmp_card = document.createElement('div');
    tmp_card.id = `sample_${num_of_sample}`;
    tmp_card.classList.add('card');
    tmp_card.style.width = "18rem";
    createspinner();
    tmp_card.appendChild(spinner);
    pimage = document.createElement("img");
    pimage.classList.add('card-img-top');
    pimage.alt = "loading...";
    pimage.classList.add(HIDDEN_CLASSNAME);
    tmp_card.appendChild(pimage);
    cutted_container.appendChild(tmp_card);
    const tmp_card_body = document.createElement('div');
    tmp_card_body.classList.add('card-body');
    tmp_card.appendChild(tmp_card_body);
    sizetxt = document.createElement("p");
    sizetxt.classList.add('card-text');
    sizetxt.innerText = "파일 크기 : ";
    tmp_card_body.appendChild(sizetxt);
    downbtn = document.createElement("a");
    downbtn.classList.add('btn');
    downbtn.classList.add('btn-primary');
    downbtn.innerText = "다운로드";
    tmp_card_body.appendChild(downbtn);
    sizetxt.classList.add(HIDDEN_CLASSNAME);
    downbtn.classList.add(HIDDEN_CLASSNAME);

    canvas = document.createElement("canvas");
    
    // canvas.width = vwidth;
    // canvas.height = vheight;

    canvas.width = vwidth * inputResize.value / 100;
    canvas.height = vheight * inputResize.value / 100;

    ctx = canvas.getContext("2d", { willReadFrequently: true });
    
    encoder = new GIFEncoder();
    encoder.setRepeat(0);
    encoder.setDelay(1000 / vfps);
    
    fromSlider.disabled = true;
    toSlider.disabled = true;
    inputstarttime.disabled = true;
    inputendtime.disabled = true;
    inputFrameRate.disabled = true;
    inputResize.disabled = true;
    buttonCut.disabled = true;

    onRecording = true;
    encoder.start();
    preview.currentTime = fromtime;
    captime = fromtime;
    preview.play();
}

function radioChanged(event) {
    if (event.target.value == "optionfile") {
        folderselet.classList.add(HIDDEN_CLASSNAME);
    } else {
        folderselet.classList.remove(HIDDEN_CLASSNAME);
    }
}

function videoClick(event) {
    if (MobileYN) {
        event.preventDefault();
        const fileinput = document.createElement("input");
        fileinput.type = "file";
        fileinput.accept = "video/*";
        fileinput.addEventListener("change", function (event) {
            const file = event.target.files[0];
            if (file.type.includes("video")) {
                preview.src = URL.createObjectURL(file);
                preview.load();
                preview.currentTime = 0;
                preview.play();
            }   
        });
        fileinput.click();
    } else {
        if (preview.paused) {
            preview.play();
        } else {
            preview.pause();
        }
    }
}

function dropFile(event) {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file.type.includes("video")) {
        preview.src = URL.createObjectURL(file);
        preview.load();
        preview.currentTime = 0;
        preview.play();
    } else {
        alert("동영상 파일을 선택해주세요.");
    }
}

folderselecter.addEventListener("click", selectFolder);

fromSlider.addEventListener("change", moveRange);
toSlider.addEventListener("change", moveRange);

preview.addEventListener("loadeddata", FildLoaded);
preview.addEventListener("timeupdate", videoPlaying);
preview.addEventListener("ended", videoPlaying);
preview.addEventListener("click", videoClick);

preview.addEventListener("drop", dropFile);
preview.addEventListener("dragover", (event) => {
    event.preventDefault();
});


inputstarttime.addEventListener("change", setInputTime);
inputendtime.addEventListener("change", setInputTime);

inputFrameRate.addEventListener("change", fpsChanged);
inputResize.addEventListener("change", setoutsize);

buttonCut.addEventListener("click", createGIF);

inlineRadio1.addEventListener("change", radioChanged);
inlineRadio2.addEventListener("change", radioChanged);
