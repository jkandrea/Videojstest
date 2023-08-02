const GIFConverterCard = document.querySelector('#GIF-Converter-Card');

function movetogifconverter() {
    window.location.href = 'GIFConverter/gifconverter.html';
}

GIFConverterCard.addEventListener('click', movetogifconverter);