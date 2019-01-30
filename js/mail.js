chrome.extension.sendMessage({}, function (response) {
    var readyStateCheckInterval = setInterval(function () {
        if (document.readyState === "complete") {
            clearInterval(readyStateCheckInterval);
            chrome.storage.local.get(snapshot => {
                if (snapshot.send) {
                    chrome.storage.local.set({
                        send: false
                    }, () => {
                        let email = 'my email';
                        let append = setInterval(() => {
                            const container = document.querySelector('.gmail_default');
                            if (container) {
                                clearInterval(append);
                                snapshot.links.map(link => {
                                    if (snapshot.sections.indexOf(link.section) === -1) {
                                        let linkTitle = document.createElement('span');
                                        linkTitle.innerHTML = `<b>${link.title}</b>`;
                                        container.appendChild(linkTitle);
                                        container.innerHTML += '<br />';
                                        let linkAnchor = document.createElement('a');
                                        linkAnchor.innerText = link.link;
                                        linkAnchor.setAttribute('href', link.link);
                                        linkAnchor.setAttribute('target', '_blank');
                                        container.appendChild(linkAnchor);
                                        container.innerHTML += '<br /><br />';
                                    }
                                });
                                snapshot.sections.map(section => {
                                    let title = document.createElement('h3');
                                    title.style.marginTop = '15px';
                                    title.innerText = section;
                                    let titleAdded = false;
                                    snapshot.links.map(link => {
                                        if (link.section === section) {
                                            if (!titleAdded) {
                                                titleAdded = true;
                                                container.appendChild(title);
                                            }
                                            let linkTitle = document.createElement('span');
                                            linkTitle.innerHTML = `<b>${link.title}</b>`;
                                            container.appendChild(linkTitle);
                                            container.innerHTML += '<br />';
                                            let linkAnchor = document.createElement('a');
                                            linkAnchor.innerText = link.link;
                                            linkAnchor.setAttribute('href', link.link);
                                            linkAnchor.setAttribute('target', '_blank');
                                            container.appendChild(linkAnchor);
                                            container.innerHTML += '<br /><br />';
                                        }
                                    });
                                });
                            }
                        }, 100);
                    });
                }
            });
        }
    }, 10);
});