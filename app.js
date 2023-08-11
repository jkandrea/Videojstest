const GIFConverterCard = document.querySelector('#GIF-Converter-Card');
const WaterMarkCard = document.querySelector('#WaterMark-Card');

function movetogifconverter() {
    window.location.href = 'GIFConverter/gifconverter.html';
}

function movetowatermark() {
    window.location.href = 'watermark.html';
}

GIFConverterCard.addEventListener('click', movetogifconverter);
WaterMarkCard.addEventListener('click', movetowatermark);