/* ==========================================
   LOGGED-IN STUDENT INFORMATION
========================================== */

const student = JSON.parse(
    sessionStorage.getItem("loggedInStudent")
);

if (!student) {
    window.location.href = "index.html";
}

/* DISPLAY STUDENT INFORMATION */

const currentStudent = {
    ...student
};

let currentProfileImage =
    student.profileImage ||
    "profile.png";

document.getElementById("studentName").textContent =
    currentStudent.name;

document.getElementById("studentNumber").textContent =
    "Student No.: " + currentStudent.studentNumber;

document.getElementById("studentProgram").textContent =
    currentStudent.program;

document.getElementById("studentAddress").textContent =
    currentStudent.address;

document.getElementById("studentEmail").textContent =
    currentStudent.email;

document.getElementById("studentPhone").textContent =
    currentStudent.phone;

document.getElementById("welcomeName").textContent =
    currentStudent.name;

document.getElementById("profileImage").src =
    currentProfileImage;

document.getElementById("previewImage").src =
    currentProfileImage;

/* ==========================================
   LOGOUT
========================================== */

const logoutBtn = document.querySelector(".header-btn");

logoutBtn.addEventListener("click", function () {

    sessionStorage.removeItem("loggedInStudent");

    window.location.href = "index.html";

});


/* ==========================================
   EDIT PROFILE MODAL
========================================== */

const editProfileBtn = document.querySelector(".edit-profile-btn");
const profileModal = document.getElementById("profileModal");
const closeProfileBtn = profileModal.querySelector(".close-btn");

const addressInput = document.getElementById("address");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");

const profileUpload =
    document.getElementById("profileUpload");

const previewImage =
    document.getElementById("previewImage");

const profileImage =
    document.getElementById("profileImage");

phoneInput.addEventListener("input", function () {

    this.value = this.value.replace(/\D/g, "");

});


/* ==========================================
   PROFILE PICTURE PREVIEW
========================================== */

profileUpload.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) {
        return;
    }

    if (!file.type.startsWith("image/")) {

        alert("Please select an image file.");

        profileUpload.value = "";

        return;

    }

    const reader = new FileReader();

    reader.onload = function (event) {

        currentProfileImage =
            event.target.result;

        previewImage.src =
            currentProfileImage;

    };

    reader.readAsDataURL(file);

});

/* Temporary profile information for testing */

let currentAddress = student.address || "";
let currentEmail = student.email || "";
let currentPhone = student.phone || "";

editProfileBtn.addEventListener("click", function () {

    addressInput.value = currentAddress;
    emailInput.value = currentEmail;
    phoneInput.value = currentPhone;

    previewImage.src =
        currentProfileImage;

    profileUpload.value = "";

    profileModal.style.display = "flex";

});

closeProfileBtn.addEventListener("click", function () {

    addressInput.value = currentAddress;
    emailInput.value = currentEmail;
    phoneInput.value = currentPhone;

    profileModal.style.display = "none";

});

profileModal.addEventListener("click", function (event) {

    if (event.target === profileModal) {

        addressInput.value = currentAddress;
        emailInput.value = currentEmail;
        phoneInput.value = currentPhone;

        profileModal.style.display = "none";

    }

});

/* ==========================================
   CHANGE PASSWORD MODAL
========================================== */

const changePasswordBtn =
    document.querySelector(".change-password-btn");

const passwordModal =
    document.getElementById("passwordModal");

const passwordCloseBtn =
    passwordModal.querySelector(".close-btn");

const oldPasswordInput =
    document.getElementById("oldPassword");

const currentPasswordMessage =
    document.getElementById("currentPasswordMessage");

const newPasswordInput =
    document.getElementById("newPassword");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const passwordMatchMessage =
    document.getElementById("passwordMatchMessage");

const updatePasswordBtn =
    passwordModal.querySelector(".save-btn");

const passwordUpdateMessage =
    document.getElementById("passwordUpdateMessage");


/* ==========================================
   PROFILE SAVE BUTTON
========================================== */

const saveChangesBtn =
    document.querySelector(".profile-right > .save-btn");


/* ==========================================
   GET LOGGED-IN STUDENT
========================================== */

let loggedInStudent =
    JSON.parse(
        sessionStorage.getItem("loggedInStudent")
    );


/* ==========================================
   PENDING PASSWORD
========================================== */

let pendingPassword = null;


/* ==========================================
   GET CURRENT PASSWORD
========================================== */

function getCurrentStudentPassword() {

    const students =
        JSON.parse(
            localStorage.getItem("studentData")
        ) || [];

    if (!loggedInStudent) {
        return "";
    }

    const student =
        students.find(function (item) {

            return (
                item.studentNumber ===
                loggedInStudent.studentNumber
            );

        });

    if (student) {
        return student.password;
    }

    return "";

}


/* ==========================================
   HIDE CURRENT PASSWORD ERROR
========================================== */

oldPasswordInput.addEventListener("input", function () {

    currentPasswordMessage.style.display = "none";

});


/* ==========================================
   PASSWORD MATCH CHECK
========================================== */

confirmPasswordInput.addEventListener("input", function () {

    if (
        confirmPasswordInput.value &&
        newPasswordInput.value !== confirmPasswordInput.value
    ) {

        passwordMatchMessage.style.display = "block";

    } else {

        passwordMatchMessage.style.display = "none";

    }

});


/* ==========================================
   OPEN CHANGE PASSWORD
========================================== */

changePasswordBtn.addEventListener("click", function () {

    oldPasswordInput.value = "";
    newPasswordInput.value = "";
    confirmPasswordInput.value = "";

    currentPasswordMessage.style.display = "none";
    passwordMatchMessage.style.display = "none";

    passwordModal.style.display = "flex";

});


/* ==========================================
   CLOSE CHANGE PASSWORD
========================================== */

passwordCloseBtn.addEventListener("click", function () {

    passwordModal.style.display = "none";

});


passwordModal.addEventListener("click", function (event) {

    if (event.target === passwordModal) {

        passwordModal.style.display = "none";

    }

});


/* ==========================================
   UPDATE PASSWORD
   ONLY PREPARES PASSWORD
========================================== */

updatePasswordBtn.addEventListener("click", function () {

    const oldPassword =
        oldPasswordInput.value;

    const newPassword =
        newPasswordInput.value;

    const confirmPassword =
        confirmPasswordInput.value;


    /* CHECK CURRENT PASSWORD */

    const currentPassword =
        getCurrentStudentPassword();


    if (oldPassword !== currentPassword) {

        currentPasswordMessage.style.display = "block";

        return;

    }


    /* CHECK PASSWORD LENGTH */

    if (newPassword.length < 8) {

        alert(
            "New password must be at least 8 characters."
        );

        return;

    }


    /* CHECK PASSWORD MATCH */

    if (newPassword !== confirmPassword) {

        passwordMatchMessage.style.display = "block";

        return;

    }


    /* ==========================================
       STORE TEMPORARILY ONLY
    ========================================== */

    pendingPassword = newPassword;


    /* CLEAR FIELDS */

    oldPasswordInput.value = "";
    newPasswordInput.value = "";
    confirmPasswordInput.value = "";


    /* CLOSE PASSWORD MODAL */

    passwordModal.style.display = "none";


    /* SHOW PENDING MESSAGE */

    passwordUpdateMessage.style.display = "block";

});


/* ==========================================
   SAVE CHANGES
========================================== */

saveChangesBtn.addEventListener("click", function () {

    if (!pendingPassword) {
        return;
    }


    /* GET STUDENT DATA */

    let students =
        JSON.parse(
            localStorage.getItem("studentData")
        ) || [];


    /* FIND LOGGED-IN STUDENT */

    const studentIndex =
        students.findIndex(function (item) {

            return (
                item.studentNumber ===
                loggedInStudent.studentNumber
            );

        });


    if (studentIndex === -1) {

        alert("Student account could not be found.");

        return;

    }


    /* SAVE PASSWORD */

    students[studentIndex].password =
        pendingPassword;


    localStorage.setItem(
        "studentData",
        JSON.stringify(students)
    );


    /* ==========================================
       UPDATE CURRENT SESSION
    ========================================== */

    loggedInStudent.password =
        pendingPassword;

    sessionStorage.setItem(
        "loggedInStudent",
        JSON.stringify(loggedInStudent)
    );


    /* ==========================================
       CLEAR PENDING PASSWORD
    ========================================== */

    pendingPassword = null;


    /* HIDE MESSAGE */

    passwordUpdateMessage.style.display =
        "none";


    /* SAVE OTHER PROFILE CHANGES HERE LATER */

});

/* ==========================================
   PASSWORD TOGGLE
========================================== */

const oldPasswordToggle =
    document.getElementById("oldPasswordToggle");

const newPasswordToggle =
    document.getElementById("newPasswordToggle");

const confirmPasswordToggle =
    document.getElementById("confirmPasswordToggle");


oldPasswordToggle.addEventListener("click", function () {

    oldPasswordInput.type =
        oldPasswordInput.type === "password"
            ? "text"
            : "password";

});


newPasswordToggle.addEventListener("click", function () {

    newPasswordInput.type =
        newPasswordInput.type === "password"
            ? "text"
            : "password";

});


confirmPasswordToggle.addEventListener("click", function () {

    confirmPasswordInput.type =
        confirmPasswordInput.type === "password"
            ? "text"
            : "password";

});

/* ==========================================
   PROFILE SUCCESS MODAL
========================================== */

const saveProfileBtn =
    document.querySelector(".profile-right > .save-btn");

const profileSuccessModal =
    document.getElementById("profileSuccessModal");

const profileSuccessOkBtn =
    profileSuccessModal.querySelector(".verify-btn");

saveProfileBtn.addEventListener("click", function () {

    /* Check email format */

    if (!emailInput.checkValidity()) {

        emailInput.reportValidity();

        return;

    }

    /* Check if email was changed */

    const emailChanged =
        emailInput.value.trim() !== currentEmail;

    /* If email changed, verify it first */

    if (emailChanged) {

        emailOtpModal.style.display = "flex";

        return;

    }

    /* Save profile changes */

    currentAddress = addressInput.value;
    currentPhone = phoneInput.value;

    currentProfileImage =
        currentProfileImage || "profile.png";

    let students =
        JSON.parse(
            localStorage.getItem("studentData")
        ) || [];

    const studentIndex =
        students.findIndex(function (item) {
            return (
                item.studentNumber ===
                currentStudent.studentNumber
            );
        });

    if (studentIndex !== -1) {

        students[studentIndex].address =
            currentAddress;

        students[studentIndex].phone =
            currentPhone;

        students[studentIndex].profileImage =
            currentProfileImage;

        localStorage.setItem(
            "studentData",
            JSON.stringify(students)
        );

        sessionStorage.setItem(
            "loggedInStudent",
            JSON.stringify(students[studentIndex])
        );

    }

    /* Update sidebar display */

    document.getElementById("studentAddress").textContent =
        currentAddress;

    document.getElementById("studentPhone").textContent =
        currentPhone;

    document.getElementById("profileImage").src =
        currentProfileImage;

    /* Hide password update message */

    passwordUpdateMessage.style.display = "none";

    /* Close Edit Profile modal */

    profileModal.style.display = "none";

    /* Show success modal */

    profileSuccessModal.style.display = "flex";

});

profileSuccessOkBtn.addEventListener("click", function () {

    profileSuccessModal.style.display = "none";

});

profileSuccessModal.addEventListener("click", function (event) {

    if (event.target === profileSuccessModal) {
        profileSuccessModal.style.display = "none";
    }

});

/* ==========================================
   EMAIL OTP MODAL
========================================== */

const emailOtpModal =
    document.getElementById("emailOtpModal");

const cancelOtpBtn =
    emailOtpModal.querySelector(".email-otp-cancel-btn");

const verifyOtpBtn =
    document.getElementById("verifyEmailOtpButton");

const resendOtpBtn =
    document.getElementById("resendEmailOtpButton");

cancelOtpBtn.addEventListener("click", function () {

    emailOtpModal.style.display = "none";

});

emailOtpModal.addEventListener("click", function (event) {

    if (event.target === emailOtpModal) {
        emailOtpModal.style.display = "none";
    }

});


/* ==========================================
   EMAIL VERIFICATION SUCCESS
========================================== */

verifyOtpBtn.addEventListener("click", function () {

    /* Get latest profile information */

    currentAddress =
        addressInput.value.trim();

    currentEmail =
        emailInput.value.trim();

    currentPhone =
        phoneInput.value.trim();

    currentProfileImage =
        currentProfileImage || "profile.png";


    /* GET STUDENT DATA */

    let students =
        JSON.parse(
            localStorage.getItem("studentData")
        ) || [];


    /* FIND LOGGED-IN STUDENT */

    const studentIndex =
        students.findIndex(function (item) {

            return (
                item.studentNumber ===
                currentStudent.studentNumber
            );

        });


    if (studentIndex !== -1) {

        /* SAVE ALL PROFILE CHANGES */

        students[studentIndex].address =
            currentAddress;

        students[studentIndex].email =
            currentEmail;

        students[studentIndex].phone =
            currentPhone;

        students[studentIndex].profileImage =
            currentProfileImage;


        localStorage.setItem(
            "studentData",
            JSON.stringify(students)
        );


        /* UPDATE CURRENT SESSION */

        sessionStorage.setItem(
            "loggedInStudent",
            JSON.stringify(students[studentIndex])
        );

    }


    /* UPDATE DISPLAY */

    document.getElementById("studentAddress").textContent =
        currentAddress;

    document.getElementById("studentEmail").textContent =
        currentEmail;

    document.getElementById("studentPhone").textContent =
        currentPhone;

    document.getElementById("profileImage").src =
        currentProfileImage;


    /* CLOSE OTP MODAL */

    emailOtpModal.style.display = "none";


    /* CLOSE EDIT PROFILE MODAL */

    profileModal.style.display = "none";


    /* SHOW PROFILE UPDATED SUCCESS */

    profileSuccessModal.style.display = "flex";

});

/* ==========================================
   RESEND OTP
========================================== */

resendOtpBtn.addEventListener("click", function () {

    document.getElementById("emailOtpInput").value = "";

    document.getElementById("emailOtpMessage").style.display = "none";

    document.getElementById("emailNewOtpMessage").style.display =
        "block";

});

/* ==========================================
   DISPLAY AVAILABLE DOCUMENTS
========================================== */

const documentTypeSelect =
    document.getElementById("documentType");

function displayAvailableDocuments() {

    const savedDocuments =
        localStorage.getItem("documents");

    if (!savedDocuments) {
        return;
    }

    const documents =
        JSON.parse(savedDocuments);

    documentTypeSelect.innerHTML = `
        <option value="">Select Document</option>
    `;

    documents.forEach(function (item) {

        const option =
            document.createElement("option");

        option.value = item[0];
        option.textContent = item[0];

        documentTypeSelect.appendChild(option);

    });

}

displayAvailableDocuments();

/* ==========================================
   REQUEST DOCUMENT MODAL
========================================== */

const requestDocumentBtn =
    document.getElementById("requestDocument");

const requestModal =
    document.getElementById("requestModal");

const requestCloseBtn =
    requestModal.querySelector(".close-btn");

const requestCancelBtn =
    requestModal.querySelector(".request-cancel-btn");

const requestForm =
    document.getElementById("requestForm");


requestDocumentBtn.addEventListener("click", function () {

    requestForm.reset();

    requestModal.style.display = "flex";

    requestModal.querySelector(
        ".request-modal-content"
    ).scrollTop = 0;

});

/* ==========================================
   CLOSE REQUEST DOCUMENT
========================================== */

requestCloseBtn.addEventListener("click", function () {

    requestModal.style.display = "none";

});


requestCancelBtn.addEventListener("click", function () {

    requestModal.style.display = "none";

});


requestModal.addEventListener("click", function (event) {

    if (event.target === requestModal) {

        requestModal.style.display = "none";

    }

});

/* ==========================================
   REQUEST DOCUMENT OTP
========================================== */

const requestOtpModal =
    document.getElementById("requestOtpModal");

const requestOtpCancelBtn =
    requestOtpModal.querySelector(".request-otp-cancel-btn");

const verifyRequestOtpBtn =
    document.getElementById("verifyRequestOtpButton");

const resendRequestOtpBtn =
    document.getElementById("resendRequestOtpButton");

const requestOtpInput =
    document.getElementById("requestOtpInput");

const requestOtpMessage =
    document.getElementById("requestOtpMessage");

const requestNewOtpMessage =
    document.getElementById("requestNewOtpMessage");


/* ==========================================
   REQUEST SUCCESS MODAL
========================================== */

const requestSuccessModal =
    document.getElementById("requestSuccessModal");

const requestSuccessOkBtn =
    document.getElementById("requestSuccessOkBtn");

const successReferenceNumber =
    document.getElementById("successReferenceNumber");


/* ==========================================
   SUBMIT REQUEST
========================================== */

requestForm.addEventListener("submit", function (event) {

    event.preventDefault();

    /* Close request form */

    requestModal.style.display = "none";

    /* Reset OTP modal */

    requestOtpInput.value = "";

    requestOtpMessage.style.display = "block";
    requestNewOtpMessage.style.display = "none";

    /* Show OTP modal */

    requestOtpModal.style.display = "flex";

    requestOtpInput.focus();

});


/* ==========================================
   CANCEL OTP
========================================== */

requestOtpCancelBtn.addEventListener("click", function () {

    requestOtpModal.style.display = "none";

});


/* ==========================================
   VERIFY REQUEST OTP
========================================== */

verifyRequestOtpBtn.addEventListener("click", function () {

    const otp = requestOtpInput.value.trim();

    /* TEMPORARY DEMO OTP */

    if (otp !== "123456") {

        alert("Incorrect verification code.");
        requestOtpInput.focus();

        return;

    }

    /* Generate unique reference number */

    const demoRequests =
        JSON.parse(
            localStorage.getItem("demoRequests")
        ) || [];

    const historyRequests =
        JSON.parse(
            localStorage.getItem("staffDocumentHistory")
        ) || [];

    const allRequests = [
        ...demoRequests,
        ...historyRequests
    ];

    let referenceNumberCounter = 0;

    allRequests.forEach(function (request) {

        const referenceNumber =
            String(
                request.referenceNumber || ""
            );

        const parts =
            referenceNumber.split("-");

        const number =
            Number(parts[parts.length - 1]);

        if (
            Number.isFinite(number) &&
            number > referenceNumberCounter
        ) {

            referenceNumberCounter =
                number;

        }

    });

    let referenceNumber;

    do {

        referenceNumberCounter++;

        referenceNumber =
            "SMC-" +
            new Date().getFullYear() +
            "-" +
            String(
                referenceNumberCounter
            ).padStart(6, "0");

    } while (
        allRequests.some(function (request) {

            return (
                request.referenceNumber ===
                referenceNumber
            );

        })
    );


    /* Get request information */

    const documentType =
        document.getElementById("documentType").value;

    const purpose =
        document.getElementById("purpose").value;

    const copies =
        document.getElementById("copies").value;

    const paymentMethod =
        document.querySelector(
            'input[name="payment"]:checked'
        ).parentElement.textContent.trim();


    /* Save request for temporary tracking */

    const studentRequest = {

        name: currentStudent.name,

        studentNumber: currentStudent.studentNumber,

        referenceNumber: referenceNumber,

        documentType: documentType,

        purpose: purpose,

        copies: copies,

        deliveryMethod: "Pick Up at Registrar's Office",

        paymentMethod: paymentMethod,

        status: "Pending Review",

        dateRequested: new Date().toISOString().split("T")[0],

        dateFinalized: null,

        paymentReferenceNumber: null,

        pickupDate: null

    };

    localStorage.setItem(
        "studentRequest",
        JSON.stringify(studentRequest)
    );

    demoRequests.push(studentRequest);

    localStorage.setItem(
        "demoRequests",
        JSON.stringify(demoRequests)
    );

    /* ==========================================
    STAFF RECENT ACTIVITY
    ========================================== */

    const staffActivities =
        JSON.parse(
            localStorage.getItem("staffRecentActivities")
        ) || [];

    staffActivities.unshift({

        icon: "📄",

        title: "New document request",

        description:
            studentRequest.name +
            " — " +
            studentRequest.documentType +
            " request was submitted.",

        date:
            studentRequest.dateRequested

    });

    localStorage.setItem(
        "staffRecentActivities",
        JSON.stringify(
            staffActivities.slice(0, 7)
        )
    );

    successReferenceNumber.textContent =
        referenceNumber;

    /* Close OTP modal */

    requestOtpModal.style.display = "none";

    /* Show success modal */

    requestSuccessModal.style.display = "flex";

});


/* ==========================================
   RESEND REQUEST OTP
========================================== */

resendRequestOtpBtn.addEventListener("click", function () {

    requestOtpInput.value = "";

    requestOtpMessage.style.display = "none";
    requestNewOtpMessage.style.display = "block";

    requestOtpInput.focus();

});


/* ==========================================
   CLOSE REQUEST SUCCESS
========================================== */

requestSuccessOkBtn.addEventListener("click", function () {

    requestSuccessModal.style.display = "none";

});


/* ==========================================
   CLOSE OTP WHEN CLICKING OUTSIDE
========================================== */

requestOtpModal.addEventListener("click", function (event) {

    if (event.target === requestOtpModal) {

        requestOtpModal.style.display = "none";

    }

});


/* ==========================================
   CLOSE SUCCESS WHEN CLICKING OUTSIDE
========================================== */

requestSuccessModal.addEventListener("click", function (event) {

    if (event.target === requestSuccessModal) {

        requestSuccessModal.style.display = "none";

    }

});

/* ==========================================
   STATUS TRACKING
========================================== */

const statusTrackingBtn =
    document.getElementById("statusTracking");

const trackingModal =
    document.getElementById("trackingModal");

const trackingCloseBtn =
    trackingModal.querySelector(".close-btn");

const referenceNumberInput =
    document.getElementById("referenceNumber");

const trackBtn =
    trackingModal.querySelector(".track-btn");

const trackingResult =
    document.getElementById("trackingResult");

const requestDetails =
    document.getElementById("requestDetails");


/* ==========================================
   OPEN TRACKING MODAL
========================================== */

statusTrackingBtn.addEventListener("click", function () {

    referenceNumberInput.value = "";

    trackingResult.style.display = "none";

    requestDetails.innerHTML = "";

    trackingModal.style.display = "flex";

    referenceNumberInput.focus();

});


/* ==========================================
   CLOSE TRACKING MODAL
========================================== */

trackingCloseBtn.addEventListener("click", function () {

    trackingModal.style.display = "none";

});


trackingModal.addEventListener("click", function (event) {

    if (event.target === trackingModal) {

        trackingModal.style.display = "none";

    }

});


/* ==========================================
   TRACK REQUEST
========================================== */

trackBtn.addEventListener("click", function () {

    const referenceNumber =
        referenceNumberInput.value.trim();

    if (!referenceNumber) {

        alert("Please enter your reference number.");

        referenceNumberInput.focus();

        return;

    }

    const demoRequests =
        JSON.parse(
            localStorage.getItem("demoRequests")
        ) || [];

    const historyRequests =
        JSON.parse(
            localStorage.getItem("staffDocumentHistory")
        ) || [];

    /* Search active requests first */

    let request =
        demoRequests.find(function (item) {

            return (
                item.referenceNumber === referenceNumber &&
                item.name === currentStudent.name
            );

        });

    /* Search completed/rejected requests in history */

    if (!request) {

        request =
            historyRequests.find(function (item) {

                return (
                    item.referenceNumber === referenceNumber &&
                    item.name === currentStudent.name
                );

            });

    }


    /* ==========================================
       REQUEST NOT FOUND
    ========================================== */

    if (!request) {

        trackingResult.style.display = "block";

        requestDetails.innerHTML = `

            <p class="empty-message">
                No document request was found with this reference number.
            </p>

        `;

        return;

    }


    /* ==========================================
       NORMALIZE HISTORY STATUS
    ========================================== */

    if (request.status) {

        const status =
            request.status.toLowerCase();

        if (status === "completed") {
            request.status = "Completed";
        }

        else if (status === "rejected") {
            request.status = "Rejected";
        }

    }


    /* ==========================================
       REQUEST FOUND
    ========================================== */

    trackingResult.style.display = "block";


    /* ==========================================
       DATE REQUESTED
    ========================================== */

    let requestedDate = "Not available";

    if (request.dateRequested) {

        requestedDate =
            new Date(
                request.dateRequested + "T00:00:00"
            ).toLocaleDateString(
                "en-US",
                {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                }
            );

    }


    /* ==========================================
       PAYMENT SECTION
    ========================================== */

    let paymentSection = "";

    if (request.paymentReferenceNumber) {

        paymentSection = `

            <div class="payment-section">

                <p>
                    <strong>Payment Method:</strong>
                    ${request.paymentMethod}
                </p>

                <p>
                    <strong>Payment Reference Number:</strong>
                    ${request.paymentReferenceNumber}
                </p>

            </div>

        `;

    }

    else if (request.status === "Payment Required") {

        paymentSection = `

            <div class="payment-section">

                <p>
                    <strong>Payment Method:</strong>
                    ${request.paymentMethod}
                </p>

                <label>
                    Payment Reference Number
                </label>

                <input
                    type="text"
                    id="paymentReferenceInput"
                    class="payment-reference-input"
                    placeholder="Enter payment reference number">

                <button
                    type="button"
                    class="submit-payment-btn"
                    id="submitPaymentBtn">

                    Submit Payment Reference

                </button>

            </div>

        `;

    }


    /* ==========================================
       PICKUP SECTION
    ========================================== */

    let pickupSection = "";

    if (
        request.status === "Ready for Pickup" &&
        !request.pickupDate
    ) {

        pickupSection = `

            <div class="pickup-section">

                <label>
                    Select Pickup Date
                </label>

                <input
                    type="date"
                    id="pickupDateInput"
                    class="pickup-date-input"
                    min="${new Date().toISOString().split("T")[0]}">

                <button
                    type="button"
                    class="confirm-pickup-btn"
                    id="confirmPickupBtn">

                    Confirm Pickup Date

                </button>

            </div>

        `;

    }

    if (
        request.status === "Ready for Pickup" &&
        request.pickupDate
    ) {

        const pickupDate =
            new Date(
                request.pickupDate + "T00:00:00"
            );

        const formattedDate =
            pickupDate.toLocaleDateString(
                "en-US",
                {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                }
            );

        pickupSection = `

            <div class="pickup-confirmed">

                <strong>Pickup Date:</strong>
                ${formattedDate}

            </div>

        `;

    }


    /* ==========================================
       PICKED UP DATE
    ========================================== */

    let pickedUpSection = "";

    if (
        request.status === "Completed" &&
        request.pickupDate
    ) {

        const pickedUpDate =
            new Date(
                request.pickupDate + "T00:00:00"
            );

        const formattedPickedUpDate =
            pickedUpDate.toLocaleDateString(
                "en-US",
                {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                }
            );

        pickedUpSection = `

            <div class="picked-up-date">

                <strong>Picked Up Date:</strong>
                ${formattedPickedUpDate}

            </div>

        `;

    }


    /* ==========================================
       STATUS STEPS
    ========================================== */

    let statusSteps = "";


    if (request.status === "Pending Review") {

        statusSteps = `

            <div class="status-step current pending">
                <span class="status-icon"></span>
                <div class="status-text">Pending Review</div>
            </div>

            <div class="status-step">
                <span class="status-icon"></span>
                <div class="status-text">Payment Required</div>
            </div>

            <div class="status-step">
                <span class="status-icon"></span>
                <div class="status-text">Processing</div>
            </div>

            <div class="status-step">
                <span class="status-icon"></span>
                <div class="status-text">Ready for Pickup</div>
            </div>

        `;

    }

    else if (request.status === "Payment Required") {

        statusSteps = `

            <div class="status-step pending">
                <span class="status-icon"></span>
                <div class="status-text">Pending Review</div>
            </div>

            <div class="status-step current payment-required">
                <span class="status-icon"></span>
                <div class="status-text">Payment Required</div>
            </div>

            <div class="status-step">
                <span class="status-icon"></span>
                <div class="status-text">Processing</div>
            </div>

            <div class="status-step">
                <span class="status-icon"></span>
                <div class="status-text">Ready for Pickup</div>
            </div>

        `;

    }

    else if (request.status === "Processing") {

        statusSteps = `

            <div class="status-step pending">
                <span class="status-icon"></span>
                <div class="status-text">Pending Review</div>
            </div>

            <div class="status-step payment-required">
                <span class="status-icon"></span>
                <div class="status-text">Payment Required</div>
            </div>

            <div class="status-step current processing">
                <span class="status-icon"></span>
                <div class="status-text">Processing</div>
            </div>

            <div class="status-step">
                <span class="status-icon"></span>
                <div class="status-text">Ready for Pickup</div>
            </div>

        `;

    }

    else if (request.status === "Ready for Pickup") {

        statusSteps = `

            <div class="status-step pending">
                <span class="status-icon"></span>
                <div class="status-text">Pending Review</div>
            </div>

            <div class="status-step payment-required">
                <span class="status-icon"></span>
                <div class="status-text">Payment Required</div>
            </div>

            <div class="status-step processing">
                <span class="status-icon"></span>
                <div class="status-text">Processing</div>
            </div>

            <div class="status-step current ready">
                <span class="status-icon"></span>
                <div class="status-text">Ready for Pickup</div>
            </div>

        `;

    }

    else if (request.status === "Completed") {

        statusSteps = `

            <div class="status-step pending">
                <span class="status-icon"></span>
                <div class="status-text">Pending Review</div>
            </div>

            <div class="status-step payment-required">
                <span class="status-icon"></span>
                <div class="status-text">Payment Required</div>
            </div>

            <div class="status-step processing">
                <span class="status-icon"></span>
                <div class="status-text">Processing</div>
            </div>

            <div class="status-step ready">
                <span class="status-icon"></span>
                <div class="status-text">Ready for Pickup</div>
            </div>

            <div class="status-step current completed">
                <span class="status-icon"></span>
                <div class="status-text">Completed</div>
            </div>

        `;

    }

    else if (request.status === "Rejected") {

        statusSteps = `

            <div class="status-step pending">
                <span class="status-icon"></span>
                <div class="status-text">Pending Review</div>
            </div>

            <div class="status-step current rejected">
                <span class="status-icon"></span>
                <div class="status-text">Rejected</div>
            </div>

        `;

    }


    /* ==========================================
       DISPLAY REQUEST
    ========================================== */

    requestDetails.innerHTML = `

        <p>
            <strong>Reference Number:</strong>
            ${request.referenceNumber}
        </p>

        <p>
            <strong>Document:</strong>
            ${request.documentType}
        </p>

        <p>
            <strong>Date Requested:</strong>
            ${requestedDate}
        </p>

        <p>
            <strong>Purpose:</strong>
            ${request.purpose}
        </p>

        <p>
            <strong>Number of Copies:</strong>
            ${request.copies}
        </p>

        <div class="tracking-status">

            <p class="tracking-status-title">
                Request Status
            </p>

            ${statusSteps}

        </div>

        ${paymentSection}

        ${pickupSection}

        ${pickedUpSection}

    `;


    /* ==========================================
       SUBMIT PAYMENT REFERENCE
    ========================================== */

    const submitPaymentBtn =
        document.getElementById("submitPaymentBtn");

    if (submitPaymentBtn) {

        submitPaymentBtn.addEventListener(
            "click",
            function () {

                const paymentReferenceInput =
                    document.getElementById(
                        "paymentReferenceInput"
                    );

                const paymentReference =
                    paymentReferenceInput.value.trim();

                if (!paymentReference) {

                    alert(
                        "Please enter your payment reference number."
                    );

                    paymentReferenceInput.focus();

                    return;

                }

                const requests =
                    JSON.parse(
                        localStorage.getItem(
                            "demoRequests"
                        )
                    ) || [];

                const selectedRequest =
                    requests.find(function (item) {

                        return item.referenceNumber ===
                            referenceNumber;

                    });

                if (selectedRequest) {

                    selectedRequest.paymentReferenceNumber =
                        paymentReference;

                    localStorage.setItem(
                        "demoRequests",
                        JSON.stringify(requests)
                    );

                    trackBtn.click();

                }

            }
        );

    }


    /* ==========================================
       CONFIRM PICKUP DATE
    ========================================== */

    const confirmPickupBtn =
        document.getElementById("confirmPickupBtn");

    if (confirmPickupBtn) {

        confirmPickupBtn.addEventListener(
            "click",
            function () {

                const pickupDateInput =
                    document.getElementById(
                        "pickupDateInput"
                    );

                if (!pickupDateInput.value) {

                    alert(
                        "Please select a pickup date."
                    );

                    return;

                }

                const requests =
                    JSON.parse(
                        localStorage.getItem(
                            "demoRequests"
                        )
                    ) || [];

                const selectedRequest =
                    requests.find(function (item) {

                        return item.referenceNumber ===
                            referenceNumber;

                    });

                if (selectedRequest) {

                    selectedRequest.pickupDate =
                        pickupDateInput.value;

                    localStorage.setItem(
                        "demoRequests",
                        JSON.stringify(requests)
                    );

                    trackBtn.click();

                }

            }
        );

    }

});

/* ==========================================
   STATUS TRACKING ENTER
========================================== */

referenceNumberInput.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        event.preventDefault();

        trackBtn.click();

    }

});

/* ==========================================
   REQUEST HISTORY
========================================== */

const historyList =
    document.getElementById("historyList");

const historyViewAll =
    document.querySelector(".history-subtitle");

const historyModal =
    document.getElementById("historyModal");

const historyCloseBtn =
    document.querySelector(".history-close-btn");

const allHistoryList =
    document.getElementById("allHistoryList");

const historyDetailsModal =
    document.getElementById("historyDetailsModal");

const historyDetailsCloseBtn =
    document.querySelector(
        ".history-details-close-btn"
    );

const historyDetails =
    document.getElementById("historyDetails");


/* ==========================================
   GET HISTORY REQUESTS
========================================== */

function getHistoryRequests() {

    const activeRequests =
        JSON.parse(
            localStorage.getItem("demoRequests")
        ) || [];

    const savedHistory =
        JSON.parse(
            localStorage.getItem("staffDocumentHistory")
        ) || [];

    // Get completed and rejected requests from both sources
    const allRequests = [
        ...savedHistory,
        ...activeRequests.filter(function (request) {
            const status = (request.status || "").toLowerCase();

            return (
                status === "completed" ||
                status === "rejected"
            );
        })
    ];

    // Remove duplicate requests using reference number
    const uniqueRequests = [];

    allRequests.forEach(function (request) {

        const existingIndex =
            uniqueRequests.findIndex(function (item) {
                return (
                    item.referenceNumber ===
                    request.referenceNumber
                );
            });

        if (existingIndex === -1) {
            uniqueRequests.push(request);
        }

    });

    // Keep only the current student's completed/rejected requests
    return uniqueRequests
        .filter(function (request) {

            const status = (request.status || "").toLowerCase();

            return (
                request.name === currentStudent.name &&
                (
                    status === "completed" ||
                    status === "rejected"
                )
            );

        })
        .sort(function (a, b) {

            const dateA =
                a.dateCompleted ||
                a.dateFinalized ||
                a.dateRequested ||
                "";

            const dateB =
                b.dateCompleted ||
                b.dateFinalized ||
                b.dateRequested ||
                "";

            return dateB.localeCompare(dateA);

        });

}

/* ==========================================
   DISPLAY RECENT HISTORY
========================================== */

function displayRequestHistory() {

    const historyRequests =
        getHistoryRequests();


    if (historyRequests.length === 0) {

        historyList.innerHTML = `
            <p class="latest-history">
                No request history yet.
            </p>
        `;

        return;

    }


    const recentRequests =
        historyRequests.slice(0, 3);


    historyList.innerHTML =
        recentRequests.map(
            function (request) {

                return `

                    <div
                        class="history-item"
                        data-reference="${request.referenceNumber}"
                    >

                        <div class="history-item-info">

                            <strong>
                                ${request.referenceNumber}
                            </strong>

                            <span>
                                ${request.documentType}
                            </span>

                            <span>
                                ${new Date(
                                    request.dateFinalized + "T00:00:00"
                                ).toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "long",
                                        day: "numeric",
                                        year: "numeric"
                                    }
                                )}
                            </span>

                        </div>

                        <span class="history-status ${request.status
                            .toLowerCase()
                            .replaceAll(" ", "-")}">
                            ${request.status.charAt(0).toUpperCase() +
                                request.status.slice(1)}
                        </span>

                    </div>

                `;

            }
        ).join("");


    addHistoryItemEvents();

}


/* ==========================================
   OPEN REQUEST DETAILS
========================================== */

function addHistoryItemEvents() {

    const historyItems =
        document.querySelectorAll(
            ".history-item"
        );

    historyItems.forEach(function (item) {

        item.addEventListener(
            "click",
            function () {

                const referenceNumber =
                    item.dataset.reference;

                openHistoryDetails(
                    referenceNumber
                );

            }
        );

    });

}


/* ==========================================
   VIEW ALL HISTORY
========================================== */

historyViewAll.addEventListener(
    "click",
    function () {

        const historyRequests =
            getHistoryRequests();


        if (historyRequests.length === 0) {

            allHistoryList.innerHTML = `
                <p class="latest-history">
                    No request history yet.
                </p>
            `;

        }

        else {

            allHistoryList.innerHTML =
                historyRequests.map(
                    function (request) {

                        return `

                            <div
                                class="all-history-item"
                                data-reference="${request.referenceNumber}"
                            >

                            <div class="all-history-info">

                                <strong>
                                    ${request.referenceNumber}
                                </strong>

                                <span>
                                    ${request.documentType}
                                </span>

                                <span>
                                    ${new Date(
                                        request.dateFinalized + "T00:00:00"
                                    ).toLocaleDateString(
                                        "en-US",
                                        {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric"
                                        }
                                    )}
                                </span>

                            </div>

                                <span class="all-history-status ${request.status
                                    .toLowerCase()
                                    .replaceAll(" ", "-")}">
                                    ${request.status.charAt(0).toUpperCase() +
                                        request.status.slice(1)}
                                </span>

                            </div>

                        `;

                    }
                ).join("");

        }


        historyModal.style.display = "flex";

        const historyModalContent =
            historyModal.querySelector(
                ".history-modal-content"
            );

        setTimeout(function () {

            historyModalContent.scrollTop = 0;

        }, 0);

        addAllHistoryEvents();

    }
);


/* ==========================================
   ALL HISTORY ITEM EVENTS
========================================== */

function addAllHistoryEvents() {

    const historyItems =
        document.querySelectorAll(
            ".all-history-item"
        );

    historyItems.forEach(function (item) {

        item.addEventListener(
            "click",
            function () {

                const referenceNumber =
                    item.dataset.reference;

                openHistoryDetails(
                    referenceNumber
                );

            }
        );

    });

}


/* ==========================================
   OPEN HISTORY DETAILS
========================================== */

function openHistoryDetails(referenceNumber) {

    const historyRequests =
        getHistoryRequests();

    const request =
        historyRequests.find(function (item) {

            return item.referenceNumber ===
                referenceNumber;

        });


    if (!request) {
        return;
    }


    const requestedDate =
        new Date(
            request.dateRequested + "T00:00:00"
        ).toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

    const dateFinalized =
        new Date(
            request.dateFinalized + "T00:00:00"
        ).toLocaleDateString(
            "en-US",
            {
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

    let pickupDate = "Not available";


    if (request.pickupDate) {

        const date =
            new Date(
                request.pickupDate + "T00:00:00"
            );

        pickupDate =
            date.toLocaleDateString(
                "en-US",
                {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                }
            );

    }


    historyDetails.innerHTML = `

        <div class="history-detail-item">

            <span class="history-detail-label">
                Reference Number
            </span>

            <span class="history-detail-value">
                ${request.referenceNumber}
            </span>

        </div>


        <div class="history-detail-item">

            <span class="history-detail-label">
                Document
            </span>

            <span class="history-detail-value">
                ${request.documentType}
            </span>

        </div>

        <div class="history-detail-item">

            <span class="history-detail-label">
                Date Requested
            </span>

            <span class="history-detail-value">
                ${requestedDate}
            </span>

        </div>

        <div class="history-detail-item">

            <span class="history-detail-label">
                Purpose
            </span>

            <span class="history-detail-value">
                ${request.purpose}
            </span>

        </div>


        <div class="history-detail-item">

            <span class="history-detail-label">
                Number of Copies
            </span>

            <span class="history-detail-value">
                ${request.copies}
            </span>

        </div>


        <div class="history-detail-item">

            <span class="history-detail-label">
                Payment Method
            </span>

            <span class="history-detail-value">
                ${request.paymentMethod}
            </span>

        </div>


        <div class="history-detail-item">

            <span class="history-detail-label">
                Status
            </span>

            <span class="history-detail-value history-detail-status ${request.status
                .toLowerCase()}">
                ${request.status.charAt(0).toUpperCase() +
                    request.status.slice(1)}
            </span>

        </div>

        <div class="history-detail-item">

            <span class="history-detail-label">
                Date Finalized
            </span>

            <span class="history-detail-value">
                ${dateFinalized}
            </span>

        </div>

        <div class="history-detail-item">

            <span class="history-detail-label">
                Pickup Date
            </span>

            <span class="history-detail-value">
                ${pickupDate}
            </span>

        </div>

    `;


    historyDetailsModal.style.display = "flex";

}


/* ==========================================
   CLOSE ALL HISTORY MODAL
========================================== */

historyCloseBtn.addEventListener(
    "click",
    function () {

        historyModal.style.display = "none";

    }
);


/* ==========================================
   CLOSE DETAILS MODAL
========================================== */

historyDetailsCloseBtn.addEventListener(
    "click",
    function () {

        historyDetailsModal.style.display = "none";

    }
);


/* ==========================================
   CLOSE MODALS WHEN CLICKING OUTSIDE
========================================== */

historyModal.addEventListener(
    "click",
    function (event) {

        if (event.target === historyModal) {

            historyModal.style.display = "none";

        }

    }
);

historyDetailsModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            historyDetailsModal
        ) {

            historyDetailsModal.style.display =
                "none";

        }

    }
);


/* ==========================================
   LOAD HISTORY
========================================== */

displayRequestHistory();

/* ==========================================
   ADD STUDENT NOTIFICATION
========================================== */

function addStudentNotification(
    request,
    message
) {

    const notifications =
        JSON.parse(
            localStorage.getItem("demoNotifications")
        ) || [];

    notifications.unshift({

        id: Date.now(),

        studentName:
            request.name,

        referenceNumber:
            request.referenceNumber,

        message:
            message,

        date:
            new Date().toISOString().split("T")[0],

        read: false

    });

    localStorage.setItem(
        "demoNotifications",
        JSON.stringify(
            notifications.slice(0, 20)
        )
    );

}

/* ==========================================
   NOTIFICATIONS
========================================== */

const notificationList =
    document.getElementById("notificationList");

const notificationCount =
    document.getElementById("notificationCount");

const notificationViewAll =
    document.querySelector(".notification-subtitle");

const notificationModal =
    document.getElementById("notificationModal");

const notificationCloseBtn =
    document.querySelector(".notification-close-btn");

const allNotificationList =
    document.getElementById("allNotificationList");

const notificationDetailsModal =
    document.getElementById("notificationDetailsModal");

const notificationDetailsCloseBtn =
    document.querySelector(
        ".notification-details-close-btn"
    );

const notificationDetails =
    document.getElementById("notificationDetails");


/* ==========================================
   GET NOTIFICATIONS
========================================== */

function getNotifications() {

    const localNotifications =
        JSON.parse(
            localStorage.getItem("demoNotifications")
        ) || [];

    const sessionNotifications =
        JSON.parse(
            sessionStorage.getItem("demoNotifications")
        ) || [];

    // Keep old demo notifications from sessionStorage
    // and new notifications from localStorage
    const notifications = [
        ...localNotifications,
        ...sessionNotifications
    ];

    // Remove duplicate notifications
    const uniqueNotifications = [];

    notifications.forEach(function (notification) {

        const exists =
            uniqueNotifications.some(function (item) {
                return item.id === notification.id;
            });

        if (!exists) {
            uniqueNotifications.push(notification);
        }

    });

    return uniqueNotifications.filter(function (notification) {

        if (notification.studentNumber) {
            return (
                notification.studentNumber ===
                currentStudent.studentNumber
            );
        }

        if (notification.studentName) {
            return (
                notification.studentName ===
                currentStudent.name
            );
        }

        return false;

    });

}

/* ==========================================
   FORMAT DATE
========================================== */

function formatNotificationDate(dateString) {

    const date =
        new Date(dateString + "T00:00:00");

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
   UPDATE NOTIFICATION BADGE
========================================== */

function updateNotificationBadge() {

    const notifications =
        getNotifications();

    const unreadCount =
        notifications.filter(function (notification) {

            return !notification.read;

        }).length;

    notificationCount.textContent =
        unreadCount;

}


/* ==========================================
   DISPLAY RECENT NOTIFICATIONS
========================================== */

function displayNotifications() {

    const notifications =
        getNotifications();

    if (notifications.length === 0) {

        notificationList.innerHTML = `
            <p class="latest-notification">
                No notifications.
            </p>
        `;

        updateNotificationBadge();

        return;
    }

    const recentNotifications =
        notifications.slice(0, 10);

    notificationList.innerHTML =
        recentNotifications.map(
            function (notification) {

                return `
                    <div
                        class="notification-item ${notification.read ? "" : "unread"}"
                        data-notification-id="${notification.id}"
                    >

                        <div class="notification-message">
                            ${notification.message}
                        </div>

                        <div class="notification-date">
                            ${formatNotificationDate(notification.date)}
                        </div>

                    </div>
                `;

            }
        ).join("");

    addNotificationEvents();

    updateNotificationBadge();

}

/* ==========================================
   MARK NOTIFICATION AS READ
========================================== */

function markNotificationAsRead(id) {

    const notifications =
        JSON.parse(
            localStorage.getItem("demoNotifications")
        ) || [];

    const notification =
        notifications.find(function (item) {

            return (
                item.id === id &&
                item.studentName === currentStudent.name
            );

        });

    if (!notification) {
        return;
    }

    notification.read = true;

    localStorage.setItem(
        "demoNotifications",
        JSON.stringify(notifications)
    );

    displayNotifications();

    displayAllNotifications();

}

/* ==========================================
   NOTIFICATION DETAILS
========================================== */

function openNotificationDetails(id) {

    const notifications =
        getNotifications();

    const notification =
        notifications.find(function (item) {

            return item.id === id;

        });

    if (!notification) {
        return;
    }

    notificationDetails.innerHTML = `
        <div class="notification-detail-message">
            ${notification.message}
        </div>

        <div class="notification-detail-date">
            ${formatNotificationDate(notification.date)}
        </div>
    `;

    notificationDetailsModal.style.display = "flex";

    markNotificationAsRead(id);

}


/* ==========================================
   RECENT NOTIFICATION EVENTS
========================================== */

function addNotificationEvents() {

    const notificationItems =
        document.querySelectorAll(
            ".notification-item"
        );

    notificationItems.forEach(function (item) {

        item.addEventListener(
            "click",
            function () {

                const id =
                    Number(
                        item.dataset.notificationId
                    );

                openNotificationDetails(id);

            }
        );

    });

}


/* ==========================================
   DISPLAY ALL NOTIFICATIONS
========================================== */

function displayAllNotifications() {

    const notifications =
        getNotifications();

    if (notifications.length === 0) {

        allNotificationList.innerHTML = `
            <p class="latest-notification">
                No notifications.
            </p>
        `;

        return;
    }

    allNotificationList.innerHTML =
        notifications.map(
            function (notification) {

                return `
                    <div
                        class="all-notification-item ${notification.read ? "" : "unread"}"
                        data-notification-id="${notification.id}"
                    >

                        <div class="all-notification-message">
                            ${notification.message}
                        </div>

                        <div class="all-notification-date">
                            ${formatNotificationDate(notification.date)}
                        </div>

                    </div>
                `;

            }
        ).join("");

    addAllNotificationEvents();

}


/* ==========================================
   ALL NOTIFICATION EVENTS
========================================== */

function addAllNotificationEvents() {

    const notificationItems =
        document.querySelectorAll(
            ".all-notification-item"
        );

    notificationItems.forEach(function (item) {

        item.addEventListener(
            "click",
            function () {

                const id =
                    Number(
                        item.dataset.notificationId
                    );

                openNotificationDetails(id);

            }
        );

    });

}


/* ==========================================
   VIEW ALL NOTIFICATIONS
========================================== */

notificationViewAll.addEventListener(
    "click",
    function () {

        displayAllNotifications();

        notificationModal.style.display = "flex";

        const notificationModalContent =
            notificationModal.querySelector(
                ".notification-modal-content"
            );

        setTimeout(function () {

            notificationModalContent.scrollTop = 0;

        }, 0);

    }
);


/* ==========================================
   CLOSE NOTIFICATION MODAL
========================================== */

notificationCloseBtn.addEventListener(
    "click",
    function () {

        notificationModal.style.display = "none";

    }
);


/* ==========================================
   CLOSE WHEN CLICKING OUTSIDE
========================================== */

notificationModal.addEventListener(
    "click",
    function (event) {

        if (event.target === notificationModal) {

            notificationModal.style.display = "none";

        }

    }
);


/* ==========================================
   LOAD NOTIFICATIONS
========================================== */

displayNotifications();


/* ==========================================
   CLOSE NOTIFICATION DETAILS
========================================== */

notificationDetailsCloseBtn.addEventListener(
    "click",
    function () {

        notificationDetailsModal.style.display = "none";

    }
);


notificationDetailsModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            notificationDetailsModal
        ) {

            notificationDetailsModal.style.display =
                "none";

        }

    }
);

/* ==========================================
   ANNOUNCEMENTS
========================================== */

const announcementList =
    document.getElementById("announcementList");

const announcementDetailsModal =
    document.getElementById("announcementDetailsModal");

const announcementDetailsCloseBtn =
    document.querySelector(".announcement-details-close-btn");

const announcementDetails =
    document.getElementById("announcementDetails");


/* ==========================================
   GET ANNOUNCEMENTS
========================================== */

function getAnnouncements() {

    const savedAnnouncements =
        localStorage.getItem("demoAnnouncements");

    if (!savedAnnouncements) {
        return [];
    }

    try {

        return JSON.parse(savedAnnouncements);

    } catch (error) {

        console.error(
            "Invalid announcement data:",
            error
        );

        return [];

    }

}


/* ==========================================
   FORMAT ANNOUNCEMENT DATE
========================================== */

function formatAnnouncementDate(dateString) {

    const date =
        new Date(dateString + "T00:00:00");

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
   DISPLAY ANNOUNCEMENTS
========================================== */

function displayAnnouncements() {

    const announcements =
        getAnnouncements().sort(function (a, b) {

            return (
                new Date(b.date) -
                new Date(a.date)
            ) || b.id - a.id;

        });


    if (announcements.length === 0) {

        announcementList.innerHTML = `
            <p class="latest-announcement">
                No announcement yet.
            </p>
        `;

        return;

    }


    announcementList.innerHTML =
        announcements.map(
            function (announcement) {

                return `
                    <div
                        class="announcement-item"
                        data-announcement-id="${announcement.id}"
                    >

                        <div class="announcement-title">
                            ${announcement.title}
                        </div>

                        <div class="announcement-message">
                            ${announcement.message}
                        </div>

                        <div class="announcement-date">
                            ${formatAnnouncementDate(announcement.date)}
                        </div>

                    </div>
                `;

            }
        ).join("");

}


/* ==========================================
   ANNOUNCEMENT DETAILS
========================================== */

function openAnnouncementDetails(id) {

    const announcements =
        getAnnouncements().sort(function (a, b) {

            return (
                new Date(b.date) -
                new Date(a.date)
            ) || b.id - a.id;

        });


    const announcement =
        announcements.find(function (item) {

            return item.id === id;

        });


    if (!announcement) {
        return;
    }


    announcementDetails.innerHTML = `
        <div class="announcement-detail-date">
            ${formatAnnouncementDate(announcement.date)}
        </div>

        <div class="announcement-detail-title">
            ${announcement.title}
        </div>

        <div class="announcement-detail-message">
            ${announcement.message}
        </div>
    `;


    announcementDetailsModal.style.display =
        "flex";

}


/* ==========================================
   ANNOUNCEMENT CLICK
========================================== */

announcementList.addEventListener(
    "click",
    function (event) {

        const announcementItem =
            event.target.closest(
                ".announcement-item"
            );


        if (!announcementItem) {
            return;
        }


        const id =
            Number(
                announcementItem.dataset.announcementId
            );


        openAnnouncementDetails(id);

    }
);


/* ==========================================
   LOAD ANNOUNCEMENTS
========================================== */

displayAnnouncements();


/* ==========================================
   CLOSE ANNOUNCEMENT DETAILS
========================================== */

announcementDetailsCloseBtn.addEventListener(
    "click",
    function () {

        announcementDetailsModal.style.display =
            "none";

    }
);


/* ==========================================
   CLOSE DETAILS BY CLICKING OUTSIDE
========================================== */

announcementDetailsModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            announcementDetailsModal
        ) {

            announcementDetailsModal.style.display =
                "none";

        }

    }
);