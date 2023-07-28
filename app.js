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

const buttonCut = document.querySelector('#button-cut');
const cutted_container = document.querySelector("#cutted");

let files = [];
let duration = 100;

let fromtime, totime;
let num_of_sample = 0;

function initStatus() {
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

function moveRange(event) {
    [fromtime, totime] = [Math.floor(parseFloat(fromSlider.value) * 100) / 100, Math.floor(parseFloat(toSlider.value) * 100) / 100].sort(function (a, b) { return a - b; });

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
    // preview.play()
}

function videoPlaying(event) {
    if (preview.currentTime >= totime) {
        // preview.pause();
        preview.currentTime = fromtime;
        preview.play();
    }
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

function createGIF() {
    alert("변환에는 시간이 어느 정도 소요될 수 있습니다.");

    const tmp_card = document.createElement('div');
    tmp_card.id = `sample_${num_of_sample}`;
    tmp_card.classList.add('card');
    tmp_card.style.width = "18rem";
    const pimage = document.createElement("img");
    pimage.classList.add('card-img-top');
    pimage.alt = "loading...";
    tmp_card.appendChild(pimage);
    cutted_container.appendChild(tmp_card);
    const tmp_card_body = document.createElement('div');
    tmp_card_body.classList.add('card-body');
    tmp_card.appendChild(tmp_card_body);
    const downbtn = document.createElement("a");
    downbtn.classList.add('btn');
    downbtn.classList.add('btn-primary');
    downbtn.innerText = "다운로드";
    tmp_card_body.appendChild(downbtn);
    const prevbtn = document.createElement("a");


    const vwidth = preview.videoWidth;
    const vheight = preview.videoHeight;
    const vfps = inputFrameRate.value;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    // const frameCount = Math.floor(duration * vfps);
    const frameInterval = 1 / vfps;

    canvas.width = vwidth;
    canvas.height = vheight;

    let encoder = new GIFEncoder();
    encoder.setRepeat(0);
    encoder.setDelay(1000 / vfps);
    
    encoder.start();


    getGIFFrames(ctx, encoder, vwidth, vheight, frameInterval);

    encoder.finish();
    const gif_url = 'data:image/gif;base64,' + encode64(encoder.stream().getData());
    pimage.src = gif_url;
    downbtn.href = gif_url;
    downbtn.download = 'EzGIF.gif';

    
    // tmp_card.appendChild(pimage);
}

function getGIFFrames(ctx,encoder,vwidth,vheight,frameInterval) {
    let i = 0;
    preview.currentTime = fromtime;
    for (i = fromtime; i < totime; i = i + frameInterval) {
        console.log(i);
        if(i > totime) break;
        preview.currentTime = i;
        ctx.drawImage(preview, 0, 0, vwidth, vheight);
        encoder.addFrame(ctx);
    }
    // preview.play();
}

folderselecter.addEventListener("click", selectFolder);
fromSlider.addEventListener("input", moveRange);
toSlider.addEventListener("input", moveRange);
preview.addEventListener("loadeddata", FildLoaded);
preview.addEventListener("timeupdate", videoPlaying);
preview.addEventListener("ended", videoPlaying);
preview.addEventListener("click", function () {
    if (preview.paused) {
        preview.play();
    } else {
        preview.pause();
    }
});

inputstarttime.addEventListener("change", setInputTime);
inputendtime.addEventListener("change", setInputTime);

buttonCut.addEventListener("click", createGIF);