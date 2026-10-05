/* ==========================================
   STAFF MAIN PAGE
========================================== */

/* ==========================================
   FIRST LOGIN STAFF ACCOUNT SETUP
========================================== */

const staffSetupModal =
    document.getElementById("staffSetupModal");

const staffSetupForm =
    document.getElementById("staffSetupForm");

const staffSetupMessage =
    document.getElementById("staffSetupMessage");


function setupNewStaffAccount() {

    const currentUser =
        JSON.parse(
            sessionStorage.getItem("currentUser")
        );

    if (!currentUser) {
        return;
    }


    /* EXISTING DEMO ACCOUNTS DO NOT NEED SETUP */

    if (
        currentUser.id === "SMCREGISTRAR" ||
        currentUser.id === "SMCGUIDANCE"
    ) {
        return;
    }


    const staffData =
        JSON.parse(
            localStorage.getItem("staffData")
        ) || [];


    const staffIndex =
        staffData.findIndex(function (staff) {

            return staff.staffId === currentUser.id;

        });


    if (staffIndex === -1) {
        return;
    }


    const staff =
        staffData[staffIndex];


    /* ONLY SHOW SETUP FOR NEW STAFF */

    if (staff.temporaryPassword === true) {

        document.body.classList.add(
            "staff-setup-required"
        );

        document.getElementById("setupName").value =
            staff.name === "—"
                ? ""
                : (staff.name || "");

        document.getElementById("setupEmail").value =
            staff.email || "";

        document.getElementById("setupPhone").value =
            staff.phone === "—"
                ? ""
                : (staff.phone || "");

        staffSetupModal.classList.add("show");
    }

}

if (staffSetupForm) {

    staffSetupForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const currentUser =
                JSON.parse(
                    sessionStorage.getItem("currentUser")
                );

            if (!currentUser) {
                return;
            }

            const name =
                document.getElementById("setupName")
                    .value.trim();

            const email =
                document.getElementById("setupEmail")
                    .value.trim();

            const phone =
                document.getElementById("setupPhone")
                    .value.trim();

            const newPassword =
                document.getElementById("setupNewPassword")
                    .value;

            const confirmPassword =
                document.getElementById("setupConfirmPassword")
                    .value;

            /* ==========================================
               CHECK REQUIRED FIELDS
            ========================================== */

            if (
                !name ||
                !email ||
                !phone ||
                !newPassword ||
                !confirmPassword
            ) {

                staffSetupMessage.textContent =
                    "Please complete all fields.";

                staffSetupMessage.style.display =
                    "block";

                return;
            }

            /* ==========================================
               CHECK PASSWORD MATCH
            ========================================== */

            if (newPassword !== confirmPassword) {

                staffSetupMessage.textContent =
                    "Passwords do not match.";

                staffSetupMessage.style.display =
                    "block";

                return;
            }

            /* ==========================================
               CHECK PASSWORD LENGTH
            ========================================== */

            if (newPassword.length < 8) {

                staffSetupMessage.textContent =
                    "Password must be at least 8 characters.";

                staffSetupMessage.style.display =
                    "block";

                return;
            }

            /* ==========================================
               GET STAFF DATA
            ========================================== */

            const staffData =
                JSON.parse(
                    localStorage.getItem("staffData")
                ) || [];

            const staffIndex =
                staffData.findIndex(function (staff) {

                    return (
                        staff.staffId ===
                        currentUser.id
                    );

                });

            if (staffIndex === -1) {

                staffSetupMessage.textContent =
                    "Staff account could not be found.";

                staffSetupMessage.style.display =
                    "block";

                return;
            }

            /* ==========================================
               UPDATE STAFF ACCOUNT
            ========================================== */

            staffData[staffIndex].name =
                name;

            staffData[staffIndex].email =
                email;

            staffData[staffIndex].phone =
                phone;

            staffData[staffIndex].password =
                newPassword;

            staffData[staffIndex].temporaryPassword =
                false;

            staffData[staffIndex].status =
                "active";

            /* ==========================================
               SAVE STAFF DATA
            ========================================== */

            localStorage.setItem(
                "staffData",
                JSON.stringify(staffData)
            );

            /* ==========================================
               UPDATE CURRENT SESSION
            ========================================== */

            currentUser.name =
                name;

            currentUser.email =
                email;

            currentUser.phone =
                phone;

            currentUser.password =
                newPassword;

            currentUser.temporaryPassword =
                false;

            currentUser.status =
                "active";

            sessionStorage.setItem(
                "currentUser",
                JSON.stringify(currentUser)
            );

            /* ==========================================
               CLOSE SETUP SCREEN
            ========================================== */

            staffSetupMessage.style.display =
                "none";

            staffSetupModal.classList.remove(
                "show"
            );

            document.body.classList.remove(
                "staff-setup-required"
            );

            /* ==========================================
               REFRESH STAFF DASHBOARD DISPLAY
            ========================================== */

            location.reload();

        }
    );

}

/* RUN FIRST LOGIN CHECK */

setupNewStaffAccount();

/* ==========================================
   GET LOGGED-IN STAFF ROLE
========================================== */

const mainpageRole =
    (sessionStorage.getItem("role") || "").toLowerCase();

const mainpageDocuments =
    JSON.parse(
        localStorage.getItem("documents")
    ) || [];


/* ==========================================
   DISPLAY STAFF DASHBOARD TITLE
========================================== */

const staffDashboardTitle =
    document.getElementById("staffDashboardTitle");

if (staffDashboardTitle) {

    if (mainpageRole === "guidance") {
        staffDashboardTitle.textContent = "Guidance";
    } else {
        staffDashboardTitle.textContent = "Registrar";
    }

}


/* ==========================================
   CHECK DOCUMENT ASSIGNMENT
========================================== */

function isDocumentAssignedToStaff(documentType) {

    const documentSettings =
        mainpageDocuments.find(function (document) {

            return document[0] === documentType;

        });

    if (!documentSettings) {
        return false;
    }

    const assignedRole =
        String(
            documentSettings[3] || ""
        ).toLowerCase();

    return assignedRole === mainpageRole;

}


/* ==========================================
   GET STAFF REQUESTS
========================================== */

function getStaffRequests() {

    const requests =
        JSON.parse(
            localStorage.getItem("demoRequests")
        ) || [];

    return requests.filter(function (request) {

        return isDocumentAssignedToStaff(
            request.documentType
        );

    });

}


/* ==========================================
   UPDATE DOCUMENT REQUEST COUNTS
========================================== */

function updateDocumentRequestsCount() {

    const requests =
        getStaffRequests();


    const activeRequests =
        requests.filter(function (request) {

            return (
                request.status === "Pending Review" ||
                request.status === "Payment Required" ||
                request.status === "Processing" ||
                request.status === "Ready for Pickup"
            );

        });


    const documentRequestsCount =
        document.getElementById(
            "documentRequestsCount"
        );

    const pendingReviewCount =
        document.getElementById(
            "pendingReviewCount"
        );

    const pendingPaymentCount =
        document.getElementById(
            "pendingPaymentCount"
        );

    const processingCount =
        document.getElementById(
            "processingCount"
        );

    const readyPickupCount =
        document.getElementById(
            "readyPickupCount"
        );


    if (documentRequestsCount) {

        documentRequestsCount.textContent =
            activeRequests.length;

    }


    if (pendingReviewCount) {

        pendingReviewCount.textContent =
            activeRequests.filter(function (request) {

                return request.status ===
                    "Pending Review";

            }).length;

    }


    if (pendingPaymentCount) {

        pendingPaymentCount.textContent =
            activeRequests.filter(function (request) {

                return request.status ===
                    "Payment Required";

            }).length;

    }


    if (processingCount) {

        processingCount.textContent =
            activeRequests.filter(function (request) {

                return request.status ===
                    "Processing";

            }).length;

    }


    if (readyPickupCount) {

        readyPickupCount.textContent =
            activeRequests.filter(function (request) {

                return request.status ===
                    "Ready for Pickup";

            }).length;

    }

}


/* ==========================================
   DISPLAY RECENT DOCUMENT ACTIVITY
========================================== */

const activityList =
    document.getElementById("activityList");


/* ==========================================
   GET GENERATED ACTIVITIES
========================================== */

function getGeneratedActivities() {

    const currentRequests =
        JSON.parse(
            localStorage.getItem("demoRequests")
        ) || [];


    const historyRequests =
        JSON.parse(
            localStorage.getItem(
                "staffDocumentHistory"
            )
        ) || [];


    const requests = [];

    const referenceNumbers =
        new Set();


    currentRequests.forEach(function (request) {

        if (
            request.referenceNumber &&
            !referenceNumbers.has(
                request.referenceNumber
            ) &&
            isDocumentAssignedToStaff(
                request.documentType
            )
        ) {

            referenceNumbers.add(
                request.referenceNumber
            );

            requests.push(request);

        }

    });


    historyRequests.forEach(function (request) {

        if (
            request.referenceNumber &&
            !referenceNumbers.has(
                request.referenceNumber
            ) &&
            isDocumentAssignedToStaff(
                request.documentType
            )
        ) {

            referenceNumbers.add(
                request.referenceNumber
            );

            requests.push(request);

        }

    });


    const generatedActivities = [];


    requests.forEach(function (request) {

        /* ==========================================
           DOCUMENT REQUEST SUBMITTED
        ========================================== */

        if (request.dateRequested) {

            generatedActivities.push({

                icon: "📄",

                title:
                    "Document request submitted",

                description:
                    request.name +
                    " submitted a " +
                    request.documentType +
                    " request.",

                date:
                    request.dateRequested,

                referenceNumber:
                    request.referenceNumber

            });

        }


        /* ==========================================
           COMPLETED / REJECTED REQUEST
        ========================================== */

        const status =
            (request.status || "").toLowerCase();


        if (
            status === "completed" ||
            status === "rejected"
        ) {

            const activityDate =
                request.dateCompleted ||
                request.dateFinalized ||
                request.dateRequested;


            generatedActivities.push({

                icon:
                    status === "completed"
                        ? "✓"
                        : "✕",

                title:
                    status === "completed"
                        ? "Document request completed"
                        : "Document request rejected",

                description:
                    request.name +
                    "'s " +
                    request.documentType +
                    " request was " +
                    status +
                    ".",

                date:
                    activityDate,

                referenceNumber:
                    request.referenceNumber

            });

        }

    });


    return generatedActivities;

}


/* ==========================================
   FORMAT ACTIVITY DATE
========================================== */

function formatActivityDate(dateString) {

    if (!dateString) {
        return "";
    }


    let date;


    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            dateString
        )
    ) {

        date =
            new Date(
                dateString + "T00:00:00"
            );

    } else {

        date =
            new Date(dateString);

    }


    if (isNaN(date.getTime())) {
        return dateString;
    }


    return date.toLocaleDateString(
        "en-US",
        {
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );

}


/* ==========================================
   DISPLAY ACTIVITIES
========================================== */

function displayActivities() {

    if (!activityList) {
        return;
    }


    const savedActivities =
        JSON.parse(
            localStorage.getItem(
                "staffRecentActivities"
            )
        ) || [];


    const roleActivities =
        savedActivities.filter(function (activity) {

            if (!activity.documentType) {
                return true;
            }

            return isDocumentAssignedToStaff(
                activity.documentType
            );

        });


    const generatedActivities =
        getGeneratedActivities();


    const allActivities = [
        ...roleActivities,
        ...generatedActivities
    ];


    /* ==========================================
       REMOVE DUPLICATES
    ========================================== */

    const uniqueActivities = [];


    allActivities.forEach(function (activity) {

        const exists =
            uniqueActivities.some(function (item) {

                return (
                    item.title === activity.title &&
                    item.description ===
                        activity.description &&
                    item.date === activity.date
                );

            });


        if (!exists) {

            uniqueActivities.push(
                activity
            );

        }

    });


    /* ==========================================
       SORT NEWEST FIRST
    ========================================== */

    uniqueActivities.sort(function (a, b) {

        return new Date(b.date) -
            new Date(a.date);

    });


    /* ==========================================
       DISPLAY LATEST 7
    ========================================== */

    activityList.innerHTML = "";


    uniqueActivities
        .slice(0, 7)
        .forEach(function (activity) {

            const activityItem =
                document.createElement("div");


            activityItem.className =
                "activity-item";


            activityItem.innerHTML = `
                <div class="activity-icon">
                    ${activity.icon}
                </div>

                <div class="activity-info">
                    <span class="activity-title">
                        ${activity.title}
                    </span>

                    <span class="activity-description">
                        ${activity.description}
                    </span>
                </div>

                <span class="activity-date">
                    ${formatActivityDate(activity.date)}
                </span>
            `;


            activityList.appendChild(
                activityItem
            );

        });

}


/* ==========================================
   PENDING REQUESTS BUTTON
========================================== */

const pendingRequestsBtn =
    document.getElementById(
        "pendingRequestsBtn"
    );


if (pendingRequestsBtn) {

    pendingRequestsBtn.addEventListener(
        "click",
        function () {

            window.location.href =
                "staff-docrequests.html";

        }
    );

}


/* ==========================================
   INITIAL DISPLAY
========================================== */

displayActivities();

updateDocumentRequestsCount();


/* ==========================================
   UPDATE WHEN REQUEST DATA CHANGES
========================================== */

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key === "demoRequests" ||
            event.key === "staffDocumentHistory" ||
            event.key === "staffRecentActivities" ||
            event.key === "documents"
        ) {

            displayActivities();

            updateDocumentRequestsCount();

        }

    }
);