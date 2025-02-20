$(document).ready(function() {
    // Check for saved dark mode preference
    if (localStorage.getItem("darkMode") === "enabled") {
        enableDarkMode();
    }

    // Dark Mode Toggle
    $("#darkModeToggle").click(function() {
        if ($("body").hasClass("dark-mode")) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    function enableDarkMode() {
        $("body").addClass("dark-mode bg-dark text-white");
        $("header, footer").addClass("bg-dark"); //changes
        $(".list-group-item").addClass("bg-secondary text-white");
        $("#darkModeToggle").text("Light Mode");
        $(".carousel-item img").css("opacity", "0.9"); // Make carousel images semi-transparent
        localStorage.setItem("darkMode", "enabled"); // Save preference
    }

    function disableDarkMode() {
        $("body").removeClass("dark-mode bg-dark text-white");
        $("header, footer").removeClass("bg-dark"); //changes
        $(".list-group-item").removeClass("bg-secondary text-white");
        $("#darkModeToggle").text("Dark Mode");
        $(".carousel-item img").css("opacity", "1"); // Restore full opacity
        localStorage.setItem("darkMode", "disabled"); // Save preference
    }
});
