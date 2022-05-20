/** @format */

//IIFE Module Design Pattern
(function () {
  let tasks = [];

  const tasksList = document.getElementById("list");
  const addTaskInput = document.getElementById("add");
  const taskCounter = document.getElementById("tasks-counter");

  //API URL : https://jsonplaceholder.typicode.com/todos
  //Fetches Todos from an API using fetch()
  async function fetchTodos() {
    //GET Request
    // fetch("https://jsonplaceholder.typicode.com/todos")
    //     .then(function(response){ //The Response object, in turn, does not directly contain the actual JSON response body but is instead a representation of the entire HTTP response.
    //        return response.json(); //we use the json() method, which returns a second promise that resolves with the result of parsing the response body text as JSON.
    //     }).then(function(data){ //Actual data is retrieved here
    //         tasks = data.slice(0,10);
    //         renderList();
    // }).catch(function(error){
    //     console.log("error",error);
    // });

    //Async Await
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/todos"
      );
      const data = await response.json();
      tasks = data.slice(0, 10);
      renderList();
    } catch (error) {
      console.log(error);
    }
  }

  //Adding Tasks to DOM
  function addTaskToDOM(task) {
    //Creating an Element
    const li = document.createElement("li");

    //Setting innerHTML for created li
    li.innerHTML = `
        <input type="checkbox" id="${task.id}" ${
      task.completed ? "checked" : ""
    } class="custom-checkbox">
        <label for="${task.id}">${task.title}</label>
        <img src="bin.svg" alt="Delete Task" class="delete" data-id="${
          task.id
        }" />`;

    //Appending li to the taskList
    tasksList.append(li);
  }

  //Function to render the task List
  function renderList() {
    tasksList.innerHTML = ""; //Removing the taskLists from the DOM
    //Approach 1
    // tasks.forEach(function(task, index){
    //     tasksList.innerHTML += `
    //         <li>
    //             <input type="checkbox" id="task${index}" data-id="${task.id}" class="custom-checkbox">
    //             <label for="task${index}">${task.title}</label>
    //             <img src="bin.svg" alt="Delete Task" class="delete" data-id="${task.id}" />
    //         </li>
    //     `;
    // })

    //Approach 2 : Looping through the tasks list and then adding them to the DOM
    for (let i = 0; i < tasks.length; i++) {
      addTaskToDOM(tasks[i]);
    }

    //Changing the value of Task Counter
    taskCounter.innerHTML = `${tasks.length}`;
  }

  //Mark a Task as Complete or Incomplete by Toggling it
  function toggleTask(taskId) {
    //Filter the List and return the task which is clicked
    const task = tasks.filter(function (task) {
      return task.id === taskId;
    });

    //If the task is present
    if (task.length > 0) {
      //Current task is present at 0th Index
      const currentTask = task[0];

      //Toggling the done property of current task
      currentTask.completed = !currentTask.completed;
      renderList(); //Rendering the List
      showNotification("Task toggled successfully");
      return;
    }

    showNotification("Could not toggle the task");
  }

  //Function to delete Task
  function deleteTask(taskId) {
    //Filter the array, and return the items, where task id is not equal to the taskId in parameter
    const newTasks = tasks.filter(function (task) {
      return task.id !== taskId;
    });

    //Setting the new task array as the tasks.
    tasks = newTasks;
    renderList(); //Rendering the List
    showNotification("Task Deleted Successfully");
  }

  //Function to add Task
  function addTask(task) {
    //If task is present
    if (task) {
      //Push the task to the array
      tasks.push(task);
      renderList(); //Render the list
      showNotification("Task Added Successfully");
      return;
    }

    showNotification("Task cannot be added");
  }

  //Function to show notification
  function showNotification(text) {
    alert(text);
  }

  function handleInputKeypress(e) {
    //When user press enter perform some action
    if (e.key === "Enter") {
      const text = e.target.value; //Get the input value on enter

      //If input box is empty show notification
      if (!text) {
        showNotification("Task text cannot be empty");
        return;
      }

      //Create Task Object
      const task = {
        title: text,
        id: Date.now(),
        completed: false,
      };

      //Clear Input Box after creation of Task
      e.target.value = "";

      //Call Add Task function and pass the new Task
      addTask(task);
    }
  }

  //Handle the Click Listener throughout the document : Event Delegation
  function handleClickListener(e) {
    const target = e.target; //Get the target which was clicked

    //If the class Name of target is delete, perform delete function
    if (target.className === "delete") {
      const taskId = Number(target.dataset.id); //Getting the value of Data Attribute i.e data-id can be accessed using element.dataset.id
      deleteTask(taskId); //Call Delete function and pass the taskId to it
      return;
    } else if (target.className === "custom-checkbox") {
      //If the class Name of target is custom-checkbox than toggle the task
      const taskId = Number(target.id); //Getting the value of id attribute of target.
      toggleTask(taskId);
      return;
    }
  }

  //Starts the application, by adding Event Listeners
  function initializeApp() {
    fetchTodos();
    //Add Event Listener on input box, on keyup
    addTaskInput.addEventListener("keyup", handleInputKeypress);

    //Apply Event Delegation, by applying click event on whole document
    document.addEventListener("click", handleClickListener);
  }

  initializeApp();
})();
