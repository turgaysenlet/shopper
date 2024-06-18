const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fetch = require('node-fetch');
const Todoist = require('todoist').v9;
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 3000;
const TODOIST_API_TOKEN = ''; // Replace with your Todoist API token
const PROJECT_ID = ''; // Replace with your shopping list project ID

const todoist = Todoist(TODOIST_API_TOKEN);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Fetch project data from Todoist API
app.get('/tasks', async (req, res) => {
    try {
        console.log('Fetching incomplete tasks from Todoist API...');
        await todoist.sync();

        const incompleteTasksResponse = await fetch('https://api.todoist.com/sync/v9/projects/get_data', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TODOIST_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ project_id: PROJECT_ID })
        });

        if (!incompleteTasksResponse.ok) {
            console.error('Error response from Todoist:', incompleteTasksResponse.status, incompleteTasksResponse.statusText);
            res.status(incompleteTasksResponse.status).send(incompleteTasksResponse.statusText);
            return;
        }

        const projectData = await incompleteTasksResponse.json();
        const incompleteTasks = projectData.items;

        console.log('Fetching completed tasks from Todoist API...');
        const completedTasksResponse = await fetch('https://api.todoist.com/sync/v9/completed/get_all', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${TODOIST_API_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ project_id: PROJECT_ID })
        });

        if (!completedTasksResponse.ok) {
            console.error('Error response from Todoist:', completedTasksResponse.status, completedTasksResponse.statusText);
            res.status(completedTasksResponse.status).send(completedTasksResponse.statusText);
            return;
        }

        const completedTasksData = await completedTasksResponse.json();
        const completedTasks = completedTasksData.items.map(item => ({
            ...item,
            checked: true,
            id: item.task_id // Use task_id for completed tasks
        }));

        const allTasks = incompleteTasks.concat(completedTasks);
        console.log('Response:', allTasks);
        res.json(allTasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Fetch product data from UPC Item DB page
app.get('/product/:barcode', async (req, res) => {
    const { barcode } = req.params;
    const url = `https://upcitemdb.com/upc/${barcode}`;

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const productDetails = {};
        $('table.detail-list tr').each((index, element) => {
            const property_name = $(element).find('td').eq(0).text().trim().replace(':', '');
            const property_value = $(element).find('td').eq(1).text().trim();
            productDetails[property_name] = property_value;
        });

        const image_url = $('img.product').attr('src');

        let productRows = '';
        for (const [key, value] of Object.entries(productDetails)) {
            productRows += `<tr><td>${key}</td><td>${value}</td></tr>`;
        }

        const renderedHtml = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Product Details</title>
            <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
                img.product-image { width: 320px; }
            </style>
        </head>
        <body>
            <img src="${image_url}" alt="Product Image" class="product-image">
            <table>
                <tbody>
                    ${productRows}
                </tbody>
            </table>
        </body>
        </html>
        `;

        res.send(renderedHtml);
    } catch (error) {
        res.status(500).send('An error occurred while fetching the product details');
    }
});

// Update task status in Todoist API
app.post('/complete', async (req, res) => {
    const { taskId } = req.body;
    if (!taskId) {
        console.error('Invalid task ID:', taskId);
        res.status(400).send('Invalid task ID');
        return;
    }
    try {
        console.log(`Completing task with ID: ${taskId}...`);
        const updatedItem = await todoist.items.complete({ id: taskId });
        await todoist.sync();

        console.log(`Task with ID: ${taskId} completed successfully.`);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error completing task:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Uncomplete task status in Todoist API
app.post('/uncomplete', async (req, res) => {
    const { taskId } = req.body;
    if (!taskId) {
        console.error('Invalid task ID:', taskId);
        res.status(400).send('Invalid task ID');
        return;
    }
    try {
        console.log(`Uncompleting task with ID: ${taskId}...`);
        const updatedItem = await todoist.items.uncomplete({ id: taskId });
        await todoist.sync();

        console.log(`Task with ID: ${taskId} uncompleted successfully.`);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error uncompleting task:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
