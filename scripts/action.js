function enterToDO() {
    if (todoValue.value.trim() !== '') {

        changeArrowToDoShow();

        store.storeValue = new Item();
        renderItems(store.storeValue);
    }
}


itemsWrapper.addEventListener('click', function (event) {
    let e = event.target;
    let target = e.parentNode.firstElementChild.id.slice(e.parentNode.firstElementChild.id.lastIndexOf('x') + 1);
    if (target.trim() !== '') {
        store.switchItemCheckbox(target - 1);
    }
    switchCheckbox(e);
    deleteItem(e);
    numberItemsShow();
});

itemsWrapper.addEventListener('dblclick', function (event) {
    let e = event.target;
    if (e.className === 'card-p') {
        swapCardToInput(e);
    }
});

arrow.addEventListener('click', () => {
    store.selectAllCheckbox();
    renderItems(store.storeValue);
});

clear.addEventListener('click', () => {
    store.clearSelected();
    renderItems(store.storeValue);
});

subFilters.addEventListener('click', (event) => {
    let e = event.target;
    if (e.tagName === 'P') {
        for (let key of subFilters.children) {
            key.classList.remove('clearActive');
            switch (e.className) {
                case 'All':
                    localStorage.setItem('state', 'all');
                    renderFilterState();
                    break;
                case 'Active':
                    localStorage.setItem('state', 'active');
                    renderFilterState();
                    break;
                case 'Completed':
                    localStorage.setItem('state', 'completed');
                    renderFilterState();
                    break;
            }
        }
        e.classList.add('clearActive');
    }
});//todo ------------+

function swapCardToInput(e) {
    let inputItem = document.querySelector(`.${Object.keys(e.dataset)[0]}`);
    let card = document.getElementById(`${e.id}`);

    inputItem.classList.toggle('hide');
    inputItem.focus();
    card.parentNode.classList.toggle('hide');

    inputItem.addEventListener('keydown', function (event) {
        if (event.code === 'Enter') {
            inputItem.onblur();
        }
    });

    inputItem.onblur = function () {
        let target = inputItem.className.slice(inputItem.className.lastIndexOf('t') + 1);
        let inputNewValue = inputItem.value;
        store.editedItem(target, inputNewValue);
        inputItem.classList.toggle('hide');
        card.parentNode.classList.toggle('hide');
        renderItems(store.storeValue);
    }
}

function switchCheckbox(e) {
    try {
        let condition = e.parentNode.firstElementChild.nextElementSibling.children;
        if (e.parentNode.className === "checkbox") {
            for (let key of condition) {
                key.classList.toggle('hide');
            }
        }
    } catch {
    }
}

function deleteItem(e) {
    if (e.parentNode.className === "card-cross") {
        store.clearItem(Object.keys(e.parentNode.dataset)[0]);
        renderItems(store.storeValue);
    }
}

function renderFilterState() {
    if (localStorage.getItem('state') === null) {
        renderItems(JSON.parse(localStorage.getItem('store')));
    } else {
        switch (localStorage.getItem('state')) {
            case 'all':
                renderItems(JSON.parse(localStorage.getItem('store')));
                break;
            case 'active':
                let store = JSON.parse(localStorage.getItem('store'));
                let boolean = store.filter(item => item.checked === false);
                if (boolean.length < 1) {
                    itemsWrapper.innerHTML = '';
                } else {
                    renderItems(boolean);
                }
                break;
            case 'completed':
                let store1 = JSON.parse(localStorage.getItem('store'));
                let boolean1 = store1.filter(item => item.checked === true);
                if (boolean1.length < 1) {
                    itemsWrapper.innerHTML = '';
                } else {
                    renderItems(boolean1);
                }
                break;
        }
    }
}//todo --------------+

function changeArrowToDoShow() {
    arrow.style.opacity = '1';
    todo.classList.toggle('shadowDown');
}

function changeArrowToDoHide() {
    arrow.style.opacity = '0';
    todo.classList.toggle('shadowDown');
}

function numberItemsShow() {
    numItems.innerText = store.getNumberItemsToDo();
}