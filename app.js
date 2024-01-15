const GIFConverterCard = document.querySelector('#GIF-Converter-Card');
const WaterMarkCard = document.querySelector('#WaterMark-Card');
const BlogThumbnailCard = document.querySelector('#Blogthumbnail-Card');

function movetogifconverter() {
    window.location.href = 'GIFConverter/gifconverter.html';
}

function movetowatermark() {
    window.location.href = 'watermark.html';
}

function movetoblogthumbnail() {
    window.location.href = 'blogthumbnail.html';
}

GIFConverterCard.addEventListener('click', movetogifconverter);
WaterMarkCard.addEventListener('click', movetowatermark);
BlogThumbnailCard.addEventListener('click', movetoblogthumbnail);