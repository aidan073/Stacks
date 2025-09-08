function addUiListeners(){
    document.getElementById("settings-cog").addEventListener('click', () => {
        document.getElementById("settings-menu").classList.remove("hidden");
    });
    document.getElementById("close-settings").addEventListener('click', () => {
        document.getElementById("settings-menu").classList.add("hidden");
    });
}

export { addUiListeners }

