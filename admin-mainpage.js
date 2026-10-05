/* ==========================================
   PENDING ACCOUNT APPROVAL
========================================== */

const pendingAccountsBtn = document.getElementById("pendingAccountsBtn");

pendingAccountsBtn.addEventListener("click", function () {
    window.location.href = "admin-accmgt.html";
});


/* ==========================================
   DASHBOARD COUNTS
========================================== */

const currentStudentData =
    JSON.parse(
        localStorage.getItem("studentData")
    ) || [];

const currentStudentHistory =
    JSON.parse(
        localStorage.getItem("studentHistory")
    ) || [];

const currentStaffData =
    JSON.parse(
        localStorage.getItem("staffData")
    ) || [];

const currentDocuments =
    JSON.parse(
        localStorage.getItem("documents")
    ) || [];

const currentAnnouncements =
    JSON.parse(
        localStorage.getItem("demoAnnouncements")
    ) || [];


const pendingAccountCount =
    currentStudentData.filter(function (student) {
        return student.status === "pending";
    }).length;


const totalStudentsCount =
    currentStudentHistory.filter(function (student) {
        return student.status === "approved";
    }).length;


const totalActiveStaffCount =
    currentStaffData.filter(function (staff) {
        return staff.status === "active";
    }).length;


const totalDocumentsCount =
    currentDocuments.length;


const totalActiveAnnouncementsCount =
    currentAnnouncements.length;


/* ==========================================
   DISPLAY COUNTS
========================================== */

document.getElementById("pendingAccountCount").textContent =
    pendingAccountCount;

document.getElementById("totalStudentsCount").textContent =
    totalStudentsCount;

document.getElementById("totalActiveStaffCount").textContent =
    totalActiveStaffCount;

document.getElementById("totalDocumentsCount").textContent =
    totalDocumentsCount;

document.getElementById("totalActiveAnnouncementsCount").textContent =
    totalActiveAnnouncementsCount;

/* ==========================================
   DISPLAY RECENT SYSTEM ACTIVITY
========================================== */

const activityList =
    document.getElementById("activityList");

const dashboardActivities =
    getRecentActivities();

function displayActivities() {

    activityList.innerHTML = "";

    dashboardActivities.forEach(function (activity) {

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
                ${activity.date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })}
            </span>
        `;

        activityList.appendChild(activityItem);

    });
}

displayActivities();