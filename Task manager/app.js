
const fs = require('fs');



function printHelp() {
console.log('Usage: node app.js <command> [args]');
console.log('Commands:');
console.log(' add "task label" Add a new task (status defaults to pending)');
console.log(' list List all tasks');
console.log(' remove <id> Remove a task by id');
console.log(' update <id> "new label" Update the label of a task');
console.log(' done <id> Mark a task as done');
}


function loadData() {
  try {
    const file = fs.readFileSync("tasks.json", "utf-8");
    return JSON.parse(file);
  } catch (err) {
    return [];
  }
}

function saveData(items) {
  fs.writeFileSync("tasks.json", JSON.stringify(items, null, 2));
}

console.log("Task manager started");

const action = process.argv[2];
const arg = process.argv[3];

switch (action) {

  case "add": {
    const items = loadData();

    const entry = {
      id: items.length + 1,
      title: arg,
      done: false
    };

    items.push(entry);
    saveData(items);
    console.log("New task created:", entry);
    break;
  }

  case "list": {
    const items = loadData();
    console.log("Your tasks:");
    items.forEach(item => {
      console.log(`${item.id}. ${item.title} - ${item.done ? "DONE" : "PENDING"}`);
    });
    break;
  }

  case "remove": {
    const id = Number(arg);
    let items = loadData();

    items = items.filter(item => item.id !== id);

    items = items.map((item, index) => ({
      ...item,
      id: index + 1
    }));

    saveData(items);
    console.log(`Task ${id} deleted`);
    break;
  }

  case "done": {
    const id = Number(arg);
    const items = loadData();

    const found = items.find(item => item.id === id);
    if (!found) {
      console.log("Task not found");
      break;
    }

    found.done = true;
    saveData(items);
    console.log(`Task ${id} marked as DONE`);
    break;
  }

  case "update": {
    const id = Number(arg);
    const newTitle = process.argv[4];
    const items = loadData();

    const found = items.find(item => item.id === id);
    if (!found) {
      console.log("Task not found");
      break;
    }

    found.title = newTitle;
    saveData(items);
    console.log(`Task ${id} updated`);
    break;
  }

  default:
    console.log("Unknown command!");
    printHelp();
    break;
}
