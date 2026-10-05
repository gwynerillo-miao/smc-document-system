/* ==========================================
   ADMIN SESSION CHECK
========================================== */

const currentUser = sessionStorage.getItem("currentUser");
const userRole = sessionStorage.getItem("role");

if (!currentUser || userRole !== "admin") {
    window.location.href = "internal-portal.html";
}

/* ==========================================
   DISPLAY LOGGED-IN ADMIN
========================================== */

const adminName = document.getElementById("adminName");

if (adminName) {
    adminName.textContent = JSON.parse(currentUser).name;
}

/* ==========================================
   ADMIN DROPDOWN
========================================== */

const adminMenuBtn = document.getElementById("adminMenuBtn");
const adminDropdown = document.getElementById("adminDropdown");

adminMenuBtn.addEventListener("click", function (event) {
    event.stopPropagation();

    adminDropdown.classList.toggle("show");
    adminMenuBtn.classList.toggle("active");
});

document.addEventListener("click", function () {
    adminDropdown.classList.remove("show");
    adminMenuBtn.classList.remove("active");
});

adminDropdown.addEventListener("click", function (event) {
    event.stopPropagation();
});


/* ==========================================
   ACCOUNT MANAGEMENT DROPDOWN
========================================== */

const accountBtn = document.querySelector(".account-btn");
const submenu = document.querySelector(".submenu");

const isAccountPage = window.location.pathname.includes("admin-accmgt.html");

accountBtn.addEventListener("click", function () {

    if (isAccountPage) {

        submenu.classList.toggle("show");
        accountBtn.classList.toggle("active");

    } else {

        window.location.href = "admin-accmgt.html";

    }

});


/* ==========================================
   KEEP ACCOUNT MANAGEMENT OPEN
   ON ACCOUNT MANAGEMENT PAGE
========================================== */

if (isAccountPage) {
    submenu.classList.add("show");
    accountBtn.classList.add("active");
}


/* ==========================================
   SIDEBAR NAVIGATION
========================================== */

document.getElementById("dashboardBtn").addEventListener("click", function () {
    window.location.href = "admin-mainpage.html";
});

document.getElementById("historyReportsBtn").addEventListener("click", function () {
    window.location.href = "admin-historyreports.html";
});

document.getElementById("documentSettingsBtn").addEventListener("click", function () {
    window.location.href = "admin-docsettings.html";
});

document.getElementById("announcementsBtn").addEventListener("click", function () {
    window.location.href = "admin-announcements.html";
});


/* ==========================================
   HIGHLIGHT CURRENT SIDEBAR PAGE
========================================== */

const currentPage = window.location.pathname;

if (currentPage.includes("admin-mainpage.html")) {
    document.getElementById("dashboardBtn").classList.add("active");
}

if (currentPage.includes("admin-historyreports.html")) {
    document.getElementById("historyReportsBtn").classList.add("active");
}

if (currentPage.includes("admin-docsettings.html")) {
    document.getElementById("documentSettingsBtn").classList.add("active");
}

if (currentPage.includes("admin-announcements.html")) {
    document.getElementById("announcementsBtn").classList.add("active");
}


/* ==========================================
   ADMIN LOGOUT
========================================== */

const adminLogoutBtn = document.getElementById("adminLogoutBtn");

if (adminLogoutBtn) {

    adminLogoutBtn.addEventListener("click", function () {

        sessionStorage.removeItem("currentUser");
        sessionStorage.removeItem("role");

        window.location.href = "internal-portal.html";

    });

}

/* ==========================================
   CHANGE PASSWORD MODAL
========================================== */

const changePasswordBtn = document.getElementById("changePasswordBtn");
const changePasswordModal = document.getElementById("changePasswordModal");
const closeChangePassword = document.getElementById("closeChangePassword");
const changePasswordForm = document.getElementById("changePasswordForm");
const changePasswordMessage = document.getElementById("changePasswordMessage");

if (changePasswordBtn) {

    changePasswordBtn.addEventListener("click", function () {

        adminDropdown.classList.remove("show");
        adminMenuBtn.classList.remove("active");

        changePasswordModal.classList.add("show");

    });

}

if (closeChangePassword) {

    closeChangePassword.addEventListener("click", function () {

        changePasswordModal.classList.remove("show");
        changePasswordForm.reset();
        changePasswordMessage.textContent = "";

    });

}

if (changePasswordModal) {

    changePasswordModal.addEventListener("click", function (event) {

        if (event.target === changePasswordModal) {

            changePasswordModal.classList.remove("show");
            changePasswordForm.reset();
            changePasswordMessage.textContent = "";

        }

    });

}


/* ==========================================
   CHANGE PASSWORD
========================================== */

if (changePasswordForm) {

    changePasswordForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const currentPassword =
            document.getElementById("currentPassword").value;

        const newPassword =
            document.getElementById("newPassword").value;

        const confirmPassword =
            document.getElementById("confirmPassword").value;

        const currentUserData =
            JSON.parse(sessionStorage.getItem("currentUser"));

        // Check current password
        if (currentPassword !== currentUserData.password) {

            changePasswordMessage.textContent =
                "Current password is incorrect.";

            changePasswordMessage.className = "error";

            return;
        }

        // Check password length
        if (newPassword.length < 8) {

            changePasswordMessage.textContent =
                "New password must be at least 8 characters.";

            changePasswordMessage.className = "error";

            return;
        }

        // Check password confirmation
        if (newPassword !== confirmPassword) {

            changePasswordMessage.textContent =
                "New passwords do not match.";

            changePasswordMessage.className = "error";

            return;
        }

        // Update password
        localStorage.setItem("adminPassword", newPassword);

        currentUserData.password = newPassword;

        sessionStorage.setItem(
            "currentUser",
            JSON.stringify(currentUserData)
        );

        changePasswordMessage.textContent =
            "Password changed successfully.";

        changePasswordMessage.className = "success";

        changePasswordForm.reset();

    });

}

/* ==========================================
   SHOW / HIDE PASSWORD
========================================== */

const passwordToggles = document.querySelectorAll(".password-toggle");

passwordToggles.forEach(function (button) {

    button.addEventListener("click", function () {

        const input = document.getElementById(
            button.getAttribute("data-target")
        );

        input.type = input.type === "password"
            ? "text"
            : "password";

    });

});