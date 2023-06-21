const textToTranslate = document.getElementById('textToTranslate')
const buttonTranslate = document.getElementById('buttonTranslate')
const translatedText = document.getElementById('translatedText')


buttonTranslate.addEventListener('click', (e) => {
	window.electron.onTextToTranslate(textToTranslate.innerText)
}, false)

window.electron.onUpdateTranslatedResult((event, value) => {
	translatedText.innerText = value
})

textToTranslate.addEventListener(
	"keydown",
	(event) => {
		console.log(event.code, event.shiftKey)
		if (event.code === 'Enter' && event.shiftKey && event.ctrlKey) {
			window.electron.onTextToTranslate(textToTranslate.innerText)
		}
	},
	false
);