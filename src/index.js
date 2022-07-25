class TodoList {
    constructor() {
        this.list = [];
    }

    addTask = task => {
        if (!this.list.some(item => item.title === task.title)) {
            this.list.push(task);
            return true;
        }
    };

    removeTask = task => {
        let res = false;
        this.list.forEach((item, index) => {
            if (item.title === task.title) {
                const amount = 1;
                this.list.splice(index, amount);
                res = true;
            }
        });
        return res;
    };

    editTask = task => {
        let res = false;
        this.list.forEach((item, index) => {
            if (item.title === task.title) {
                this.list[index] = task;
                res = true;
            }
        });
        return res;
    };

    info = () => {
        const all = this.list.length;
        const completed = this.list.filter(item => item.completed).length;
        return {
            all,
            completed,
            performing: all - completed,
        };
    };
}

class TodoInfo {
    constructor(info) {
        this.all = info.all;
        this.completed = info.completed;
        this.performing = info.performing;
    }

    update = info => {
        this.all = info.all;
        this.completed = info.completed;
        this.performing = info.performing;

        const all = this.container.querySelector('#all');
        const completed = this.container.querySelector('#completed');
        const performing = this.container.querySelector('#performing');
        all.innerText = 'all: ' + this.all;
        completed.innerText = 'completed: ' + this.completed;
        performing.innerText = 'performing: ' + this.performing;
    };

    render = () => {
        this.container = document.createElement('div');
        const all = document.createElement('div');
        all.id = 'all';
        all.innerText = 'all: ' + this.all;

        const completed = document.createElement('div');
        completed.id = 'completed';
        completed.innerText = 'completed: ' + this.completed;

        const performing = document.createElement('div');
        performing.id = 'performing';
        performing.innerText = 'performing: ' + this.performing;

        this.container.innerHTML = ''; // reset
        this.container.appendChild(all);
        this.container.appendChild(completed);
        this.container.appendChild(performing);

        return this.container;
    };
}

class TodoCreate {
    constructor(createTask) {
        this.createTask = createTask;
    }

    renderTitle = () => {
        const ceil = document.createElement('td');
        ceil.setAttribute('width', '20%');
        const title = document.createElement('input');
        title.setAttribute('required', '');
        title.setAttribute('maxlength', '10');
        title.classList.add('title');
        ceil.appendChild(title);

        return ceil;
    };

    renderText = () => {
        const ceil = document.createElement('td');
        ceil.setAttribute('width', '20%');
        const text = document.createElement('input');
        text.setAttribute('required', '');
        text.classList.add('text');
        ceil.appendChild(text);

        return ceil;
    };

    renderAdd = () => {
        const ceil = document.createElement('td');
        ceil.setAttribute('width', '20%');
        const add = document.createElement('button');
        add.type = 'submit';
        add.innerText = 'Add task';
        ceil.appendChild(add);

        return ceil;
    };

    renderTable = () => {
        const table = document.createElement('table');
        table.setAttribute('width', '100%');
        table.setAttribute('height', '100px');
        const row = document.createElement('tr');
        row.appendChild(this.renderTitle());
        const last = document.createElement('td');

        table.appendChild(this.renderTitle());
        table.appendChild(this.renderText());
        table.appendChild(this.renderAdd());
        table.appendChild(last);

        return table;
    };

    render = () => {
        this.container = document.createElement('form');
        this.container.setAttribute('action', '#');
        this.container.addEventListener('submit', this.createTask);

        this.container.innerHTML = ''; // reset
        this.container.appendChild(this.renderTable());

        return this.container;
    };
}

class TodoItem {
    constructor(task, saveTask, removeTask) {
        this.task = task;
        this.saveTask = saveTask;
        this.removeTask = removeTask;
    }

    renderTitle = () => {
        const ceil = document.createElement('td');
        ceil.setAttribute('width', '10%');
        const title = document.createElement('span');
        title.classList.add('title');
        title.innerText = this.task.title;
        ceil.appendChild(title);
        return ceil;
    };

    renderText = () => {
        const ceil = document.createElement('td');
        ceil.setAttribute('width', '20%');
        const text = document.createElement('input');
        text.setAttribute('required', '');
        text.classList.add('text');
        text.value = this.task.text;
        ceil.appendChild(text);

        return ceil;
    };

    renderCompleted = () => {
        const ceil = document.createElement('td');
        ceil.setAttribute('width', '5%');
        const completed = document.createElement('input');
        completed.classList.add('completed');
        completed.type = 'checkbox';
        completed.checked = this.task.completed;
        ceil.appendChild(completed);

        return ceil;
    };

    renderSave = () => {
        const ceil = document.createElement('td');
        ceil.setAttribute('width', '20%');
        const save = document.createElement('button');
        save.type = 'submit';
        save.innerText = 'Save task';
        ceil.appendChild(save);

        return ceil;
    };

    renderRemove = () => {
        const ceil = document.createElement('td');
        ceil.setAttribute('width', '20%');
        const remove = document.createElement('button');
        remove.addEventListener('click', this.removeTask.bind(null, this.task, this.container));
        remove.type = 'button';
        remove.innerText = 'Remove task';
        ceil.appendChild(remove);

        return ceil;
    };

    renderTable = () => {
        const table = document.createElement('table');
        table.setAttribute('width', '100%');
        const row = document.createElement('tr');
        row.appendChild(this.renderTitle());
        const last = document.createElement('td');

        table.appendChild(this.renderTitle());
        table.appendChild(this.renderText());
        table.appendChild(this.renderCompleted());
        table.appendChild(this.renderSave());
        table.appendChild(this.renderRemove());
        table.appendChild(last);

        return table;
    };

    render = () => {
        this.container = document.createElement('form');
        this.container.setAttribute('action', '#');
        this.container.addEventListener('submit', this.saveTask);

        this.container.innerHTML = ''; // reset
        this.container.appendChild(this.renderTable());

        return this.container;
    };
}

class Todo {
    constructor() {
        this.todo = new TodoList();
    }

    createTask = e => {
        e.preventDefault();
        const form = e.currentTarget;
        const task = {
            title: form.querySelector('.title').value,
            text: form.querySelector('.text').value,
            completed: false,
        };
        if (this.todo.addTask(task)) {
            const item = new TodoItem(task, this.saveTask, this.removeTask);
            this.container.appendChild(item.render());
            this.infoContainer.update(this.todo.info());
        }
    };

    saveTask = e => {
        e.preventDefault();
        const form = e.currentTarget;
        const task = {
            title: form.querySelector('.title').innerText,
            text: form.querySelector('.text').value,
            completed: form.querySelector('.completed').checked,
        };
        if (this.todo.editTask(task)) {
            this.infoContainer.update(this.todo.info());
        }
    };

    removeTask = (task, todoItem) => {
        if (this.todo.removeTask(task)) {
            this.container.removeChild(todoItem);
            this.infoContainer.update(this.todo.info());
        }
    };

    render = () => {
        this.container = document.createElement('div');
        this.infoContainer = new TodoInfo(this.todo.info());
        this.createContainer = new TodoCreate(this.createTask);

        this.container.innerHTML = ''; // reset
        this.container.appendChild(this.infoContainer.render());
        this.container.appendChild(this.createContainer.render());
        this.todo.list.forEach(task => {
            const item = new TodoItem(task, this.saveTask, this.removeTask);
            this.container.appendChild(item.render());
        });

        return this.container;
    };
}

const developers = new Todo();

developers.todo.addTask({ title: 'task1', text: 'text1', completed: false });
developers.todo.addTask({ title: 'task2', text: 'text2', completed: false });
developers.todo.addTask({ title: 'task3', text: 'text3', completed: false });

document.body.prepend(developers.render());
