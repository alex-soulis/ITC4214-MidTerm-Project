/*DARK MODE TOGGLE */
$(document).ready(function() {
    // Check if dark mode is enabled in local storage
    if (localStorage.getItem("darkMode") === "enabled") {
        enableDarkMode();
    }

    // Toggle Dark Mode when button is clicked
    $("#darkModeToggle").click(function() {
        if ($("body").hasClass("dark-mode")) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    // Function to enable dark mode
    function enableDarkMode() {
        $("body").addClass("dark-mode bg-dark text-white"); // Add dark mode classes
        $("header, footer").addClass("bg-dark"); // Darken header & footer
        $(".list-group-item").addClass("bg-secondary text-white"); // Darken list items
        $("#darkModeToggle").html('<i class="bi bi-sun-fill"></i>'); // Change button icon to Sun
        localStorage.setItem("darkMode", "enabled"); // Save mode in local storage
    }

    // Function to disable dark mode
    function disableDarkMode() {
        $("body").removeClass("dark-mode bg-dark text-white"); // Removes the dark mode classes
        $("header, footer").removeClass("bg-dark"); // Removes the dark color from header & footer
        $(".list-group-item").removeClass("bg-secondary text-white"); // Removes the dark of the list items
        $("#darkModeToggle").html('<i class="bi bi-moon-fill"></i>'); // Change button icon to Moon
        localStorage.setItem("darkMode", "disabled"); // Save mode in local storage
    }
});

/*COUNTDOWN TIMER FOR SNEAKER DROP */
function countdownTimer() {
    // Set the sneaker drop release date (Year, Month-1, Day, Hour, Minute, Second)
    const releaseDate = new Date(2025, 2, 14, 0, 0, 0).getTime();

    const timer = setInterval(function () {
        const now = new Date().getTime(); // Get current time
        const timeLeft = releaseDate - now; // Calculate remaining time

        if (timeLeft < 0) {
            clearInterval(timer); // Stop timer when countdown reaches 0
            $("#countdown").html("🚀 DROP IS LIVE! GET YOURS NOW! 🔥");
            $("#countdown-box").addClass("drop-live"); // Highlight the countdown box
            return;
        }

        // Convert time to Days, Hours, Minutes, and Seconds
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        // Display countdown time
        $("#countdown").html(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000); // Update every second
}

$(document).ready(function() {
    countdownTimer();
});

/*LATEST ACTIVITY TRACKER */
// Function to update Latest Activity section
function updateLatestActivity(action) {
    let activities = JSON.parse(localStorage.getItem("latestActivities")) || [];

    activities.unshift(action); // Add new activity at the top

    if (activities.length > 5) {
        activities.pop(); // Keep only the latest 5 activities
    }

    localStorage.setItem("latestActivities", JSON.stringify(activities)); // Save to local storage

    displayLatestActivity(); // Refresh activity list
}

// Function to display the latest activities on the index page
function displayLatestActivity() {
    // Retrieve the latest activities from local storage.
    // If no activities exist, initialize with an empty array.
    let activities = JSON.parse(localStorage.getItem("latestActivities")) || [];

    // Select the unordered list (<ul>) element where the latest activities will be displayed.
    let activityList = $("#latestActivity");

    // Clear any existing list items before updating the list.
    activityList.empty();

    // Check if there are no activities stored
    if (activities.length === 0) {
        // If no activities exist, add a default message to indicate no recent activity.
        activityList.append('<li class="list-group-item">No recent activity.</li>');
    } else {
        // Loop through each activity in the array and append it to the list.
        activities.forEach(activity => {
            // Create a new list item (`<li>`) for each activity and append it to the activity list.
            activityList.append(`<li class="list-group-item">${activity}</li>`);
        });
    }
}


// Load latest activity on page load
$(document).ready(function () {
    displayLatestActivity();
});

/*ABOUT PAGE - ANIMATED COUNTERS */
$(document).ready(function () {
    $(".counter").each(function () {
        let $this = $(this);
        let target = parseInt($this.attr("data-target"));

        $({ count: 0 }).animate({ count: target }, {
            duration: 2000, // Animation duration (2 seconds)
            easing: "swing",
            step: function () {
                $this.text(Math.floor(this.count)); // Update counter dynamically
            },
            complete: function () {
                $this.text(target); // Ensure final value is correct
            }
        });
    });
});
/* Task Page */
//Ensure the script runs only after the DOM (web page) is fully loaded.
$(document).ready(function() {

    //Retrieve saved tasks from localStorage or initialize an empty array if no tasks exist.
    let tasks = JSON.parse(localStorage.getItem("tasks")) || []; 

    //Load tasks from localStorage and display them when the page loads.
    updateTaskList();
    
    //Load summary statistics (total tasks, costs) when the page loads.
    updateSummary(); 

    //Function to save tasks into localStorage to ensure data persists after page refresh.
    function saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(tasks)); // Convert tasks array into a JSON string and store it.
    }

    // Function to handle the task form submission.
    $("#taskForm").submit(function(e) {
        e.preventDefault(); //Prevents the page from refreshing when the form is submitted.

        // 📝 Capture user input values from the form fields.
        const name = $("#taskName").val(); // Get task name.
        const description = $("#taskDescription").val(); // Get task description.
        const date = $("#taskDate").val(); // Get the sneaker release date.
        const cost = parseFloat($("#taskCost").val()); // Get the estimated cost and convert it to a number.
        const priority = $("#taskPriority").val(); // Get priority level (High, Medium, Low).
        const status = "Pending"; // Default status when a task is created.

        // 🆕 Create a new task object with the gathered information.
        const newTask = {
            id: Date.now(), // Assign a unique ID based on the current timestamp.
            name,
            description,
            date,
            cost,
            priority,
            status
        };

        tasks.push(newTask); //Add the new task to the tasks array.
        saveTasks(); //Save the updated task list to localStorage.
        updateTaskList(); //Refresh the task table to display the new task.
        updateSummary(); //Update the task summary statistics.
        updateLatestActivity(`Added task: ${name} (${priority} priority)`); //Log this activity in the Latest Activity section.

        this.reset(); //Clear/reset the form after submission.
    });

    //Function to update the task table.
    function updateTaskList() {
        const $taskList = $("#taskList"); // Select the table body.
        $taskList.empty(); //Clear the existing table rows before reloading the updated task list.

        // If there are no tasks, display a default message.
        if (tasks.length === 0) {
            $taskList.append(`<tr><td colspan="7" class="text-center">No items added yet.</td></tr>`);
            return;
        }

        //Loop through the tasks array and create a table row for each task.
        tasks.forEach(task => {
            const $row = $(`
                <tr data-id="${task.id}">
                    <td class="editable">${task.name}</td>
                    <td class="editable">${task.description}</td>
                    <td class="editable">${task.date}</td>
                    <td class="editable">$${task.cost.toFixed(2)}</td>
                    <td class="editable">${task.priority}</td>
                    <td>${task.status}</td>
                    <td>
                        <button class="btn btn-sm btn-danger delete-task">Delete</button>
                        <button class="btn btn-sm btn-success mark-purchased">Mark as Purchased</button>
                    </td>
                </tr>
            `);
            $taskList.append($row); //Append the new row to the table.
        });
    }

    //Enable inline editing of task details on **double-click**.
    $("#taskList").on("dblclick", ".editable", function() {
        let currentText = $(this).text(); //Get the current text of the cell.
        let inputField = $("<input type='text' class='form-control'>").val(currentText); // Create an input field and set its value to the current text.
        $(this).html(inputField); // Replace the cell's content with the input field.

        // Save the updated value when the user clicks outside (blur) or presses Enter.
        inputField.focus().on("blur keypress", function(e) {
            if (e.type === "blur" || e.which === 13) { // If focus is lost or the Enter key (key code 13) is pressed:
                let newValue = $(this).val(); // Get the updated value.
                let taskId = $(this).closest("tr").data("id"); // Retrieve the task ID from the row.
                let task = tasks.find(t => t.id === taskId); // Find the corresponding task in the array.

                let columnIndex = $(this).parent().index(); // Get the column index of the edited cell.
                switch (columnIndex) {
                    case 0: task.name = newValue; break; // Update task name.
                    case 1: task.description = newValue; break; // Update task description.
                    case 2: task.date = newValue; break; // Update release date.
                    case 3: task.cost = parseFloat(newValue.replace("$", "")); break; // Update estimated cost.
                    case 4: task.priority = newValue; break; // Update priority.
                }

                saveTasks(); //Save the updated tasks.
                updateTaskList(); //Refresh the task list to reflect the changes.
            }
        });
    });

    // Delete a task when the "Delete" button is clicked.
    $("#taskList").on("click", ".delete-task", function() {
        const id = $(this).closest("tr").data("id"); // Retrieve the task ID.
        tasks = tasks.filter(t => t.id !== id); // Remove the task from the array.
        saveTasks(); // 💾 Save the updated task list.
        updateLatestActivity("Deleted a task."); // Log this action in Latest Activity.
        updateTaskList(); //Refresh the table.
        updateSummary(); // Update the task summary.
    });

    // Mark a task as "Purchased" when the button is clicked.
    $("#taskList").on("click", ".mark-purchased", function() {
        const id = $(this).closest("tr").data("id"); // Get task ID.
        const task = tasks.find(t => t.id === id); // Locate the task in the array.

        if (task.status === "Pending") {
            task.status = "Purchased"; // Update the task status.
            updateLatestActivity(`Marked as purchased: ${task.name}`); // Log the action in Latest Activity.
        }

        saveTasks(); // Save the updated tasks.
        updateTaskList(); // Refresh the task list.
        updateSummary(); // Update the summary section.
    });

    // Function to update the summary section.
    function updateSummary() {
        const totalItems = tasks.length; // Count the total number of tasks.
        
        // Calculate total cost of "Pending" tasks.
        const totalPendingCost = tasks
            .filter(t => t.status === "Pending") // Get tasks that are still pending.
            .reduce((sum, t) => sum + t.cost, 0); // Sum their costs.

        // Calculate total cost of "Purchased" tasks.
        const totalPurchasedCost = tasks
            .filter(t => t.status === "Purchased") // Get tasks that have been purchased.
            .reduce((sum, t) => sum + t.cost, 0); // Sum their costs.

        // Update the UI with the calculated values.
        $("#totalItems").text(totalItems);
        $("#totalPendingCost").text(totalPendingCost.toFixed(2));
        $("#totalPurchasedCost").text(totalPurchasedCost.toFixed(2));
    }
});

/* FILTER TASKS BY PRIORITY */
$("#priorityFilter").change(function() { // Listens for changes in the priority filter dropdown
    const selectedPriority = $(this).val(); // Gets selected priority

    $("#taskList tr").each(function() { // Loops through each task row in the table
        const taskPriority = $(this).find("td:nth-child(5)").text().toLowerCase(); // Gets the priority column text

        if (selectedPriority === "all" || taskPriority === selectedPriority) {
            $(this).show(); // Show matching tasks
        } else {
            $(this).hide(); // Hide non-matching tasks
        }
    });
});

/* CONTACT FORM SUBMISSION */
$(document).ready(function() {
    $("#contactForm").submit(function(e) { // Listens for form submission
        e.preventDefault(); // Prevents page refresh
        alert("Thank you, " + $("#name").val() + "! Your message has been sent."); // Displays confirmation message
        this.reset(); // Resets the form fields
    });
});

/* SHOW/HIDE LOGO ON SCROLL */
$(document).ready(function() {
    $(window).scroll(function() { // Detects window scroll event
        if ($(window).scrollTop() > 100) { // If scrolled more than 100 pixels
            $("#navLogo").removeClass("d-none"); // Show logo
        } else {
            $("#navLogo").addClass("d-none"); // Hide logo
        }
    });
});
