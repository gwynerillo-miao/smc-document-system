 /* ==========================================
    REPORT PERIOD FILTER
 ========================================== */

const sortPicker = document.getElementById("sortPicker");
const sortValue = document.getElementById("sortValue");
const monthPicker = document.getElementById("monthPicker");

sortPicker.addEventListener("click", function () {
    monthPicker.showPicker();
});

monthPicker.addEventListener("change", function () {

    if (monthPicker.value) {

        const [year, month] = monthPicker.value.split("-");

        const date = new Date(year, month - 1);

        const formattedMonth = date.toLocaleString("en-US", {
            month: "long",
            year: "numeric"
        });

        sortValue.textContent = formattedMonth;

        console.log("Selected report period:", monthPicker.value);

    } else {

        sortValue.textContent = "All Time";

        console.log("Report period cleared. Showing All Time.");

    }

    historyCurrentPage = 1;
    updateReports();
    displayAccountHistory();

});

/* ==========================================
   UPDATE REPORTS
========================================== */

function updateReports() {

    const selectedMonth = monthPicker.value;

    const reportData = studentHistory.filter(function (account) {
        return !selectedMonth || account.date.startsWith(selectedMonth);
    });

    const totalAccounts = reportData.length;

    const approvedAccounts = reportData.filter(function (account) {
        return account.status === "approved";
    }).length;

    const rejectedAccounts = reportData.filter(function (account) {
        return account.status === "rejected";
    }).length;

    const pendingAccounts = studentData.filter(function (account) {
        return (
            account.status === "pending" &&
            (!selectedMonth || account.date.startsWith(selectedMonth))
        );
    }).length;

    document.getElementById("totalAccounts").textContent =
        totalAccounts + pendingAccounts;

    document.getElementById("approvedAccounts").textContent =
        approvedAccounts;

    document.getElementById("rejectedAccounts").textContent =
        rejectedAccounts;

    document.getElementById("pendingAccounts").textContent =
        pendingAccounts;

    document.getElementById("chartTotal").textContent =
        totalAccounts + pendingAccounts;

    updatePieChart(
        approvedAccounts,
        rejectedAccounts,
        pendingAccounts,
        totalAccounts + pendingAccounts
    );
}

function updatePieChart(approved, rejected, pending, total) {

    const pieChart = document.querySelector(".pie-chart");

    if (total === 0) {
        pieChart.style.background = "#e5e9e7";
        return;
    }

    const approvedDegrees = (approved / total) * 360;
    const rejectedDegrees = (rejected / total) * 360;

    let gradient = `#13563a 0deg ${approvedDegrees}deg`;

    if (rejected > 0) {
        gradient += `, #b42318 ${approvedDegrees}deg ${approvedDegrees + rejectedDegrees}deg`;
    }

    if (pending > 0) {
        gradient += `, #e5b700 ${approvedDegrees + rejectedDegrees}deg 360deg`;
    }

    pieChart.style.background = `conic-gradient(${gradient})`;
}

const historyTableBody = document.getElementById("historyTableBody");
const historySearch = document.getElementById("historySearch");
const statusFilter = document.getElementById("statusFilter");
const sortFilter = document.getElementById("sortFilter");
const pagination = document.getElementById("pagination");
const historyCount = document.getElementById("historyCount");

const historyPerPage = 25;
let historyCurrentPage = 1;

/* ==========================================
   HISTORY DETAILS MODAL
========================================== */

const historyDetailsModal = document.getElementById("historyDetailsModal");
const closeHistoryModal = document.getElementById("closeHistoryModal");

const historyDetailStudentNumber = document.getElementById("historyDetailStudentNumber");
const historyDetailName = document.getElementById("historyDetailName");
const historyDetailAddress = document.getElementById("historyDetailAddress");
const historyDetailEmail = document.getElementById("historyDetailEmail");
const historyDetailPhone = document.getElementById("historyDetailPhone");
const historyDetailAccountType = document.getElementById("historyDetailAccountType");
const historyDetailProgram = document.getElementById("historyDetailProgram");
const historyDetailDateRegistered = document.getElementById("historyDetailDateRegistered");
const historyDetailStatus = document.getElementById("historyDetailStatus");

function displayAccountHistory() {

    const searchValue = historySearch.value.toLowerCase().trim();
    const selectedStatus = statusFilter.value;
    const selectedSort = sortFilter.value;
    const selectedMonth = monthPicker.value;

    let filteredData = studentHistory.filter(function (account) {
        const matchesSearch =
            account.studentNumber.toLowerCase().includes(searchValue) ||
            account.name.toLowerCase().includes(searchValue);

        const matchesStatus =
            (account.status === "approved" || account.status === "rejected") &&
            (
                selectedStatus === "all" ||
                account.status === selectedStatus
            );

        const matchesMonth =
            !selectedMonth ||
            account.date.startsWith(selectedMonth);

        return matchesSearch && matchesStatus && matchesMonth;
    });

    filteredData.sort(function (a, b) {
        if (selectedSort === "oldest") {
            return new Date(a.date) - new Date(b.date);
        }

        return new Date(b.date) - new Date(a.date);
    });

    const totalPages = Math.ceil(filteredData.length / historyPerPage);

    if (historyCurrentPage > totalPages && totalPages > 0) {
        historyCurrentPage = totalPages;
    }

    const startIndex = (historyCurrentPage - 1) * historyPerPage;
    const endIndex = startIndex + historyPerPage;
    const pageData = filteredData.slice(startIndex, endIndex);

    historyTableBody.innerHTML = "";

    if (pageData.length === 0) {
        historyTableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; padding:30px; color:#888;">
                    No account history found.
                </td>
            </tr>
        `;
    } else {
        pageData.forEach(function (account) {
            const formattedDate = new Date(account.date).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric"
            });

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${account.studentNumber}</td>
                <td>${account.name}</td>
                <td>${formattedDate}</td>
                <td>
                    <span class="history-status ${account.status}">
                        ${account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                    </span>
                </td>
                <td>
                    <button type="button" class="history-view-btn">
                        View
                    </button>
                </td>
            `;

            const viewButton = row.querySelector(".history-view-btn");

            viewButton.addEventListener("click", function () {

                historyDetailStudentNumber.textContent = account.studentNumber;
                historyDetailName.textContent = account.name;
                historyDetailAddress.textContent = account.address;
                historyDetailEmail.textContent = account.email;
                historyDetailPhone.textContent = account.phone;
                historyDetailAccountType.textContent = account.accountType;
                historyDetailProgram.textContent = account.program;

                historyDetailDateRegistered.textContent = new Date(account.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    year: "numeric"
                });

                historyDetailStatus.textContent =
                    account.status.charAt(0).toUpperCase() + account.status.slice(1);

                historyDetailsModal.classList.add("show");

                document.body.style.overflow = "hidden";
                document.querySelector(".main-content").style.overflow = "hidden";

            });

            historyTableBody.appendChild(row);
        });
    }

    if (filteredData.length === 0) {
        historyCount.textContent = "No accounts found";
    } else {
        historyCount.textContent =
            `Showing ${startIndex + 1}-${Math.min(endIndex, filteredData.length)} of ${filteredData.length} accounts`;
    }

    createPagination(totalPages);
}

/* ==========================================
   CLOSE HISTORY DETAILS MODAL
========================================== */

closeHistoryModal.addEventListener("click", function () {

    historyDetailsModal.classList.remove("show");

    document.body.style.overflow = "";
    document.querySelector(".main-content").style.overflow = "";

});


/* ==========================================
   CLOSE MODAL WHEN CLICKING OUTSIDE
========================================== */

historyDetailsModal.addEventListener("click", function (event) {

    if (event.target === historyDetailsModal) {

        historyDetailsModal.classList.remove("show");

        document.body.style.overflow = "";
        document.querySelector(".main-content").style.overflow = "";

    }

});

function createPagination(totalPages) {
    pagination.innerHTML = "";

    if (totalPages <= 1) {
        return;
    }

    const previousButton = document.createElement("button");
    previousButton.type = "button";
    previousButton.className = "page-btn";
    previousButton.textContent = "‹";
    previousButton.disabled = historyCurrentPage === 1;

    previousButton.addEventListener("click", function () {
        if (historyCurrentPage > 1) {
            historyCurrentPage--;
            displayAccountHistory();
        }
    });

    pagination.appendChild(previousButton);

    for (let page = 1; page <= totalPages; page++) {
        const pageButton = document.createElement("button");

        pageButton.type = "button";
        pageButton.className = "page-btn";
        pageButton.textContent = page;

        if (page === historyCurrentPage) {
            pageButton.classList.add("active");
        }

        pageButton.addEventListener("click", function () {
            historyCurrentPage = page;
            displayAccountHistory();
        });

        pagination.appendChild(pageButton);
    }

    const nextButton = document.createElement("button");
    nextButton.type = "button";
    nextButton.className = "page-btn";
    nextButton.textContent = "›";
    nextButton.disabled = historyCurrentPage === totalPages;

    nextButton.addEventListener("click", function () {
        if (historyCurrentPage < totalPages) {
            historyCurrentPage++;
            displayAccountHistory();
        }
    });

    pagination.appendChild(nextButton);
}

historySearch.addEventListener("input", function () {
    historyCurrentPage = 1;
    displayAccountHistory();
});

statusFilter.addEventListener("change", function () {
    historyCurrentPage = 1;
    displayAccountHistory();
});

sortFilter.addEventListener("change", function () {
    historyCurrentPage = 1;
    displayAccountHistory();
});

updateReports();
displayAccountHistory();