/* ==========================================
   STAFF SESSION CHECK
========================================== */

const currentUser = sessionStorage.getItem("currentUser");
const userRole = sessionStorage.getItem("role");

if (
    !currentUser ||
    (userRole !== "registrar" && userRole !== "guidance")
) {
    window.location.href = "internal-portal.html";
}

/* ==========================================
   DISPLAY LOGGED-IN STAFF
========================================== */

const staffName = document.getElementById("staffName");
const staffAvatar = document.getElementById("staffAvatar");

const staffData = JSON.parse(currentUser);

if (staffData.role === "registrar") {

    staffName.textContent = "Registrar";
    staffAvatar.textContent = "R";

}

if (staffData.role === "guidance") {

    staffName.textContent = "Guidance";
    staffAvatar.textContent = "G";

}

/* ==========================================
   STAFF DROPDOWN
========================================== */

const staffMenuBtn = document.getElementById("staffMenuBtn");
const staffDropdown = document.getElementById("staffDropdown");

if (staffMenuBtn && staffDropdown) {

    staffMenuBtn.addEventListener("click", function (event) {

        event.stopPropagation();

        staffDropdown.classList.toggle("show");
        staffMenuBtn.classList.toggle("active");

    });

    document.addEventListener("click", function () {

        staffDropdown.classList.remove("show");
        staffMenuBtn.classList.remove("active");

    });

    staffDropdown.addEventListener("click", function (event) {

        event.stopPropagation();

    });

}

/* ==========================================
   STAFF LOGOUT
========================================== */

const staffLogoutBtn = document.getElementById("staffLogoutBtn");

if (staffLogoutBtn) {

    staffLogoutBtn.addEventListener("click", function () {

        sessionStorage.removeItem("currentUser");
        sessionStorage.removeItem("role");

        window.location.href = "internal-portal.html";

    });

}

/* ==========================================
   ACCOUNT SETTINGS MODAL
========================================== */

const accountSettingsBtn =
    document.getElementById("accountSettingsBtn");

const accountSettingsModal =
    document.getElementById("accountSettingsModal");

const closeAccountSettings =
    document.getElementById("closeAccountSettings");

const accountSettingsForm =
    document.getElementById("accountSettingsForm");

const accountStaffId =
    document.getElementById("accountStaffId");

const accountStaffName =
    document.getElementById("accountStaffName");

const accountStaffRole =
    document.getElementById("accountStaffRole");

const accountStaffEmail =
    document.getElementById("accountStaffEmail");

const accountStaffPhone =
    document.getElementById("accountStaffPhone");

const accountSettingsMessage =
    document.getElementById("accountSettingsMessage");


/* ==========================================
   OPEN ACCOUNT SETTINGS
========================================== */

if (accountSettingsBtn && accountSettingsModal) {

    accountSettingsBtn.addEventListener("click", function () {

        staffDropdown.classList.remove("show");
        staffMenuBtn.classList.remove("active");

        const currentUserData =
            JSON.parse(sessionStorage.getItem("currentUser"));

        if (!currentUserData) {
            return;
        }

        accountStaffId.textContent =
            currentUserData.staffId || "—";

        accountStaffName.textContent =
            currentUserData.name || "—";

        accountStaffRole.textContent =
            currentUserData.role || "—";

        accountStaffEmail.value =
            currentUserData.email || "";

        accountStaffPhone.value =
            currentUserData.phone || "";

        accountSettingsMessage.textContent = "";
        accountSettingsMessage.className = "";

        accountSettingsModal.classList.add("show");
        document.body.style.overflow = "hidden";

    });

}


/* ==========================================
   CLOSE ACCOUNT SETTINGS
========================================== */

function closeAccountSettingsModal() {

    if (!accountSettingsModal) {
        return;
    }

    accountSettingsModal.classList.remove("show");
    document.body.style.overflow = "";

    if (accountSettingsForm) {
        accountSettingsForm.reset();
    }

    if (accountSettingsMessage) {
        accountSettingsMessage.textContent = "";
        accountSettingsMessage.className = "";
    }

}


if (closeAccountSettings) {

    closeAccountSettings.addEventListener(
        "click",
        closeAccountSettingsModal
    );

}


if (accountSettingsModal) {

    accountSettingsModal.addEventListener(
        "click",
        function (event) {

            if (event.target === accountSettingsModal) {

                closeAccountSettingsModal();

            }

        }
    );

}


/* ==========================================
   SAVE ACCOUNT SETTINGS
========================================== */

if (accountSettingsForm) {

    accountSettingsForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const currentUserData =
                JSON.parse(
                    sessionStorage.getItem("currentUser")
                );

            if (!currentUserData) {
                return;
            }

            const email =
                accountStaffEmail.value.trim();

            const phone =
                accountStaffPhone.value.trim();

            if (!email || !phone) {

                accountSettingsMessage.textContent =
                    "Email and contact number are required.";

                accountSettingsMessage.className =
                    "error";

                return;

            }

            /* ==========================================
               UPDATE SESSION DATA
            ========================================== */

            currentUserData.email = email;
            currentUserData.phone = phone;

            sessionStorage.setItem(
                "currentUser",
                JSON.stringify(currentUserData)
            );

            /* ==========================================
            UPDATE STAFF DATA
            ========================================== */

            let allStaff =
                JSON.parse(
                    localStorage.getItem("staffData")
                ) || [];

            const staffIndex =
                allStaff.findIndex(function (staff) {

                    return String(staff.staffId).trim() ===
                        String(currentUserData.staffId).trim();

                });

            if (staffIndex !== -1) {

                allStaff[staffIndex].email = email;
                allStaff[staffIndex].phone = phone;

                localStorage.setItem(
                    "staffData",
                    JSON.stringify(allStaff)
                );

                /* UPDATE SESSION WITH THE SAME STAFF RECORD */

                const updatedStaffData = {
                    ...currentUserData,
                    email: email,
                    phone: phone
                };

                sessionStorage.setItem(
                    "currentUser",
                    JSON.stringify(updatedStaffData)
                );

            } else {

                console.log(
                    "Staff account not found in staffData:",
                    currentUserData.staffId
                );

            }

            /* ==========================================
               SUCCESS MESSAGE
            ========================================== */

            accountSettingsMessage.textContent =
                "Account details updated successfully.";

            accountSettingsMessage.className =
                "success";

        }
    );

}


/* ==========================================
   CHANGE PASSWORD MODAL
========================================== */

const changePasswordBtn =
    document.getElementById("changePasswordBtn");

const changePasswordModal =
    document.getElementById("changePasswordModal");

const closeChangePassword =
    document.getElementById("closeChangePassword");

const changePasswordForm =
    document.getElementById("changePasswordForm");

const changePasswordMessage =
    document.getElementById("changePasswordMessage");


if (changePasswordBtn) {

    changePasswordBtn.addEventListener("click", function () {

        staffDropdown.classList.remove("show");
        staffMenuBtn.classList.remove("active");

        changePasswordModal.classList.add("show");
        document.body.style.overflow = "hidden";

    });

}


if (closeChangePassword) {

    closeChangePassword.addEventListener("click", function () {

        changePasswordModal.classList.remove("show");
        document.body.style.overflow = "";
        changePasswordForm.reset();
        changePasswordMessage.textContent = "";
        changePasswordMessage.className = "";

    });

}


if (changePasswordModal) {

    changePasswordModal.addEventListener("click", function (event) {

        if (event.target === changePasswordModal) {

            changePasswordModal.classList.remove("show");
            document.body.style.overflow = "";
            changePasswordForm.reset();
            changePasswordMessage.textContent = "";
            changePasswordMessage.className = "";

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
            JSON.parse(
                sessionStorage.getItem("currentUser")
            );

        if (currentPassword !== currentUserData.password) {

            changePasswordMessage.textContent =
                "Current password is incorrect.";

            changePasswordMessage.className = "error";

            return;

        }

        if (newPassword.length < 8) {

            changePasswordMessage.textContent =
                "New password must be at least 8 characters.";

            changePasswordMessage.className = "error";

            return;

        }

        if (newPassword !== confirmPassword) {

            changePasswordMessage.textContent =
                "New passwords do not match.";

            changePasswordMessage.className = "error";

            return;

        }

        currentUserData.password = newPassword;

        sessionStorage.setItem(
            "currentUser",
            JSON.stringify(currentUserData)
        );


        /* ==========================================
           UPDATE STAFF DATA
        ========================================== */

        let allStaff =
            JSON.parse(
                localStorage.getItem("staffData")
            ) || [];

        const staffIndex =
            allStaff.findIndex(function (staff) {

                return (
                    staff.staffId ===
                    currentUserData.staffId
                );

            });


        if (staffIndex !== -1) {

            allStaff[staffIndex].password =
                newPassword;

            allStaff[staffIndex].temporaryPassword =
                false;

            allStaff[staffIndex].status =
                "active";

            localStorage.setItem(
                "staffData",
                JSON.stringify(allStaff)
            );

        }


        changePasswordMessage.textContent =
            "Password changed successfully.";

        changePasswordMessage.className =
            "success";

        changePasswordForm.reset();

    });

}


/* ==========================================
   SHOW / HIDE PASSWORD
========================================== */

const passwordToggles =
    document.querySelectorAll(".password-toggle");

passwordToggles.forEach(function (button) {

    button.addEventListener("click", function () {

        const input = document.getElementById(
            button.getAttribute("data-target")
        );

        input.type =
            input.type === "password"
                ? "text"
                : "password";

    });

});


/* ==========================================
   SIDEBAR NAVIGATION
========================================== */

const dashboardBtn =
    document.getElementById("dashboardBtn");

const documentRequestsBtn =
    document.getElementById("documentRequestsBtn");

const documentHistoryBtn =
    document.getElementById("documentHistoryBtn");

const documentReportsBtn =
    document.getElementById("documentReportsBtn");


if (dashboardBtn) {

    dashboardBtn.addEventListener("click", function () {

        window.location.href = "staff-mainpage.html";

    });

}

if (documentRequestsBtn) {

    documentRequestsBtn.addEventListener("click", function () {

        window.location.href = "staff-docrequests.html";

    });

}

if (documentHistoryBtn) {

    documentHistoryBtn.addEventListener("click", function () {

        window.location.href = "staff-dochistory.html";

    });

}

if (documentReportsBtn) {

    documentReportsBtn.addEventListener("click", function () {

        window.location.href = "staff-docreports.html";

    });

}


/* ==========================================
   HIGHLIGHT CURRENT SIDEBAR PAGE
========================================== */

const currentPage = window.location.pathname;

if (
    currentPage.includes("staff-mainpage.html") &&
    dashboardBtn
) {

    dashboardBtn.classList.add("active");

}

if (
    currentPage.includes("staff-docrequests.html") &&
    documentRequestsBtn
) {

    documentRequestsBtn.classList.add("active");

}

if (
    currentPage.includes("staff-dochistory.html") &&
    documentHistoryBtn
) {

    documentHistoryBtn.classList.add("active");

}

if (
    currentPage.includes("staff-docreports.html") &&
    documentReportsBtn
) {

    documentReportsBtn.classList.add("active");

}