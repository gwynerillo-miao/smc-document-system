/* ==========================================
   ACCOUNT MANAGEMENT SECTIONS
========================================== */

const studentSection = document.getElementById("studentSection");
const staffSection = document.getElementById("staffSection");

const studentManagementBtn = document.getElementById("studentManagementBtn");
const staffManagementBtn = document.getElementById("staffManagementBtn");


/* ==========================================
   SHOW STUDENT MANAGEMENT
========================================== */

function showStudentManagement() {
    studentSection.classList.add("active");
    staffSection.classList.remove("active");

    studentManagementBtn.classList.add("active");
    staffManagementBtn.classList.remove("active");
}


/* ==========================================
   SHOW STAFF MANAGEMENT
========================================== */

function showStaffManagement() {
    studentSection.classList.remove("active");
    staffSection.classList.add("active");

    studentManagementBtn.classList.remove("active");
    staffManagementBtn.classList.add("active");
}


/* ==========================================
   STUDENT MANAGEMENT BUTTON
========================================== */

studentManagementBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    showStudentManagement();
});


/* ==========================================
   STAFF MANAGEMENT BUTTON
========================================== */

staffManagementBtn.addEventListener("click", function (event) {
    event.stopPropagation();
    showStaffManagement();
});


/* ==========================================
   STUDENT TABLE ELEMENTS
========================================== */

const studentTableBody = document.getElementById("studentTableBody");
const studentSearch = document.getElementById("studentSearch");
const studentSortFilter = document.getElementById("studentSortFilter");
const studentCount = document.getElementById("studentCount");
const pagination = document.getElementById("pagination");

const studentsPerPage = 25;
let studentCurrentPage = 1;


/* ==========================================
   STUDENT DETAILS MODAL
========================================== */

const studentDetailsModal = document.getElementById("studentDetailsModal");
const closeStudentModal = document.getElementById("closeStudentModal");

const detailStudentNumber = document.getElementById("detailStudentNumber");
const detailName = document.getElementById("detailName");
const detailAddress = document.getElementById("detailAddress");
const detailEmail = document.getElementById("detailEmail");
const detailPhone = document.getElementById("detailPhone");
const detailAccountType = document.getElementById("detailAccountType");
const detailProgram = document.getElementById("detailProgram");
const detailDateRegistered = document.getElementById("detailDateRegistered");

/* ==========================================
   CONFIRM ACTION MODAL
========================================== */

const studentConfirmModal = document.getElementById("studentConfirmModal");
const studentConfirmMessage = document.getElementById("studentConfirmMessage");
const studentCancelBtn = document.getElementById("studentCancelBtn");
const studentConfirmBtn = document.getElementById("studentConfirmBtn");

const studentApproveBtn = document.querySelector(".student-approve-btn");
const studentRejectBtn = document.querySelector(".student-reject-btn");

let selectedStudent = null;
let selectedAction = "";

/* ==========================================
   DISPLAY STUDENT ACCOUNTS
========================================== */

function displayStudentAccounts() {

   const searchValue = studentSearch.value.toLowerCase().trim();
   const selectedSort = studentSortFilter.value;

   let filteredData = studentData.filter(function (student) {

      return (
         student.status === "pending" &&
         (
               student.studentNumber.toLowerCase().includes(searchValue) ||
               student.name.toLowerCase().includes(searchValue)
         )
      );

   });


    /* SORT */

    filteredData.sort(function (a, b) {

        if (selectedSort === "oldest") {
            return new Date(a.date) - new Date(b.date);
        }

        return new Date(b.date) - new Date(a.date);

    });


    /* PAGINATION */

    const totalPages = Math.ceil(filteredData.length / studentsPerPage);

    if (studentCurrentPage > totalPages && totalPages > 0) {
        studentCurrentPage = totalPages;
    }

    const startIndex = (studentCurrentPage - 1) * studentsPerPage;
    const endIndex = startIndex + studentsPerPage;

    const pageData = filteredData.slice(startIndex, endIndex);


    /* CLEAR TABLE */

    studentTableBody.innerHTML = "";


    /* NO RESULTS */

    if (pageData.length === 0) {

        studentTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; padding:30px; color:#888;">
                    No pending student accounts found.
                </td>
            </tr>
        `;

    } else {

        /* DISPLAY STUDENTS */

        pageData.forEach(function (student) {

            const formattedDate = new Date(student.date).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric"
            });

            const row = document.createElement("tr");

            row.innerHTML = `
               <td>${student.studentNumber}</td>
               <td>${student.name}</td>
               <td>${formattedDate}</td>
               <td>
                  <span class="student-status ${student.status}">
                        ${student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </span>
               </td>
               <td>
                  <button type="button" class="student-action-btn">
                        View
                  </button>
               </td>
            `;

            /* VIEW BUTTON */

            const viewButton = row.querySelector(".student-action-btn");

            viewButton.addEventListener("click", function () {

               selectedStudent = student;
               
               detailStudentNumber.textContent = student.studentNumber;
               detailName.textContent = student.name;
               detailAddress.textContent = student.address;
               detailEmail.textContent = student.email;
               detailPhone.textContent = student.phone;
               detailAccountType.textContent = student.accountType;
               detailProgram.textContent = student.program;

               detailDateRegistered.textContent = new Date(student.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric"
               });

               studentDetailsModal.classList.add("show");
               document.body.style.overflow = "hidden";
               document.querySelector(".main-content").style.overflow = "hidden";

            });


            studentTableBody.appendChild(row);

        });
    }

    /* ACCOUNT COUNT */

    if (filteredData.length === 0) {

        studentCount.textContent = "No accounts found";

    } else {

        studentCount.textContent =
            `Showing ${startIndex + 1}-${Math.min(endIndex, filteredData.length)} of ${filteredData.length} accounts`;

    }


    /* PAGINATION */

    createStudentPagination(totalPages);
}

/* ==========================================
   APPROVE / REJECT
========================================== */

studentApproveBtn.addEventListener("click", function () {

    selectedAction = "approve";

    studentConfirmMessage.textContent =
        "Are you sure you want to approve this student account?";

    studentConfirmModal.classList.add("show");

});


studentRejectBtn.addEventListener("click", function () {

    selectedAction = "reject";

    studentConfirmMessage.textContent =
        "Are you sure you want to reject this student account?";

    studentConfirmModal.classList.add("show");

});


/* ==========================================
   CANCEL CONFIRMATION
========================================== */

studentCancelBtn.addEventListener("click", function () {

    studentConfirmModal.classList.remove("show");

});


/* ==========================================
   CONFIRM ACTION
========================================== */

studentConfirmBtn.addEventListener("click", function () {

    if (!selectedStudent) {
        return;
    }

    selectedStudent.status = selectedAction === "approve"
        ? "approved"
        : "rejected";

    studentHistory.push({
        ...selectedStudent
    });

    localStorage.setItem(
        "studentData",
        JSON.stringify(studentData)
    );

    localStorage.setItem(
        "studentHistory",
        JSON.stringify(studentHistory)
    );

    if (selectedAction === "approve") {

        addActivity(
            "✓",
            "Student account approved",
            selectedStudent.name + "'s account was approved."
        );

    } else {

        addActivity(
            "×",
            "Student account rejected",
            selectedStudent.name + "'s account was rejected."
        );

    }

    studentConfirmModal.classList.remove("show");
    studentDetailsModal.classList.remove("show");

    document.body.style.overflow = "";
    document.querySelector(".main-content").style.overflow = "";

    displayStudentAccounts();

});


/* ==========================================
   CLOSE CONFIRMATION WHEN CLICKING OUTSIDE
========================================== */

studentConfirmModal.addEventListener("click", function (event) {

    if (event.target === studentConfirmModal) {
        studentConfirmModal.classList.remove("show");
    }

});

/* ==========================================
   CREATE PAGINATION
========================================== */

function createStudentPagination(totalPages) {

    pagination.innerHTML = "";

    if (totalPages <= 1) {
        return;
    }


    /* PREVIOUS */

    const previousButton = document.createElement("button");

    previousButton.type = "button";
    previousButton.className = "page-btn";
    previousButton.textContent = "‹";
    previousButton.disabled = studentCurrentPage === 1;

    previousButton.addEventListener("click", function () {

        if (studentCurrentPage > 1) {

            studentCurrentPage--;

            displayStudentAccounts();

        }

    });

    pagination.appendChild(previousButton);


    /* PAGE NUMBERS */

    for (let page = 1; page <= totalPages; page++) {

        const pageButton = document.createElement("button");

        pageButton.type = "button";
        pageButton.className = "page-btn";
        pageButton.textContent = page;

        if (page === studentCurrentPage) {
            pageButton.classList.add("active");
        }

        pageButton.addEventListener("click", function () {

            studentCurrentPage = page;

            displayStudentAccounts();

        });

        pagination.appendChild(pageButton);

    }


    /* NEXT */

    const nextButton = document.createElement("button");

    nextButton.type = "button";
    nextButton.className = "page-btn";
    nextButton.textContent = "›";
    nextButton.disabled = studentCurrentPage === totalPages;

    nextButton.addEventListener("click", function () {

        if (studentCurrentPage < totalPages) {

            studentCurrentPage++;

            displayStudentAccounts();

        }

    });

    pagination.appendChild(nextButton);
}


/* ==========================================
   SEARCH
========================================== */

studentSearch.addEventListener("input", function () {

    studentCurrentPage = 1;

    displayStudentAccounts();

});


/* ==========================================
   SORT
========================================== */

studentSortFilter.addEventListener("change", function () {

    studentCurrentPage = 1;

    displayStudentAccounts();

});


/* ==========================================
   CLOSE STUDENT DETAILS MODAL
========================================== */

closeStudentModal.addEventListener("click", function () {

   studentDetailsModal.classList.remove("show");
   document.body.style.overflow = "";
   document.querySelector(".main-content").style.overflow = "";

});


/* ==========================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================== */

studentDetailsModal.addEventListener("click", function (event) {

    if (event.target === studentDetailsModal) {

      studentDetailsModal.classList.remove("show");
      document.body.style.overflow = "";
      document.querySelector(".main-content").style.overflow = "";

    }

});

/* ==========================================
   DEFAULT
========================================== */

showStudentManagement();


/* ==========================================
   INITIAL DISPLAY
========================================== */

displayStudentAccounts();

/* ==========================================
   STAFF TABLE ELEMENTS
========================================== */

const staffTableBody = document.getElementById("staffTableBody");
const staffSearch = document.getElementById("staffSearch");
const staffRoleFilter = document.getElementById("staffRoleFilter");
const staffStatusFilter = document.getElementById("staffStatusFilter");
const staffCount = document.getElementById("staffCount");

/* ==========================================
   STAFF SUMMARY CARDS
========================================== */

const totalStaffCount = document.getElementById("totalStaffCount");
const activeStaffCount = document.getElementById("activeStaffCount");
const pendingStaffCount = document.getElementById("pendingStaffCount");
const inactiveStaffCount = document.getElementById("inactiveStaffCount");

/* ==========================================
   ADD STAFF ACCOUNT ELEMENTS
========================================== */

const addStaffBtn = document.querySelector(".add-staff-btn");
const addStaffModal = document.getElementById("addStaffModal");
const closeAddStaffModal = document.getElementById("closeAddStaffModal");
const cancelAddStaff = document.getElementById("cancelAddStaff");

const staffIdInput = document.getElementById("staffId");
const staffRole = document.getElementById("staffRole");
const temporaryPassword = document.getElementById("temporaryPassword");
const regeneratePassword = document.getElementById("regeneratePassword");

const createStaffBtn = document.getElementById("createStaffBtn");


/* ==========================================
   STAFF CONFIRMATION MODAL
========================================== */

const staffConfirmModal = document.getElementById("staffConfirmModal");
const staffConfirmCancel = document.getElementById("staffConfirmCancel");
const staffConfirmCreate = document.getElementById("staffConfirmCreate");


/* ==========================================
   STAFF SUCCESS MODAL
========================================== */

const staffSuccessModal = document.getElementById("staffSuccessModal");
const successStaffId = document.getElementById("successStaffId");
const successStaffRole = document.getElementById("successStaffRole");
const successStaffPassword = document.getElementById("successStaffPassword");
const staffDoneBtn = document.getElementById("staffDoneBtn");

/* ==========================================
   STAFF DETAILS MODAL
========================================== */

const staffDetailsModal = document.getElementById("staffDetailsModal");
const closeStaffDetails = document.getElementById("closeStaffDetails");

const viewStaffId = document.getElementById("viewStaffId");
const viewStaffName = document.getElementById("viewStaffName");
const viewStaffRole = document.getElementById("viewStaffRole");
const viewStaffEmail = document.getElementById("viewStaffEmail");
const viewStaffPhone = document.getElementById("viewStaffPhone");
const temporaryPasswordRow = document.getElementById("temporaryPasswordRow");
const viewStaffPassword = document.getElementById("viewStaffPassword");
const viewStaffDate = document.getElementById("viewStaffDate");
const viewStaffStatus = document.getElementById("viewStaffStatus");

const staffDeactivateBtn = document.getElementById("staffDeactivateBtn");


/* ==========================================
   DEACTIVATE CONFIRMATION
========================================== */

const staffDeactivateModal = document.getElementById("staffDeactivateModal");
const staffDeactivateCancel = document.getElementById("staffDeactivateCancel");
const staffDeactivateConfirm = document.getElementById("staffDeactivateConfirm");

let selectedStaff = null;

/* ==========================================
   GENERATE TEMPORARY PASSWORD
========================================== */

function generateTemporaryPassword() {

    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    let password = "";

    for (let i = 0; i < 10; i++) {

        password += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );

    }

    temporaryPassword.value = password;
}


/* ==========================================
   OPEN ADD STAFF MODAL
========================================== */

addStaffBtn.addEventListener("click", function () {

    staffIdInput.value = "";
    staffRole.value = "";

    generateTemporaryPassword();

    addStaffModal.classList.add("show");

    document.body.style.overflow = "hidden";
    document.querySelector(".main-content").style.overflow = "hidden";

});


/* ==========================================
   REGENERATE PASSWORD
========================================== */

regeneratePassword.addEventListener("click", function () {

    generateTemporaryPassword();

});


/* ==========================================
   CLOSE ADD STAFF MODAL
========================================== */

function closeAddStaff() {

    addStaffModal.classList.remove("show");

    document.body.style.overflow = "";
    document.querySelector(".main-content").style.overflow = "";

}


closeAddStaffModal.addEventListener("click", closeAddStaff);

cancelAddStaff.addEventListener("click", closeAddStaff);


/* ==========================================
   CLOSE ADD STAFF MODAL OUTSIDE
========================================== */

addStaffModal.addEventListener("click", function (event) {

    if (event.target === addStaffModal) {

        closeAddStaff();

    }

});


/* ==========================================
   CREATE ACCOUNT
========================================== */

createStaffBtn.addEventListener("click", function () {

    if (staffIdInput.value.trim() === "") {

        staffIdInput.focus();
        return;

    }

    if (staffRole.value === "") {

        staffRole.focus();
        return;

    }

    staffConfirmModal.classList.add("show");

});


/* ==========================================
   CANCEL CREATE CONFIRMATION
========================================== */

staffConfirmCancel.addEventListener("click", function () {

    staffConfirmModal.classList.remove("show");

});


/* ==========================================
   CONFIRM CREATE ACCOUNT
========================================== */

staffConfirmCreate.addEventListener("click", function () {

    const staffId = staffIdInput.value.trim();

    const roleText =
        staffRole.value === "registrar"
            ? "Registrar"
            : "Guidance";

    const temporaryPasswordValue = temporaryPassword.value;


    /* ADD NEW STAFF TO DEMO DATA */

    staffData.push({
        staffId: staffId,
        name: "—",
        role: roleText,
        email: "",
        phone: "",
        password: temporaryPasswordValue,
        temporaryPassword: true,
        status: "pending",
        dateCreated: new Date().toISOString().split("T")[0]
    });

    localStorage.setItem(
        "staffData",
        JSON.stringify(staffData)
    );

    localStorage.setItem("staffData", JSON.stringify(staffData));

    addActivity(
        "+",
        "Staff account added",
        "New Staff — " + roleText + " account was created."
    );

    updateStaffSummary();


    /* DISPLAY SUCCESS DETAILS */

    successStaffId.textContent = staffId;
    successStaffRole.textContent = roleText;
    successStaffPassword.textContent = temporaryPasswordValue;


    /* CLOSE CONFIRMATION + ADD STAFF MODAL */

    staffConfirmModal.classList.remove("show");
    addStaffModal.classList.remove("show");


    /* SHOW SUCCESS MODAL */

    staffSuccessModal.classList.add("show");

});


/* ==========================================
   DONE
========================================== */

staffDoneBtn.addEventListener("click", function () {

    staffSuccessModal.classList.remove("show");

    document.body.style.overflow = "";
    document.querySelector(".main-content").style.overflow = "";

    displayStaffAccounts();

});


/* ==========================================
   CLOSE CONFIRMATION OUTSIDE
========================================== */

staffConfirmModal.addEventListener("click", function (event) {

    if (event.target === staffConfirmModal) {

        staffConfirmModal.classList.remove("show");

    }

});

/* ==========================================
   UPDATE STAFF SUMMARY
========================================== */

function updateStaffSummary() {

    const total = staffData.length;

    const active = staffData.filter(function (staff) {
        return staff.status === "active";
    }).length;

    const pending = staffData.filter(function (staff) {
        return staff.status === "pending";
    }).length;

    const inactive = staffData.filter(function (staff) {
        return staff.status === "inactive";
    }).length;


    totalStaffCount.textContent = total;
    activeStaffCount.textContent = active;
    pendingStaffCount.textContent = pending;
    inactiveStaffCount.textContent = inactive;

}

/* ==========================================
   REFRESH STAFF DATA
========================================== */

function refreshStaffData() {

    staffData =
        JSON.parse(
            localStorage.getItem("staffData")
        ) || [];

}

/* ==========================================
   DISPLAY STAFF ACCOUNTS
========================================== */

function displayStaffAccounts() {

    refreshStaffData();

    const searchValue = staffSearch.value.toLowerCase().trim();
    const selectedRole = staffRoleFilter.value;
    const selectedStatus = staffStatusFilter.value;


    let filteredData = staffData.filter(function (staff) {

        const matchesSearch =
            staff.staffId.toLowerCase().includes(searchValue) ||
            (staff.name && staff.name.toLowerCase().includes(searchValue));

        const matchesRole =
            selectedRole === "all" ||
            staff.role.toLowerCase() === selectedRole;

        const matchesStatus =
            selectedStatus === "all" ||
            staff.status.toLowerCase() === selectedStatus;

        return matchesSearch && matchesRole && matchesStatus;

    });


    /* CLEAR TABLE */

    staffTableBody.innerHTML = "";


    /* NO RESULTS */

    if (filteredData.length === 0) {

        staffTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; padding:30px; color:#888;">
                    No staff accounts found.
                </td>
            </tr>
        `;

    } else {

        /* DISPLAY STAFF */

        filteredData.forEach(function (staff) {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${staff.staffId}</td>
                <td>${staff.name || "—"}</td>
                <td>${staff.role}</td>
                <td>
                    <span class="staff-status ${staff.status}">
                        ${staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                    </span>
                </td>
                <td>
                    <button type="button" class="staff-action-btn">
                        View
                    </button>
                </td>
            `;


            /* VIEW BUTTON */

            const viewButton = row.querySelector(".staff-action-btn");

            viewButton.addEventListener("click", function () {

                selectedStaff = staff;

                viewStaffId.textContent = staff.staffId;
                viewStaffName.textContent = staff.name || "—";
                viewStaffRole.textContent = staff.role;
                viewStaffEmail.textContent = staff.email || "—";
                viewStaffPhone.textContent = staff.phone || "—";

                if (
                    staff.status === "pending" &&
                    staff.temporaryPassword === true &&
                    staff.password
                ) {
                    temporaryPasswordRow.style.display = "flex";
                    viewStaffPassword.textContent = staff.password;
                } else {
                    temporaryPasswordRow.style.display = "none";
                    viewStaffPassword.textContent = "—";
                }

                viewStaffDate.textContent = new Date(staff.dateCreated).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric"
                });

                viewStaffStatus.textContent =
                    staff.status.charAt(0).toUpperCase() + staff.status.slice(1);


                /* DEACTIVATE BUTTON */

                if (staff.status === "inactive") {

                    staffDeactivateBtn.style.display = "none";

                } else {

                    staffDeactivateBtn.style.display = "block";

                }


                staffDetailsModal.classList.add("show");

                document.body.style.overflow = "hidden";
                document.querySelector(".main-content").style.overflow = "hidden";

            });


            staffTableBody.appendChild(row);

        });

    }


    /* ACCOUNT COUNT */

    if (filteredData.length === 0) {

        staffCount.textContent = "No accounts found";

    } else {

        staffCount.textContent =
            `Showing 1-${filteredData.length} of ${filteredData.length} accounts`;

    }

}


/* ==========================================
   CLOSE STAFF DETAILS
========================================== */

function closeStaffDetailsModal() {

    staffDetailsModal.classList.remove("show");

    document.body.style.overflow = "";
    document.querySelector(".main-content").style.overflow = "";

}


closeStaffDetails.addEventListener("click", closeStaffDetailsModal);


/* ==========================================
   CLOSE STAFF DETAILS OUTSIDE
========================================== */

staffDetailsModal.addEventListener("click", function (event) {

    if (event.target === staffDetailsModal) {

        closeStaffDetailsModal();

    }

});


/* ==========================================
   DEACTIVATE ACCOUNT
========================================== */

staffDeactivateBtn.addEventListener("click", function () {

    staffDeactivateModal.classList.add("show");

});


/* ==========================================
   CANCEL DEACTIVATION
========================================== */

staffDeactivateCancel.addEventListener("click", function () {

    staffDeactivateModal.classList.remove("show");

});


/* ==========================================
   CONFIRM DEACTIVATION
========================================== */

staffDeactivateConfirm.addEventListener("click", function () {

    if (!selectedStaff) {
        return;
    }

    selectedStaff.status = "inactive";

    localStorage.setItem("staffData", JSON.stringify(staffData));

    addActivity(
        "−",
        "Staff account deactivated",
        selectedStaff.name + " — " + selectedStaff.role + " account was deactivated."
    );

    updateStaffSummary();

    staffDeactivateModal.classList.remove("show");
    staffDetailsModal.classList.remove("show");

    document.body.style.overflow = "";
    document.querySelector(".main-content").style.overflow = "";

    displayStaffAccounts();

});


/* ==========================================
   CLOSE DEACTIVATION OUTSIDE
========================================== */

staffDeactivateModal.addEventListener("click", function (event) {

    if (event.target === staffDeactivateModal) {

        staffDeactivateModal.classList.remove("show");

    }

});


/* ==========================================
   STAFF SEARCH
========================================== */

staffSearch.addEventListener("input", function () {

    displayStaffAccounts();

});


/* ==========================================
   STAFF ROLE FILTER
========================================== */

staffRoleFilter.addEventListener("change", function () {

    displayStaffAccounts();

});


/* ==========================================
   STAFF STATUS FILTER
========================================== */

staffStatusFilter.addEventListener("change", function () {

    displayStaffAccounts();

});

/* ==========================================
   REFRESH WHEN STAFF DATA CHANGES
========================================== */

window.addEventListener("storage", function (event) {

    if (event.key === "staffData") {

        refreshStaffData();
        updateStaffSummary();
        displayStaffAccounts();

    }

});

/* ==========================================
   INITIAL STAFF DISPLAY
========================================== */

updateStaffSummary();
displayStaffAccounts();