/* ==========================================
   SHOW / HIDE PASSWORD
========================================== */

const passwordToggle = document.getElementById("passwordToggle");
const loginPass = document.getElementById("loginPass");

passwordToggle.addEventListener("click", function () {

    if (loginPass.type === "password") {
        loginPass.type = "text";
        passwordToggle.title = "Hide Password";
    } else {
        loginPass.type = "password";
        passwordToggle.title = "Show Password";
    }

});


/* ==========================================
   LOGIN FORM
========================================== */

const loginForm = document.getElementById("loginForm");
const loginLrn = document.getElementById("loginLrn");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const studentNumber = loginLrn.value.trim();
    const password = loginPass.value;

    loginMessage.textContent = "";
    loginMessage.style.color = "";

    /* CHECK STUDENT NUMBER LENGTH */

    if (studentNumber.length !== 9) {

        loginMessage.textContent =
            "Student number must be 9 digits.";

        loginMessage.style.color = "#b42318";

        loginLrn.focus();

        return;

    }

    /* GET REGISTERED STUDENTS */

    const students =
        JSON.parse(localStorage.getItem("studentData")) || [];

    /* FIND STUDENT */

    const student = students.find(function (item) {

        return item.studentNumber === studentNumber;

    });

    /* CHECK IF STUDENT EXISTS */

    if (!student) {

        loginMessage.textContent =
            "Student number does not exist.";

        loginMessage.style.color = "#b42318";

        loginLrn.focus();

        return;

    }

    /* CHECK ACCOUNT STATUS */

    if (student.status === "pending") {

        loginMessage.textContent =
            "Your account is still pending administrator approval.";

        loginMessage.style.color = "#b42318";

        return;

    }

    if (student.status === "rejected") {

        loginMessage.textContent =
            "Your account has been rejected.";

        loginMessage.style.color = "#b42318";

        return;

    }

    /* CHECK PASSWORD */

    if (student.password !== password) {

        loginMessage.textContent =
            "Incorrect password.";

        loginMessage.style.color = "#b42318";

        loginPass.focus();

        return;

    }

    /* SAVE LOGGED-IN STUDENT */

    sessionStorage.setItem(
        "loggedInStudent",
        JSON.stringify(student)
    );

    /* LOGIN SUCCESS */

    window.location.href = "student-dashboard.html";

});

/* ==========================================
   DEMO STUDENT ACCOUNT
========================================== */

const demoStudent = {
    studentNumber: "123456789",
    password: "demo1234",
    name: "Juan Dela Cruz",
    program: "Bachelor of Science in Information Technology",
    address: "San Mateo, Rizal",
    email: "juan@gmail.com",
    phone: "09987654321",
    profileImage: "juan.jpg"
};

/* ==========================================
   INITIALIZE DEMO STUDENT ACCOUNT
========================================== */

let studentData =
    JSON.parse(localStorage.getItem("studentData")) || [];

const existingDemoStudent = studentData.find(function (student) {

    return student.studentNumber === demoStudent.studentNumber;

});

if (!existingDemoStudent) {

    studentData.push({
        ...demoStudent,
        status: "approved"
    });

    localStorage.setItem(
        "studentData",
        JSON.stringify(studentData)
    );

}

const demoRequests = [

    {
        referenceNumber: "SMC-2026-000001",
        documentType: "Transcript of Records",
        purpose: "Employment",
        copies: 1,
        paymentMethod: "Physical",
        status: "Pending Review",
        dateRequested: "2026-09-11",
        dateFinalized: null,
        pickupDate: null
    },

    {
        referenceNumber: "SMC-2026-000002",
        documentType: "Certificate of Enrollment",
        purpose: "Scholarship",
        copies: 1,
        paymentMethod: "Online",
        status: "Payment Required",
        dateRequested: "2026-09-18",
        dateFinalized: null,
        paymentReferenceNumber: null,
        pickupDate: null
    },

    {
        referenceNumber: "SMC-2026-000003",
        documentType: "Certificate of Enrollment",
        purpose: "Scholarship",
        copies: 2,
        paymentMethod: "Physical",
        status: "Processing",
        dateRequested: "2026-09-12",
        dateFinalized: null,
        paymentReferenceNumber: "PAY-20260003",
        pickupDate: null
    },

    {
        referenceNumber: "SMC-2026-000004",
        documentType: "Diploma",
        purpose: "Employment",
        copies: 1,
        paymentMethod: "Physical",
        status: "Ready for Pickup",
        dateRequested: "2026-09-13",
        dateFinalized: null,
        paymentReferenceNumber: "PAY-20260004",
        pickupDate: null
    },

    {
        referenceNumber: "SMC-2026-000005",
        documentType: "Good Moral Certificate",
        purpose: "Employment",
        copies: 1,
        paymentMethod: "Physical",
        status: "Ready for Pickup",
        dateRequested: "2026-09-14",
        dateFinalized: null,
        paymentReferenceNumber: "PAY-20260005",
        pickupDate: "2026-09-25"
    },

    {
        referenceNumber: "SMC-2026-000006",
        documentType: "Transcript of Records",
        purpose: "Employment",
        copies: 1,
        paymentMethod: "Physical",
        status: "Completed",
        dateRequested: "2026-09-10",
        dateFinalized: "2026-09-17",
        paymentReferenceNumber: "PAY-20260006",
        pickupDate: "2026-09-15"
    },

    {
        referenceNumber: "SMC-2026-000007",
        documentType: "Good Moral Certificate",
        purpose: "Employment",
        copies: 1,
        paymentMethod: "Physical",
        status: "Rejected",
        dateRequested: "2026-09-09",
        dateFinalized: "2026-09-14",
        paymentReferenceNumber: null,
        pickupDate: null
    },

];

/* ==========================================
   INITIALIZE DEMO REQUESTS
========================================== */

if (!localStorage.getItem("demoRequests")) {

    const initializedRequests =
        demoRequests.map(function (request) {

            return {
                ...request,
                name: demoStudent.name
            };

        });

    localStorage.setItem(
        "demoRequests",
        JSON.stringify(initializedRequests)
    );

}

const demoNotifications = [
    {
        id: 1,
        studentNumber: "123456789",
        studentName: "Juan Dela Cruz",
        message: "Your document request SMC-2026-000007 has been rejected.",
        date: "2026-09-17",
        read: true
    },
    {
        id: 2,
        studentNumber: "123456789",
        studentName: "Juan Dela Cruz",
        message: "Your document request SMC-2026-000004 is ready for pickup.",
        date: "2026-09-16",
        read: true
    },
    {
        id: 3,
        studentNumber: "123456789",
        studentName: "Juan Dela Cruz",
        message: "Your pickup date for SMC-2026-000004 has been confirmed.",
        date: "2026-09-15",
        read: true
    },
    {
        id: 4,
        studentNumber: "123456789",
        studentName: "Juan Dela Cruz",
        message: "Your document request SMC-2026-000005 has been completed.",
        date: "2026-09-15",
        read: true
    },
    {
        id: 5,
        studentNumber: "123456789",
        studentName: "Juan Dela Cruz",
        message: "Your document request SMC-2026-000006 has been completed.",
        date: "2026-09-14",
        read: true
    },
    {
        id: 6,
        studentNumber: "123456789",
        studentName: "Juan Dela Cruz",
        message: "Your document request SMC-2026-000003 is ready for pickup.",
        date: "2026-09-13",
        read: true
    },
    {
        id: 7,
        studentNumber: "123456789",
        studentName: "Juan Dela Cruz",
        message: "Your document request SMC-2026-000002 is now being processed.",
        date: "2026-09-12",
        read: true
    },
    {
        id: 8,
        studentNumber: "123456789",
        studentName: "Juan Dela Cruz",
        message: "Your document request SMC-2026-000001 is pending review.",
        date: "2026-09-11",
        read: true
    },
    {
        id: 9,
        studentNumber: "123456789",
        studentName: "Juan Dela Cruz",
        message: "Your email address has been successfully updated.",
        date: "2026-09-10",
        read: true
    },
    {
        id: 10,
        studentNumber: "123456789",
        studentName: "Juan Dela Cruz",
        message: "Your account has been successfully approved.",
        date: "2026-09-09",
        read: true
    },
    {
        id: 11,
        studentNumber: "123456789",
        studentName: "Juan Dela Cruz",
        message: "Your account registration has been completed.",
        date: "2026-09-08",
        read: true
    },
    {
        id: 12,
        studentNumber: "123456789",
        studentName: "Juan Dela Cruz",
        message: "Welcome to SMC-DocuTrack.",
        date: "2026-09-07",
        read: true
    }
];

/* ==========================================
   INITIALIZE DEMO NOTIFICATIONS
========================================== */

if (!localStorage.getItem("demoNotifications")) {

    localStorage.setItem(
        "demoNotifications",
        JSON.stringify(demoNotifications)
    );

}

/* ==========================================
   ANNOUNCEMENTS
========================================== */

const announcements =
    JSON.parse(
        localStorage.getItem("demoAnnouncements")
    ) || [];

/* ==========================================
   FORGOT PASSWORD MODAL
========================================== */

const forgotPassword = document.getElementById("forgotPassword");
const forgotPasswordModal = document.getElementById("forgotPasswordModal");
const closeForgotModal = document.getElementById("closeForgotModal");

forgotPassword.addEventListener("click", function (event) {

    event.preventDefault();

    forgotPasswordModal.style.display = "flex";

    document.body.style.overflow = "hidden";

});


/* ==========================================
   CLOSE FORGOT PASSWORD MODAL
========================================== */

closeForgotModal.addEventListener("click", function () {

    forgotPasswordModal.style.display = "none";

    document.body.style.overflow = "";

});


/* ==========================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================== */

forgotPasswordModal.addEventListener("click", function (event) {

    if (event.target === forgotPasswordModal) {

        forgotPasswordModal.style.display = "none";

        document.body.style.overflow = "";

    }

});


/* ==========================================
   FORGOT PASSWORD FORM
========================================== */

const forgotPasswordForm = document.getElementById("forgotPasswordForm");
const forgotEmail = document.getElementById("forgotEmail");
const forgotPasswordFormView =
    document.getElementById("forgotPasswordFormView");

const forgotPasswordSuccess =
    document.getElementById("forgotPasswordSuccess");

const forgotPasswordSuccessMessage =
    document.getElementById("forgotPasswordSuccessMessage");

forgotPasswordForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email = forgotEmail.value.trim();


    /* CHECK EMAIL */

    if (email === "") {

        forgotEmail.focus();
        return;

    }


    /* CHECK EMAIL FORMAT */

    if (!forgotEmail.checkValidity()) {

        forgotEmail.focus();
        return;

    }


    /* TEMPORARY SUCCESS */

    forgotPasswordFormView.style.display = "none";
    forgotPasswordSuccess.style.display = "block";

    forgotPasswordSuccessMessage.textContent =
        "If an account is associated with that email address, a password reset link has been sent.";

});


/* ==========================================
   CLOSE FORGOT PASSWORD RESULT
========================================== */

const forgotPasswordDone =
    document.getElementById("forgotPasswordDone");

forgotPasswordDone.addEventListener("click", function () {

    forgotPasswordModal.style.display = "none";

    document.body.style.overflow = "";

    resetForgotPasswordModal();

});


/* ==========================================
   RESET FORGOT PASSWORD MODAL
========================================== */

function resetForgotPasswordModal() {

    forgotPasswordForm.reset();

    forgotPasswordFormView.style.display = "block";
    forgotPasswordSuccess.style.display = "none";

}


/* ==========================================
   STUDENT NUMBER INPUT
========================================== */

loginLrn.addEventListener("input", function () {

    this.value = this.value.replace(/\D/g, "");

});

/* ==========================================
   DISPLAY DOCUMENTS
========================================== */

const documentTableBody =
    document.getElementById("documentTableBody");

function displayDocuments() {

    const savedDocuments =
        localStorage.getItem("documents");

    console.log("Documents from localStorage:", savedDocuments);

    if (!savedDocuments) {
        console.log("No documents found in localStorage.");
        return;
    }

    const documents = JSON.parse(savedDocuments);

    console.log("Parsed documents:", documents);

    documentTableBody.innerHTML = "";

    documents.forEach(function (item) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item[0]}</td>
            <td>${item[2]}</td>
            <td>${item[1]}</td>
        `;

        documentTableBody.appendChild(row);

    });

}

displayDocuments();