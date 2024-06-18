document.addEventListener('DOMContentLoaded', () => {
    const contentContainers = document.querySelectorAll('.content[data-url]');

    contentContainers.forEach(container => {
        const url = container.getAttribute('data-url');
        fetch(url)
            .then(response => response.text())
            .then(data => {
                container.innerHTML = data;
                const scripts = container.querySelectorAll('script');
                scripts.forEach(script => {
                    const newScript = document.createElement('script');
                    if (script.src) {
                        newScript.src = script.src;
                    } else {
                        newScript.textContent = script.textContent;
                    }
                    document.body.appendChild(newScript);
                    document.body.removeChild(newScript);
                });
            })
            .catch(error => {
                container.innerHTML = `<p>Error loading content: ${error.message}</p>`;
            });
    });

    document.getElementById('refreshButton').addEventListener('click', loadTasks);
});

async function loadTasks() {
    setLoading(true);
    try {
        const response = await fetch('/tasks');
        const tasks = await response.json();
        const taskList = document.getElementById('taskList');
        taskList.innerHTML = '';
        tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.className = 'mdl-list__item';
            
            const taskDescription = parseDescription(task.description);

            listItem.innerHTML = `
                <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect" for="checkbox-${task.id || task.task_id}">
                    <input type="checkbox" id="checkbox-${task.id || task.task_id}" class="mdl-checkbox__input" data-id="${task.id || task.task_id}" ${task.checked ? 'checked' : ''}>
                    <span class="mdl-checkbox__label">${task.content}</span>
                    ${taskDescription ? `<div class="task-details">${taskDescription}</div>` : ''}
                </label>
            `;
            listItem.addEventListener('click', () => {
                const barcode = extractBarcode(task.description);
                if (barcode) {
                    updateProductLookup(barcode);
                }
            });
            taskList.appendChild(listItem);
        });
        // Upgrade DOM for dynamically added MDL elements
        window.componentHandler.upgradeDom();

        // Add event listeners to checkboxes
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', async (event) => {
                const taskId = event.target.getAttribute('data-id');
                if (event.target.checked) {
                    await completeTask(taskId);
                } else {
                    await uncompleteTask(taskId);
                }
            });
        });
    } catch (error) {
        console.error('Error loading tasks:', error);
    } finally {
        setLoading(false);
    }
}

async function completeTask(taskId) {
    try {
        const response = await fetch('/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ taskId }),
        });
        if (!response.ok) {
            throw new Error('Failed to complete task');
        }
    } catch (error) {
        console.error('Error completing task:', error);
    }
}

async function uncompleteTask(taskId) {
    try {
        const response = await fetch('/uncomplete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ taskId }),
        });
        if (!response.ok) {
            throw new Error('Failed to uncomplete task');
        }
    } catch (error) {
        console.error('Error uncompleting task:', error);
    }
}

function setLoading(isLoading) {
    const button = document.getElementById('refreshButton');
    if (isLoading) {
        button.disabled = true;
        button.innerHTML = `
            <div class="loading">
                <div class="loading-spinner"></div>
                Loading...
            </div>
        `;
    } else {
        button.disabled = false;
        button.innerHTML = 'Refresh List';
    }
}

function parseDescription(description) {
    if (!description) return '';
    const lines = description.split('\n');
    const parsedLines = lines.map(line => {
        const [key, value] = line.split(':');
        if (!key || !value) return '';
        return `<div><strong>${key.trim()}:</strong> ${value.trim()}</div>`;
    });
    return parsedLines.join('');
}

function extractBarcode(description) {
    if (!description) return null;
    const lines = description.split('\n');
    for (const line of lines) {
        const [key, value] = line.split(':');
        if (key && value && key.trim().toLowerCase() === 'barcode') {
            return value.trim();
        }
    }
    return null;
}

async function updateProductLookup(barcode) {
    try {
        const response = await fetch(`/product/${barcode}`);
        const productDetails = await response.text();
        document.getElementById('productDetails').innerHTML = productDetails;
    } catch (error) {
        console.error('Error fetching product details:', error);
        document.getElementById('productDetails').innerHTML = '<p>Error loading product details</p>';
    }
}

window.onload = loadTasks;
