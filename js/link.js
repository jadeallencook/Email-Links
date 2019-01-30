(function () {
    chrome.storage.local.set({
        link: window.location.href,
        title: (document.querySelector('h1')) ?
        document.querySelector('h1').innerText : null
    });
})();