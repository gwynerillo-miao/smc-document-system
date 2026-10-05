const signupForm = document.getElementById("signupForm");

const suStudent = document.getElementById("suStudent");
const suFirstName = document.getElementById("suFirstName");
const suMiddleName = document.getElementById("suMiddleName");
const suLastName = document.getElementById("suLastName");
const suAddress = document.getElementById("suAddress");
const suEmail = document.getElementById("suEmail");
const suPhone = document.getElementById("suPhone");
const suPass = document.getElementById("suPass");
const suConfirmPass = document.getElementById("suConfirmPass");
const suCourse = document.getElementById("suCourse");

const passwordToggle = document.getElementById("passwordToggle");
const confirmPasswordToggle = document.getElementById("confirmPasswordToggle");

const otpModal = document.getElementById("otpModal");
const otpInput = document.getElementById("otpInput");
const otpMessage = document.getElementById("otpMessage");
const otpNewMessage = document.getElementById("otpNewMessage");

const verifyOtpButton = document.getElementById("verifyOtpButton");
const resendOtpButton = document.getElementById("resendOtpButton");
const cancelOtpButton = document.getElementById("cancelOtpButton");

const signupSuccessModal = document.getElementById("signupSuccessModal");
const continueButton = signupSuccessModal.querySelector(".verify-btn");

const demoOtp = "123456";

/* ==========================================
   STUDENT NUMBER
========================================== */

suStudent.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
});

/* ==========================================
   NAME AND ADDRESS
========================================== */

function capitalizeWords(input) {
    input.value = input.value.replace(/\b\w/g, function (letter) {
        return letter.toUpperCase();
    });
}

suFirstName.addEventListener("input", function () {
    capitalizeWords(this);
});

suMiddleName.addEventListener("input", function () {
    capitalizeWords(this);
});

suLastName.addEventListener("input", function () {
    capitalizeWords(this);
});

suAddress.addEventListener("input", function () {
    capitalizeWords(this);
});

/* ==========================================
   PHONE NUMBER
========================================== */

suPhone.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
});

/* ==========================================
   SHOW / HIDE PASSWORD
========================================== */

passwordToggle.addEventListener("click", function () {

    if (suPass.type === "password") {
        suPass.type = "text";
        passwordToggle.title = "Hide Password";
    } else {
        suPass.type = "password";
        passwordToggle.title = "Show Password";
    }

});

confirmPasswordToggle.addEventListener("click", function () {

    if (suConfirmPass.type === "password") {
        suConfirmPass.type = "text";
        confirmPasswordToggle.title = "Hide Password";
    } else {
        suConfirmPass.type = "password";
        confirmPasswordToggle.title = "Show Password";
    }

});

/* ==========================================
   OTP INPUT
========================================== */

otpInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "");
});

/* ==========================================
   SIGN UP FORM
========================================== */

signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (suPass.value !== suConfirmPass.value) {
        alert("Passwords do not match.");
        suConfirmPass.focus();
        return;
    }

    otpInput.value = "";
    otpMessage.style.display = "block";
    otpNewMessage.style.display = "none";

    otpModal.style.display = "flex";
    document.body.style.overflow = "hidden";

    otpInput.focus();
});

/* ==========================================
   VERIFY OTP
========================================== */

verifyOtpButton.addEventListener("click", function () {
    const enteredOtp = otpInput.value.trim();

    if (enteredOtp.length !== 6) {
        alert("Please enter the 6-digit OTP.");
        otpInput.focus();
        return;
    }

    if (enteredOtp !== demoOtp) {
        alert("Incorrect OTP. Please try again.");
        otpInput.focus();
        return;
    }

    saveStudentAccount();

    otpModal.style.display = "none";
    signupSuccessModal.style.display = "flex";
});

/* ==========================================
   SAVE STUDENT ACCOUNT
========================================== */

function saveStudentAccount() {

    let students = JSON.parse(localStorage.getItem("studentData")) || [];

    const selectedAccountType = document.querySelector(
        'input[name="userType"]:checked'
    );

    const accountType = selectedAccountType
        ? selectedAccountType.value === "student"
            ? "Currently Student"
            : "Alumni"
        : "";

    const middleName = suMiddleName.value.trim();

    const fullName = [
        suFirstName.value.trim(),
        middleName,
        suLastName.value.trim()
    ].filter(Boolean).join(" ");

    const newStudent = {
        studentNumber: suStudent.value.trim(),
        name: fullName,
        address: suAddress.value.trim(),
        email: suEmail.value.trim(),
        phone: suPhone.value.trim(),
        password: suPass.value,
        accountType: accountType,
        program: suCourse.options[suCourse.selectedIndex].text,
        date: new Date().toISOString(),
        status: "pending"
    };

    const existingStudent = students.find(function (student) {
        return student.studentNumber === newStudent.studentNumber;
    });

    if (existingStudent) {
        const index = students.indexOf(existingStudent);
        students[index] = newStudent;
    } else {
        students.push(newStudent);
    }

    localStorage.setItem("studentData", JSON.stringify(students));
}

/* ==========================================
   RESEND OTP
========================================== */

resendOtpButton.addEventListener("click", function () {
    otpInput.value = "";

    otpMessage.style.display = "none";
    otpNewMessage.style.display = "block";

    otpInput.focus();
});

/* ==========================================
   CANCEL OTP
========================================== */

cancelOtpButton.addEventListener("click", function () {
    otpModal.style.display = "none";
    document.body.style.overflow = "";
    otpInput.value = "";
});

/* ==========================================
   CONTINUE AFTER SUCCESS
========================================== */

continueButton.addEventListener("click", function () {
    signupSuccessModal.style.display = "none";
    document.body.style.overflow = "";

    window.location.href = "index.html";
});