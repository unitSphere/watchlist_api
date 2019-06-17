




async function loadAll(){
    let url = '/watchlists/all';
    let result = await fetch(url);
    result = await result.json();
    result = await Promise.resolve(result);
    for(let i = 0; i < result.length; i++){
        let list = document.getElementById('wl-list');
        let li = document.createElement('li');
        let span = document.createElement('span');
        span.innerText = result[i].name;
        li.appendChild(span);
        let div = document.createElement('div');
        let remove = document.createElement('button');
        remove.innerText = 'Remove';
        let view = document.createElement('button');
        view.innerText = 'View';
        remove.addEventListener('click', deleteHandler);
        view.addEventListener('click', viewHandler);
        div.appendChild(remove);
        div.appendChild(view);
        li.appendChild(div);
        list.insertBefore(li, list.childNodes[0]);
    }
}

async function deleteHandler(){
    let item = this.parentNode.parentNode;
    let span = item.getElementsByTagName('span')[0];
    let name = span.innerText;
    console.log(span);
    let url = '/watchlists/' + name;
    let request = new Request(url, {
        method: 'DELETE'
    })
    let result = await fetch(request);
    result = await result.json();
    result = await Promise.resolve(result);
    if(result === 'One watchlist deleted'){
        let parent = item.parentNode;
        parent.removeChild(item);
    }
}

function deleteAllHandler() {
    fetch("/watchlists", {
        method: 'DELETE', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(function (response) {
            return response.json()
        })
        .then(function (res) {
            window.location.reload();
            let str = res + '. Press ok to reload the page!';
            alert(str)
        });
}

function viewHandler(){
    //    Your code here
    let item = this.parentNode.parentNode;
    let span = item.getElementsByTagName('span')[0];
    let name = span.innerText;
    let url = '/details/' + name;
    window.location.assign(url);
}

async function addHandler(){
    let input = document.getElementById('input-box').value;
    let url = '/watchlists/' + input;
    let request = new Request(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'}
    });
    let result = await fetch(request);

    result = await result.json();
    result = await Promise.resolve(result);
    if(result === 'An empty Watchlist was created'){
        let list = document.getElementById('wl-list');
        let li = document.createElement('li');
        let span = document.createElement('span');
        span.innerText = document.getElementById('input-box').value;
        li.appendChild(span);
        let div = document.createElement('div');
        let remove = document.createElement('button');
        remove.innerText = 'Remove';
        let view = document.createElement('button');
        view.innerText = 'View';
        remove.addEventListener('click', deleteHandler);
        view.addEventListener('click', viewHandler);
        div.appendChild(remove);
        div.appendChild(view);
        li.appendChild(div);
        list.insertBefore(li, list.childNodes[0]);
        document.getElementById('input-box').value = '';
    }

}

function enter_key_handler() {
    document.getElementById('input-box').addEventListener("keyup", function (event) {
        if (event.code === 'Enter') {
            event.preventDefault();
            document.getElementById('add-button').click();
        }
    })
}