/*
    snapshot {
        sections: ['title'],
        link: 'www.website.com',
        title: 'title',
        links: [{
            section: 'title',
            link: 'www.website.com',
            title: 'title'
        }]
    }
*/

class App {
    constructor() {
        this.load('storage');
        document.getElementById('reset-email').onclick = () => {
            chrome.storage.local.set({
                links: []
            }, () => {
                this.links = [];
                this.load('email');
            });
        }
        document.getElementById('send-email').onclick = () => {
            chrome.storage.local.set({
                send: true
            }, () => {
                chrome.tabs.create({ url: 'https://mail.google.com/mail/u/0/#inbox?compose=new&email-links=true' });
            });
        }
    }

    alert(msg, color) {
        let elem = document.createElement('span');
        elem.innerText = msg;
        elem.style.color = color;
        document.getElementById('alerts').appendChild(elem);
        setInterval(() => elem.remove(), 2000);
    }

    load(type) {
        if (type === 'sections') {
            const container = document.getElementById('sections-list');
            container.innerHTML = null;
            (this.sections.length > 0) ?
            this.sections.forEach(section => {
                let elem = document.createElement('li');
                elem.innerText = section;
                let remove = document.createElement('span');
                remove.classList.add('remove');
                remove.setAttribute('data-title', section);
                remove.innerText = '(Remove)';
                remove.onclick = () => {
                    chrome.storage.local.set({
                        sections: this.sections.filter((item) => { 
                            return item !== section
                        })
                    }, () => {
                        this.sections = this.sections.filter((item) => { 
                            return item !== section
                        })
                        this.alert(`Section "${section}" was successfully removed!`, 'red');
                        this.load('sections');
                        this.load('email');
                    });
                }
                elem.appendChild(remove);
                container.appendChild(elem);
            }) : (() => {
                console.log(container);
                let elem = document.createElement('li');
                elem.innerText = 'No sections...';
                container.appendChild(elem);
            })()
            document.getElementById('section-select').innerHTML = 
            '<option value="null" selected>No Section</option>' + 
            ((this.sections.length > 0 ) ? this.sections.map(section => `<option value="${section}">${section}</option>`) : '');
            document.getElementById('add-article').onclick = () => {
                this.add('article');
            }
        } else if (type === 'storage') {
            chrome.storage.local.get((snapshot) => {
                this.sections = (snapshot.sections) ? snapshot.sections : [];
                this.title = (snapshot.title) ? snapshot.title : 'No Title';
                this.link = (snapshot.link) ? snapshot.link : '#';
                this.links = (snapshot.links) ? snapshot.links : [];
                this.load('article');
                this.load('sections');
                this.load('email');
            });
        } else if (type === 'article') {
            document.getElementById('article-title').innerText = this.title;
            document.getElementById('article-link').innerText = this.link;
            document.getElementById('article-link').setAttribute('href', this.link);
        } else if (type === 'email') {
            const container = document.getElementById('email-output');
            if (this.links.length === 0) {
                container.innerHTML = 'No links added yet!';
            } else if (this.links.length > 0) {
                container.innerHTML = null;
                this.links.map(link => {
                    if (this.sections.indexOf(link.section) === -1) {
                        let linkTitle = document.createElement('p');
                        linkTitle.innerHTML = `<b>${link.title}</b>`;
                        container.appendChild(linkTitle);
                        let linkAnchor = document.createElement('a');
                        linkAnchor.innerText = link.link;
                        linkAnchor.setAttribute('href', link.link);
                        linkAnchor.setAttribute('target', '_blank');
                        container.appendChild(linkAnchor);
                    }
                });
                this.sections.map(section => {
                    let title = document.createElement('h3');
                    title.style.marginTop = '15px';
                    title.innerText = section;
                    let titleAdded = false;
                    this.links.map(link => {
                        if (link.section === section) {
                            if (!titleAdded) {
                                titleAdded = true;
                                container.appendChild(title);
                            }
                            let linkTitle = document.createElement('p');
                            linkTitle.innerHTML = `<b>${link.title}</b>`;
                            container.appendChild(linkTitle);
                            let linkAnchor = document.createElement('a');
                            linkAnchor.innerText = link.link;
                            linkAnchor.setAttribute('href', link.link);
                            linkAnchor.setAttribute('target', '_blank');
                            container.appendChild(linkAnchor);
                        }
                    });
                });
            } else {
                this.alert('Could not load email...', 'red');
            }
        } else {
            this.alert(`No data was found for ${type}...`, 'red');
        }
    }

    add(type) {
        if (type === 'section') {
            const elem = document.getElementById('section-title');
            chrome.storage.local.set({
                sections: [...this.sections, elem.value]
            }, () => {
                this.sections.push(elem.value);
                this.alert(`Section "${elem.value}" was successfully added!`, 'green');
                elem.value = null;
                this.load('sections');
            });
        } else if (type === 'article') {
            const obj = {
                section: document.getElementById('section-select').value,
                link: this.link,
                title: this.title
            };
            chrome.storage.local.set({
                links: [...this.links, obj]
            }, () => {
                this.links = [...this.links, obj];
                this.load('email');
                this.alert('Article added!', 'green');
            });
            this.load('email');
        } else if (type !== 'section' && type !== 'article') {
            this.alert(`Could not add type ${type}...`, 'red');
        }
    }
}

const app = new App();
document.getElementById('add-section').onclick = function() {
    app.add('section');
}