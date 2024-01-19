document.querySelector('.bt-theme-light').addEventListener('click', () => {
    document.body.classList.remove('dark');
    localStorage.setItem('dark-mode', 'false');
})

document.querySelector('.bt-theme-dark').addEventListener('click',() => {
    document.body.classList.add('dark');
    localStorage.setItem('dark-mode', 'true');
})

document.addEventListener('DOMContentLoaded', () => {
    const drakModeEnaled = JSON.parse(localStorage.getItem('dark-mode')) ?? false
    document.body.classList.toggle('dark', drakModeEnaled)
})