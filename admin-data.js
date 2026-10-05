/* ==========================================
   STUDENT DATA
========================================== */

let studentData =
    JSON.parse(localStorage.getItem("studentData")) || [];


/* ==========================================
   STUDENT ACCOUNT HISTORY
========================================== */

const defaultStudentHistory = [
    {
        studentNumber: "123456789",
        name: "Juan Dela Cruz",
        address: "San Mateo, Rizal",
        email: "juan@gmail.com",
        phone: "09987654321",
        password: "demo1234",
        accountType: "Currently Student",
        program: "Bachelor of Science in Information Technology",
        date: "2026-09-20",
        status: "approved"
    }
];

let studentHistory =
    JSON.parse(localStorage.getItem("studentHistory"));

if (!studentHistory) {
    studentHistory = defaultStudentHistory;

    localStorage.setItem(
        "studentHistory",
        JSON.stringify(studentHistory)
    );
}
    
/* ==========================================
   STAFF DATA
========================================== */

const defaultStaffData = [
    {
        staffId: "SMCREGISTRAR",
        name: "Registrar",
        role: "Registrar",
        email: "registrar@smc.edu.ph",
        phone: "—",
        password: "demo1234",
        temporaryPassword: false,
        dateCreated: "2026-09-01",
        status: "active"
    },
    {
        staffId: "SMCGUIDANCE",
        name: "Guidance",
        role: "Guidance",
        email: "guidance@smc.edu.ph",
        phone: "—",
        password: "demo1234",
        temporaryPassword: false,
        dateCreated: "2026-09-01",
        status: "active"
    }
];

let staffData =
    JSON.parse(
        localStorage.getItem("staffData")
    ) || [];

/* ==========================================
   RESTORE DEMO STAFF DATA
========================================== */

defaultStaffData.forEach(function (demoStaff) {

    const existingStaff =
        staffData.find(function (staff) {

            return staff.staffId === demoStaff.staffId;

        });


    if (!existingStaff) {

        staffData.push({
            ...demoStaff
        });

    }

});


localStorage.setItem(
    "staffData",
    JSON.stringify(staffData)
);

/* ==========================================
   DOCUMENT DATA
========================================== */

const defaultDocuments = [
    ["Transcript of Records", "₱400.00", "After 3 working days", "Registrar"],
    ["Certificate of Enrollment", "₱150.00", "After 7 working days", "Registrar"],
    ["Certificate of Graduation", "₱250.00", "After 7 working days", "Registrar"],
    ["Diploma", "₱500.00", "After 14 working days", "Registrar"],
    ["Transfer Credentials", "₱400.00", "After 7 working days", "Registrar"],
    ["Certificate of Grades", "₱150.00", "After 7 working days", "Registrar"],
    ["Good Moral Certificate", "₱150.00", "After 7 working days", "Guidance"]
];

let documents;

try {

    documents =
        JSON.parse(
            localStorage.getItem("documents")
        );

} catch (error) {

    documents = null;

}


if (
    !Array.isArray(documents) ||
    documents.length === 0 ||
    documents.some(function (document) {

        return (
            !Array.isArray(document) ||
            document.length < 4
        );

    })
) {

    documents = defaultDocuments;

}


localStorage.setItem(
    "documents",
    JSON.stringify(documents)
);

/* ==========================================
   ANNOUNCEMENT DATA
========================================== */

const defaultAnnouncements = [
    {
        id: 1,
        title: "Enrollment Schedule for 1st Semester",
        message: "Please be informed that enrollment for the first semester will begin on October 5, 2026.",
        date: "2026-09-28"
    },
    {
        id: 2,
        title: "Document Request Advisory",
        message: "Students are reminded to bring their valid school identification when claiming requested documents.",
        date: "2026-09-25"
    }
];

let announcements =
    JSON.parse(localStorage.getItem("demoAnnouncements"));

if (!announcements) {
    announcements = defaultAnnouncements;

    localStorage.setItem(
        "demoAnnouncements",
        JSON.stringify(announcements)
    );
}


/* ==========================================
   RECENT SYSTEM ACTIVITY
========================================== */

function getRecentActivities() {

    const activities = [];

    /* APPROVED STUDENT ACCOUNTS */

    studentHistory
        .filter(function (student) {
            return student.status === "approved";
        })
        .forEach(function (student) {

            activities.push({
                icon: "✓",
                title: "Student Account Approved",
                description:
                    student.name +
                    "'s student account was approved.",
                date: new Date(student.date)
            });

        });


    /* STAFF ACCOUNTS */

    staffData.forEach(function (staff) {

        activities.push({
            icon: "👤",
            title: "Staff Account Added",
            description:
                staff.name +
                " staff account was added to the system.",
            date: new Date(staff.dateCreated)
        });

    });


    /* DOCUMENT SETTINGS */

    if (documents.length > 0) {

        activities.push({
            icon: "📄",
            title: "Document Settings Updated",
            description:
                documents.length +
                " document types are currently configured.",
            date: new Date("2026-09-01")
        });

    }


    /* ANNOUNCEMENTS */

    announcements.forEach(function (announcement) {

        activities.push({
            icon: "📢",
            title: "Announcement Posted",
            description:
                announcement.title +
                " was posted.",
            date: new Date(announcement.date)
        });

    });


    /* SORT NEWEST FIRST */

    activities.sort(function (a, b) {
        return b.date - a.date;
    });


    return activities.slice(0, 7);
}

/* ==========================================
   RECENT SYSTEM ACTIVITY
========================================== */

let recentActivities =
    JSON.parse(
        localStorage.getItem("recentActivities")
    ) || [];

/* ==========================================
   ADD NEW ACTIVITY
========================================== */

function addActivity(icon, title, description) {

    let currentActivities = [];

    try {

        currentActivities =
            JSON.parse(
                localStorage.getItem("recentActivities")
            ) || [];

    } catch (error) {

        currentActivities = [];

    }


    if (!Array.isArray(currentActivities)) {

        currentActivities = [];

    }


    const activity = {
        id: Date.now(),
        icon: icon,
        title: title,
        description: description,
        date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    };


    currentActivities.unshift(activity);

    currentActivities =
        currentActivities.slice(0, 7);


    localStorage.setItem(
        "recentActivities",
        JSON.stringify(currentActivities)
    );


    recentActivities = currentActivities;

}