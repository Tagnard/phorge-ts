# Phorge-TS

A strictly typed TypeScript client for the Phorge (and Phabricator) Conduit API. This library uses [Zod](https://github.com/colinhacks/zod) to validate API responses, ensuring runtime type safety.

## Features

- **Strict Typing**: All API responses are validated against Zod schemas.
- **Promise-based**: Fully async/await compatible.
- **Modular**: separate models for Projects, Maniphest (Tasks), Users, and Transactions.

## Installation

```bash
npm install phorge-ts
```

## Usage

### Initialization

Import the `Client` and initialize it with your Phorge instance URI and API token.

```typescript
import { Client } from 'phorge-ts';

const client = new Client('https://phorge.example.com', 'api-token-...');
```

### Searching for Tasks (Maniphest)

```typescript
import { Client } from 'phorge-ts';

const client = new Client('https://phorge.example.com', 'api-token-...');

async function getOpenTasks() {
    try {
        const tasks = await client.searchTask({
            constraints: {
                statuses: ['open'],
            },
            limit: 10,
        });

        for (const task of tasks) {
            console.log(`#${task.id}: ${task.fields.name}`);
        }
    } catch (error) {
        console.error('Failed to search tasks:', error);
    }
}

getOpenTasks();
```

### Creating a Task

```typescript
import { Client } from 'phorge-ts';

const client = new Client('https://phorge.example.com', 'api-token-...');

async function createNewTask() {
    try {
        const newTask = await client.createTask([
            { type: 'title', value: 'New Task Title' },
            { type: 'description', value: 'Description of the new task.' },
            { type: 'priority', value: 80 }, // High priority
        ]);

        console.log(`Created task with PHID: ${newTask.phid}`);
    } catch (error) {
        console.error('Failed to create task:', error);
    }
}

createNewTask();
```

### Working with Projects

```typescript
import { Client } from 'phorge-ts';

const client = new Client('https://phorge.example.com', 'api-token-...');

async function searchProjects() {
    const projects = await client.searchProject({
        queryKey: 'active',
    });
    console.log(projects);
}
```

## Available APIs

The client currently supports the following methods:

- **Maniphest (Tasks)**
    - `searchTask(options?)`
    - `createTask(transactions)`
    - `updateTask(phid, transactions)`
    - `searchManiphestPriority()`
    - `searchManiphestStatus()`
- **Project**
    - `searchProject(options?)`
    - `createProject(transactions)`
    - `editProject(phid, transactions)`
- **User**
    - `searchUser(options?)`
- **Transaction**
    - `searchTransaction(options?)`

## Development

### Build

To compile the TypeScript code:

```bash
npm run build
```

### Test

To run the tests using Vitest:

```bash
npm run test
```

## License

Apache-2.0
