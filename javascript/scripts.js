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
    const releaseDate = new Date(2025, 3, 14, 17, 45, 0).getTime();

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

/* TASK MANAGEMENT SYSTEM */
$(document).ready(function() { // Ensures the script runs only after the document is fully loaded
    let tasks = []; // Array to store all tasks

    // Add Task Function
    $("#taskForm").submit(function(e) { // Listens for form submission
        e.preventDefault(); // Prevents page refresh on form submission

        // Get input values from form fields
        const name = $("#taskName").val(); // Retrieves the task name
        const description = $("#taskDescription").val(); // Retrieves the task description
        const date = $("#taskDate").val(); // Retrieves the task release date
        const cost = parseFloat($("#taskCost").val()); // Retrieves and converts cost to a floating-point number
        const priority = $("#taskPriority").val(); // Retrieves the selected priority level
        const status = "Pending"; // Sets the initial status of the task to "Pending"

        // Create a task object with a unique ID
        const newTask = {
            id: Date.now(), // Generates a unique ID using the current timestamp
            name, 
            description,
            date,
            cost,
            priority,
            status
        };

        tasks.push(newTask); // Adds the new task to the tasks array
        updateTaskList(); // Updates the displayed task list
        updateSummary(); // Updates task summary (total tasks & costs)
        updateLatestActivity(`Added task: ${name} (${priority} priority)`); // Logs action in Latest Activity
        this.reset(); // Resets the form fields
    });

    // Function to Update Task List (Refresh the table)
    function updateTaskList() {
        const $taskList = $("#taskList"); // Selects the task list table body
        $taskList.empty(); // Clears the existing table content

        // Loop through all tasks and create table rows dynamically
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

            $taskList.append($row); // Appends the row to the table
        });
    }

    // Inline Editing on Double Click
    $("#taskList").on("dblclick", ".editable", function() { // Listens for double-clicks on editable table cells
        let currentText = $(this).text(); // Gets the current cell text
        let inputField = $("<input type='text' class='form-control'>").val(currentText); // Creates an input field with current text
        $(this).html(inputField); // Replaces cell content with input field

        inputField.focus().on("blur keypress", function(e) { 
            if (e.type === "blur" || e.which === 13) { // If Enter key is pressed or focus is lost
                let newValue = $(this).val(); // Gets updated input value
                $(this).parent().text(newValue); // Updates the table cell with new value
            }
        });
    });

    // Delete Task Function
    $("#taskList").on("click", ".delete-task", function() { // Listens for delete button click
        const id = $(this).closest("tr").data("id"); // Gets the task ID from table row
        tasks = tasks.filter(t => t.id !== id); // Filters out the deleted task from the array
        updateLatestActivity("Deleted a task."); // Logs activity
        updateTaskList(); // Refreshes task list
        updateSummary(); // Updates summary
    });

    // Mark Task as Purchased
    $("#taskList").on("click", ".mark-purchased", function() { // Listens for "Mark as Purchased" button click
        const id = $(this).closest("tr").data("id"); // Gets the task ID from table row
        const task = tasks.find(t => t.id === id); // Finds the specific task in the array

        if (task.status === "Pending") { // Ensures only pending tasks can be purchased
            task.status = "Purchased"; // Updates task status
            updateLatestActivity(`Marked as purchased: ${task.name}`); // Logs action
        }

        updateTaskList(); // Refreshes task list
        updateSummary(); // Updates task summary
    });

    // Function to Update Summary Section
    function updateSummary() {
        const totalItems = tasks.length; // Counts total tasks
        const totalPendingCost = tasks
            .filter(t => t.status === "Pending") // Filters only pending tasks
            .reduce((sum, t) => sum + t.cost, 0); // Adds up pending costs

        const totalPurchasedCost = tasks
            .filter(t => t.status === "Purchased") // Filters only purchased tasks
            .reduce((sum, t) => sum + t.cost, 0); // Adds up purchased costs

        $("#totalItems").text(totalItems); // Updates total tasks display
        $("#totalPendingCost").text(totalPendingCost.toFixed(2)); // Updates pending cost
        $("#totalPurchasedCost").text(totalPurchasedCost.toFixed(2)); // Updates purchased cost
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
