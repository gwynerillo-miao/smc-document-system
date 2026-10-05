// ==========================================
// FRONTEND-ONLY ADMIN ACCOUNT
// ==========================================

const adminAccount = {
    id: "SMCADMIN",
    password: "demo1234",
    name: "Administrator",
    role: "admin"
};

// ==========================================
// ADMIN AND STAFF LOGIN
// ==========================================

const staffLoginForm =
    document.getElementById("staffLoginForm");

const loginMessage =
    document.getElementById("loginMessage");

staffLoginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const idNumber =
        document.getElementById("staffLoginId").value.trim();

    const password =
        document.getElementById("staffLoginPass").value;

    // ==========================================
    // ADMIN PASSWORD
    // ==========================================

    const savedAdminPassword =
        localStorage.getItem("adminPassword") ||
        adminAccount.password;

    // ==========================================
    // SAVED STAFF ACCOUNTS
    // ==========================================

    const savedStaffData =
        JSON.parse(
            localStorage.getItem("staffData")
        ) || [];

    const savedStaffAccounts =
        savedStaffData
            .filter(function (staff) {
                return (
                    staff.password &&
                    staff.staffId &&
                    staff.status !== "inactive"
                );
            })
            .map(function (staff) {
                return {
                    id: String(staff.staffId).trim(),
                    staffId: String(staff.staffId).trim(),
                    password: String(staff.password),
                    name: staff.name || "Staff",
                    email: staff.email || "",
                    phone: staff.phone || "",
                    role: String(
                        staff.role || ""
                    ).toLowerCase(),
                    status: staff.status || "pending",
                    temporaryPassword:
                        staff.temporaryPassword === true
                };
            });

    // ==========================================
    // ALL ACCOUNTS
    // ==========================================

    const accounts = [
        {
            id: adminAccount.id,
            password: savedAdminPassword,
            name: adminAccount.name,
            role: adminAccount.role
        },
        ...savedStaffAccounts
    ];

    // ==========================================
    // FIND ACCOUNT
    // ==========================================

    const account =
        accounts.find(function (user) {
            return (
                user.id === idNumber &&
                user.password === password
            );
        });

    // ==========================================
    // INVALID LOGIN
    // ==========================================

    if (!account) {
        loginMessage.textContent =
            "Invalid ID or password.";

        loginMessage.style.display =
            "block";

        return;
    }

    // ==========================================
    // SUCCESSFUL LOGIN
    // ==========================================

    loginMessage.style.display =
        "none";

    sessionStorage.setItem(
        "currentUser",
        JSON.stringify(account)
    );

    sessionStorage.setItem(
        "role",
        account.role
    );

    // ==========================================
    // REDIRECT
    // ==========================================

    if (account.role === "admin") {
        window.location.href =
            "admin-mainpage.html";
    } else {
        window.location.href =
            "staff-mainpage.html";
    }
});

/* ==========================================
   SHOW / HIDE LOGIN PASSWORD
========================================== */

const toggleLoginPassword =
    document.getElementById("toggleLoginPassword");

const staffLoginPass =
    document.getElementById("staffLoginPass");

if (toggleLoginPassword && staffLoginPass) {

    toggleLoginPassword.addEventListener(
        "click",
        function () {

            if (staffLoginPass.type === "password") {

                staffLoginPass.type = "text";

                toggleLoginPassword.textContent = "👁";
                toggleLoginPassword.setAttribute(
                    "aria-label",
                    "Hide password"
                );

            } else {

                staffLoginPass.type = "password";

                toggleLoginPassword.textContent = "👁";
                toggleLoginPassword.setAttribute(
                    "aria-label",
                    "Show password"
                );
            }
        }
    );
}