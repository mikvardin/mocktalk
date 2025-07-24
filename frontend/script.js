const form = document.getElementById('translate-form');
const resultDiv = document.getElementById('result');
const loader = document.getElementById('loader');
const errorDiv = document.getElementById('error');
const speakBtn = document.getElementById('speak-btn');
const voiceSelect = document.getElementById('voice-select');

let voices = [];

function populateVoices() {
    voices = window.speechSynthesis.getVoices().filter(v => v.lang === 'ru-RU');
    voiceSelect.innerHTML = '';
    voices.forEach((voice, i) => {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = `${voice.name} (${voice.lang})${voice.default ? ' [по умолчанию]' : ''}`;
        voiceSelect.appendChild(option);
    });
}

if ('speechSynthesis' in window) {
    populateVoices();
    window.speechSynthesis.onvoiceschanged = populateVoices;
}

function speakText(text) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ru-RU';
        if (voices.length && voiceSelect.value) {
            utter.voice = voices[voiceSelect.value];
        }
        utter.rate = 1.05;
        window.speechSynthesis.speak(utter);
    }
}

function showLoader() {
    loader.style.display = 'block';
    resultDiv.classList.remove('visible');
    resultDiv.textContent = '';
    errorDiv.style.display = 'none';
    speakBtn.style.display = 'none';
    voiceSelect.style.display = 'none';
}
function hideLoader() {
    loader.style.display = 'none';
}
function showResult(text) {
    resultDiv.textContent = text;
    resultDiv.classList.add('visible');
    errorDiv.style.display = 'none';
    speakBtn.style.display = voices.length ? 'inline-block' : 'none';
    voiceSelect.style.display = voices.length ? 'inline-block' : 'none';
    speakBtn.onclick = () => speakText(text);
}
function showError(msg) {
    errorDiv.textContent = msg;
    errorDiv.style.display = 'block';
    resultDiv.classList.remove('visible');
    resultDiv.textContent = '';
    speakBtn.style.display = 'none';
    voiceSelect.style.display = 'none';
}

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const phrase = document.getElementById('phrase').value.trim();
    const style = document.getElementById('style').value;
    if (!phrase) {
        showError('Введите фразу для перевода.');
        return;
    }
    showLoader();
    try {
        const resp = await fetch('http://localhost:8000/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phrase, style })
        });
        if (!resp.ok) throw new Error('Ошибка сервера');
        const data = await resp.json();
        hideLoader();
        showResult(data.result);
    } catch (err) {
        hideLoader();
        showError('Ошибка перевода. Попробуйте ещё раз.');
    }
}); 