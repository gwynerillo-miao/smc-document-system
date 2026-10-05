/* ==========================================
   DOCUMENT REQUESTS
========================================== */

let currentRequests = [];

function loadCurrentRequests() {

    const studentRequests =
        JSON.parse(
            localStorage.getItem("demoRequests")
        ) || [];

    const documents =
        JSON.parse(
            localStorage.getItem("documents")
        ) || [];

    const userRole =
        (sessionStorage.getItem("role") || "").toLowerCase();

    currentRequests =
        studentRequests.filter(function (request) {

            const documentSettings =
                documents.find(function (document) {
                    return document[0] === request.documentType;
                });

            if (!documentSettings) {
                return false;
            }

            const assignedRole =
                String(documentSettings[3] || "").toLowerCase();

            const matchesRole =
                assignedRole === userRole;

            const matchesStatus =
                request.status === "Pending Review" ||
                request.status === "Payment Required" ||
                request.status === "Processing" ||
                request.status === "Ready for Pickup";

            return matchesRole && matchesStatus;

        });

}

/* ==========================================
   SAVE CURRENT REQUESTS
========================================== */

function saveCurrentRequests() {

    const allRequests =
        JSON.parse(
            localStorage.getItem("demoRequests")
        ) || [];

    currentRequests.forEach(function (request) {

        const index =
            allRequests.findIndex(function (item) {

                return item.referenceNumber ===
                    request.referenceNumber;

            });

        if (index !== -1) {

            allRequests[index] = request;

        }

    });

    localStorage.setItem(
        "demoRequests",
        JSON.stringify(allRequests)
    );

}

const requestsPerPage = 25;
let requestCurrentPage = 1;
let filteredRequests = [];

const requestTableBody =
    document.getElementById("requestTableBody");

const requestSearch =
    document.getElementById("requestSearch");

const requestStatusFilter =
    document.getElementById("requestStatusFilter");

const requestDocumentFilter =
    document.getElementById("requestDocumentFilter");

const requestSortFilter =
    document.getElementById("requestSortFilter");

const requestCount =
    document.getElementById("requestCount");

const pagination =
    document.getElementById("pagination");

const mainContent =
    document.querySelector(".main-content");

const requestConfirmModal =
    document.getElementById("requestConfirmModal");

const requestConfirmTitle =
    document.getElementById("requestConfirmTitle");

const requestConfirmMessage =
    document.getElementById("requestConfirmMessage");

const requestConfirmCancel =
    document.getElementById("requestConfirmCancel");

let requestConfirmProceed =
    document.getElementById("requestConfirmProceed");

let confirmAction = null;

/* ==========================================
   ADD STUDENT NOTIFICATION
========================================== */

function addStudentNotification(request, message) {

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
   ADD STAFF ACTIVITY
========================================== */

function addStaffActivity(
    icon,
    title,
    description
) {

    const activities =
        JSON.parse(
            localStorage.getItem("staffRecentActivities")
        ) || [];

    activities.unshift({

        icon: icon,

        title: title,

        description: description,

        date:
            new Date().toISOString().split("T")[0]

    });

    localStorage.setItem(
        "staffRecentActivities",
        JSON.stringify(
            activities.slice(0, 7)
        )
    );

}

/* ==========================================
   MOVE REQUEST TO HISTORY
========================================== */

function moveRequestToHistory(request, status) {

    const completionDate =
        new Date().toISOString().split("T")[0];

    const historyRequest = {
        ...request,
        status: status.toLowerCase(),
        dateCompleted: completionDate,
        dateFinalized: completionDate
    };

    const savedHistory =
        localStorage.getItem("staffDocumentHistory");

    const history =
        savedHistory
            ? JSON.parse(savedHistory)
            : [];

    const existingIndex =
        history.findIndex(function (item) {
            return item.referenceNumber === request.referenceNumber;
        });

    if (existingIndex === -1) {
        history.unshift(historyRequest);
    } else {
        history[existingIndex] = historyRequest;
    }

    localStorage.setItem(
        "staffDocumentHistory",
        JSON.stringify(history)
    );
}

/* ==========================================
   DISPLAY DOCUMENT TYPE FILTER
========================================== */

function displayDocumentTypeFilter() {

    const savedDocuments =
        localStorage.getItem("documents");

    if (!savedDocuments) {
        return;
    }

    const documents =
        JSON.parse(savedDocuments);

    const userRole =
        (sessionStorage.getItem("role") || "").toLowerCase();

    requestDocumentFilter.innerHTML = `
        <option value="all">All Document Types</option>
    `;

    documents.forEach(function (item) {

        const assignedRole =
            String(item[3] || "").toLowerCase();

        if (assignedRole !== userRole) {
            return;
        }

        const option =
            document.createElement("option");

        option.value = item[0];
        option.textContent = item[0];

        requestDocumentFilter.appendChild(option);

    });
}

displayDocumentTypeFilter();

/* ==========================================
   DISPLAY REQUESTS
========================================== */

function displayRequests(requests) {

    requestTableBody.innerHTML = "";

    const startIndex =
        (requestCurrentPage - 1) * requestsPerPage;

    const pageRequests =
        requests.slice(
            startIndex,
            startIndex + requestsPerPage
        );

    pageRequests.forEach(function (request) {

        const row = document.createElement("tr");

        const statusClass =
            getStatusClass(request.status);

        let actionContent = "";

        if (request.status === "Pending Review") {

            actionContent = `
                <span class="request-awaiting">
                    Awaiting for Approval
                </span>
            `;

        } else if (request.status === "Payment Required") {

            actionContent = `
                <span class="request-awaiting">
                    Awaiting for Payment
                </span>
            `;

        } else {

            actionContent = `
                <select
                    class="request-action-select"
                    data-reference="${request.referenceNumber}"
                >
                    <option value="Processing"
                        ${request.status === "Processing" ? "selected" : ""}>
                        Processing
                    </option>

                    <option value="Ready for Pickup"
                        ${request.status === "Ready for Pickup" ? "selected" : ""}>
                        Ready for Pickup
                    </option>

                    <option value="Completed"
                        ${request.status === "Completed" ? "selected" : ""}>
                        Completed (Picked Up)
                    </option>
                </select>
            `;
        }

        row.innerHTML = `
            <td>${request.name}</td>

            <td>${request.referenceNumber}</td>

            <td>${request.documentType}</td>

            <td>
                ${new Date(
                    request.dateRequested + "T00:00:00"
                ).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                })}
            </td>

            <td>
                ${actionContent}
            </td>

            <td>
                <span class="request-status ${statusClass}">
                    ${request.status}
                </span>
            </td>

            <td>
                <button
                    type="button"
                    class="request-view-btn"
                    data-reference="${request.referenceNumber}"
                >
                    View
                </button>
            </td>
        `;

        requestTableBody.appendChild(row);
    });

    requestCount.textContent =
        `Showing ${requests.length} of ${currentRequests.length} request${currentRequests.length !== 1 ? "s" : ""}`;

    displayPagination(requests);

    addActionListeners();
    addViewListeners();
}

/* ==========================================
   PAGINATION
========================================== */

function displayPagination(requests) {

    pagination.innerHTML = "";

    const totalPages =
        Math.ceil(requests.length / requestsPerPage);

    if (totalPages <= 1) {
        return;
    }

    const previousButton =
        document.createElement("button");

    previousButton.type = "button";
    previousButton.className = "page-btn";
    previousButton.textContent = "‹";
    previousButton.disabled = requestCurrentPage === 1;

    previousButton.addEventListener("click", function () {

        if (requestCurrentPage > 1) {

            requestCurrentPage--;

            displayRequests(filteredRequests);

        }

    });

    pagination.appendChild(previousButton);


    for (let page = 1; page <= totalPages; page++) {

        const pageButton =
            document.createElement("button");

        pageButton.type = "button";
        pageButton.className = "page-btn";
        pageButton.textContent = page;

        if (page === requestCurrentPage) {
            pageButton.classList.add("active");
        }

        pageButton.addEventListener("click", function () {

            requestCurrentPage = page;

            displayRequests(filteredRequests);

        });

        pagination.appendChild(pageButton);
    }


    const nextButton =
        document.createElement("button");

    nextButton.type = "button";
    nextButton.className = "page-btn";
    nextButton.textContent = "›";
    nextButton.disabled =
        requestCurrentPage === totalPages;

    nextButton.addEventListener("click", function () {

        if (requestCurrentPage < totalPages) {

            requestCurrentPage++;

            displayRequests(filteredRequests);

        }

    });

    pagination.appendChild(nextButton);
}

/* ==========================================
   ACTION DROPDOWN
========================================== */

function addActionListeners() {

    const actionSelects =
        document.querySelectorAll(".request-action-select");

    actionSelects.forEach(function (select) {

        select.addEventListener("change", function () {

            const row =
                select.closest("tr");

            const referenceNumber =
                row.children[1].textContent;

            const newStatus =
                select.value;

            const request =
                currentRequests.find(function (item) {
                    return item.referenceNumber === referenceNumber;
                });

            if (!request) {
                return;
            }

            /* ==========================================
            COMPLETED / PICKED UP
            ========================================== */

            if (newStatus === "Completed") {

                selectedRequest = request;

                requestConfirmIcon.textContent = "?";

                requestConfirmTitle.textContent =
                    "Complete Request";

                requestConfirmMessage.textContent =
                    "Are you sure this request has been picked up?";

                confirmAction = "complete";

                requestConfirmProceed.textContent = "Confirm";

                requestConfirmProceed.className =
                    "save-btn";

                requestConfirmModal.style.display = "flex";

                return;
            }

            /* ==========================================
               UPDATE REQUEST STATUS
            ========================================== */

            request.status = newStatus;

            addStaffActivity(
                "⚙",
                "Document request status updated",
                request.name + " — " + request.documentType +
                " is now " + newStatus
            );

            /* Student notification */

            addStudentNotification(
                request,
                "Your " +
                request.documentType +
                " request is now " +
                newStatus + "."
            );

            saveCurrentRequests();

            const statusBadge =
                row.querySelector(".request-status");

            statusBadge.textContent = newStatus;

            statusBadge.className =
                "request-status " +
                getStatusClass(newStatus);

        });
    });
}

/* ==========================================
   VIEW REQUEST DETAILS
========================================== */

const requestDetailsModal =
    document.getElementById("requestDetailsModal");

const requestDetailsModalContent =
    document.querySelector(".request-details-modal-content");

const requestDetailsCloseBtn =
    document.querySelector(".request-details-close-btn");

const requestDetails =
    document.getElementById("requestDetails");

const requestDecisionButtons =
    document.getElementById("requestDecisionButtons");

const requestApproveBtn =
    document.getElementById("requestApproveBtn");

const requestRejectBtn =
    document.getElementById("requestRejectBtn");

let selectedRequest = null;

/* ==========================================
   VIEW REQUEST DETAILS
========================================== */

function addViewListeners() {

    const viewButtons =
        document.querySelectorAll(".request-view-btn");

    viewButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const referenceNumber =
                button.dataset.reference;

            const request =
                currentRequests.find(function (item) {
                    return item.referenceNumber === referenceNumber;
                });

            if (!request) {
                return;
            }

            selectedRequest = request;

            const formattedDate =
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

            const statusClass =
                getStatusClass(request.status);

            requestDetails.innerHTML = `
                <div class="request-detail-item">
                    <span class="request-detail-label">
                        Reference Number
                    </span>
                    <span class="request-detail-value">
                        ${request.referenceNumber}
                    </span>
                </div>

                <div class="request-detail-item">
                    <span class="request-detail-label">
                        Student Name
                    </span>
                    <span class="request-detail-value">
                        ${request.name}
                    </span>
                </div>

                <div class="request-detail-item">
                    <span class="request-detail-label">
                        Document Type
                    </span>
                    <span class="request-detail-value">
                        ${request.documentType}
                    </span>
                </div>

                <div class="request-detail-item">
                    <span class="request-detail-label">
                        Purpose
                    </span>
                    <span class="request-detail-value">
                        ${request.purpose}
                    </span>
                </div>

                <div class="request-detail-item">
                    <span class="request-detail-label">
                        Number of Copies
                    </span>
                    <span class="request-detail-value">
                        ${request.copies}
                    </span>
                </div>

                <div class="request-detail-item">
                    <span class="request-detail-label">
                        Delivery Method
                    </span>
                    <span class="request-detail-value">
                        ${request.deliveryMethod || "Pick Up at Registrar's Office"}
                    </span>
                </div>

                <div class="request-detail-item">
                    <span class="request-detail-label">
                        Payment Method
                    </span>
                    <span class="request-detail-value">
                        ${request.paymentMethod}
                    </span>
                </div>

                <div class="request-detail-item">
                    <span class="request-detail-label">
                        Payment Reference Number
                    </span>
                    <span class="request-detail-value">
                        ${request.paymentReferenceNumber || "Not provided"}
                    </span>
                </div>

                <div class="request-detail-item">
                    <span class="request-detail-label">
                        Special Instructions
                    </span>
                    <span class="request-detail-value">
                        ${request.instructions || "None"}
                    </span>
                </div>

                <div class="request-detail-item">
                    <span class="request-detail-label">
                        Date Requested
                    </span>
                    <span class="request-detail-value">
                        ${formattedDate}
                    </span>
                </div>

                <div class="request-detail-item">
                    <span class="request-detail-label">
                        Pickup Date
                    </span>
                    <span class="request-detail-value">
                        ${
                            request.pickupDate
                                ? new Date(
                                    request.pickupDate + "T00:00:00"
                                ).toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric"
                                })
                                : "Not scheduled"
                        }
                    </span>
                </div>

                <div class="request-detail-item">
                    <span class="request-detail-label">
                        Status
                    </span>
                    <span class="request-detail-value">
                        <span class="request-detail-status ${statusClass}">
                            ${request.status}
                        </span>
                    </span>
                </div>
            `;

            /* ==========================================
               DECISION BUTTONS
            ========================================== */

            requestRejectBtn.style.display = "none";
            requestApproveBtn.style.display = "none";
            requestApproveBtn.disabled = false;
            requestApproveBtn.textContent = "Approve";

            if (request.status === "Pending Review") {

                requestRejectBtn.style.display = "inline-flex";
                requestApproveBtn.style.display = "inline-flex";

            } else if (request.status === "Payment Required") {

                requestApproveBtn.style.display = "inline-flex";

            if (
                !request.paymentReferenceNumber ||
                request.paymentReferenceNumber === "-"
            ) {
                requestApproveBtn.disabled = true;
            }

            }

            if (
                request.status === "Pending Review" ||
                request.status === "Payment Required"
            ) {
                requestDecisionButtons.style.display = "flex";
            } else {
                requestDecisionButtons.style.display = "none";
            }

            requestDetailsModal.style.display = "flex";
            mainContent.style.overflowY = "hidden";
            requestDetailsModalContent.scrollTop = 0;
        });
    });
}

/* ==========================================
   APPROVE REQUEST
========================================== */

requestApproveBtn.addEventListener(
    "click",
    function () {

        if (!selectedRequest) {
            return;
        }

        requestConfirmIcon.textContent = "?";

        requestConfirmTitle.textContent =
            "Approve Request";

        requestConfirmMessage.textContent =
            "Are you sure you want to approve this request?";

        confirmAction = "approve";

        requestConfirmProceed.textContent = "Confirm";
        requestConfirmProceed.className = "save-btn";

        requestConfirmModal.style.display = "flex";

    }
);

/* ==========================================
   REJECT REQUEST
========================================== */

requestRejectBtn.addEventListener(
    "click",
    function () {

        if (!selectedRequest) {
            return;
        }

        requestConfirmIcon.textContent = "!";

        requestConfirmTitle.textContent =
            "Reject Request";

        requestConfirmMessage.textContent =
            "Are you sure you want to reject this request?";

        confirmAction = "reject";

        requestConfirmProceed.textContent = "Reject";
        requestConfirmProceed.className = "delete-confirm-btn";

        requestConfirmModal.style.display = "flex";

    }
);

/* ==========================================
   CONFIRM APPROVE / REJECT
========================================== */

requestConfirmProceed.addEventListener(
    "click",
    function () {

        const request = selectedRequest;
        const action = confirmAction;

        if (!request || !action) {
            return;
        }

        /* ==========================================
           APPROVE
        ========================================== */

        if (action === "approve") {

            /* PENDING REVIEW → PAYMENT REQUIRED */

            if (request.status === "Pending Review") {

                request.status = "Payment Required";

                saveCurrentRequests();

                addStaffActivity(
                    "✓",
                    "Document request approved",
                    request.name +
                    " — " +
                    request.documentType +
                    " request was approved."
                );

                addStudentNotification(
                    request,
                    "Your " +
                    request.documentType +
                    " request has been approved. Payment is now required."
                );

            }

            /* PAYMENT REQUIRED → PROCESSING */

            else if (
                request.status === "Payment Required" &&
                request.paymentReferenceNumber &&
                request.paymentReferenceNumber !== "-"
            ) {

                request.status = "Processing";

                saveCurrentRequests();

                addStaffActivity(
                    "⚙",
                    "Document request moved to Processing",
                    request.name +
                    " — " +
                    request.documentType +
                    " request is now being processed."
                );

                addStudentNotification(
                    request,
                    "Your " +
                    request.documentType +
                    " request is now being processed."
                );

            }

        }

        /* ==========================================
           COMPLETE
        ========================================== */

        else if (action === "complete") {

            request.status = "Completed";

            moveRequestToHistory(
                request,
                "Completed"
            );

            addStaffActivity(
                "✓",
                "Request completed",
                request.name +
                "'s " +
                request.documentType +
                " request was marked as completed."
            );

            addStudentNotification(
                request,
                "Your " +
                request.documentType +
                " request has been completed and picked up."
            );

            const allRequests =
                JSON.parse(
                    localStorage.getItem("demoRequests")
                ) || [];

            const remainingRequests =
                allRequests.filter(function (item) {

                    return item.referenceNumber !==
                        request.referenceNumber;

                });

            localStorage.setItem(
                "demoRequests",
                JSON.stringify(remainingRequests)
            );

            currentRequests =
                currentRequests.filter(function (item) {

                    return item.referenceNumber !==
                        request.referenceNumber;

                });

        }

        /* ==========================================
           REJECT
        ========================================== */

        else if (action === "reject") {

            request.status = "Rejected";

            moveRequestToHistory(
                request,
                "Rejected"
            );

            addStaffActivity(
                "✕",
                "Request rejected",
                request.name +
                "'s " +
                request.documentType +
                " request was rejected."
            );

            addStudentNotification(
                request,
                "Your " +
                request.documentType +
                " request has been rejected."
            );

            const allRequests =
                JSON.parse(
                    localStorage.getItem("demoRequests")
                ) || [];

            const remainingRequests =
                allRequests.filter(function (item) {

                    return item.referenceNumber !==
                        request.referenceNumber;

                });

            localStorage.setItem(
                "demoRequests",
                JSON.stringify(remainingRequests)
            );

            currentRequests =
                currentRequests.filter(function (item) {

                    return item.referenceNumber !==
                        request.referenceNumber;

                });

        }

        /* ==========================================
           CLOSE MODALS
        ========================================== */

        requestConfirmModal.style.display = "none";

        requestDetailsModal.style.display = "none";

        mainContent.style.overflowY = "auto";

        confirmAction = null;

        selectedRequest = null;

        /* ==========================================
           REFRESH
        ========================================== */

        updateRequests();

        if (
            typeof updateDocumentRequestsCount ===
            "function"
        ) {
            updateDocumentRequestsCount();
        }

    }
);

/* ==========================================
   CANCEL CONFIRMATION
========================================== */

requestConfirmCancel.addEventListener(
    "click",
    function () {

        requestConfirmModal.style.display = "none";
        confirmAction = null;

    }
);

/* ==========================================
   CLOSE REQUEST DETAILS
========================================== */

requestDetailsCloseBtn.addEventListener(
    "click",
    function () {

    requestDetailsModal.style.display = "none";
    mainContent.style.overflowY = "auto";

    selectedRequest = null;

    }
);

requestDetailsModal.addEventListener(
    "click",
    function (event) {

        if (event.target === requestDetailsModal) {

        requestDetailsModal.style.display = "none";
        mainContent.style.overflowY = "auto";

        selectedRequest = null;

        }

    }
);

/* ==========================================
   STATUS CLASS
========================================== */

function getStatusClass(status) {

    if (status === "Pending Review") {
        return "pending";
    }

    if (status === "Payment Required") {
        return "pending-payment";
    }

    if (status === "Processing") {
        return "processing";
    }

    if (status === "Ready for Pickup") {
        return "ready";
    }

    return "";
}

/* ==========================================
   SYNC STUDENT REQUESTS
========================================== */

window.addEventListener("storage", function (event) {

    if (event.key === "demoRequests") {

        loadCurrentRequests();

        requestCurrentPage = 1;

        updateRequests();

        updateDocumentRequestsCount();

    }

});

/* ==========================================
   SYNC DOCUMENT REQUEST COUNTS
========================================== */

window.addEventListener("storage", function (event) {

    if (event.key === "demoRequests") {
        updateDocumentRequestsCount();
    }

});

/* ==========================================
   FILTER AND SORT
========================================== */

function updateRequests() {

    const searchValue =
        requestSearch.value.toLowerCase().trim();

    const selectedStatus =
        requestStatusFilter.value;

    const selectedDocument =
        requestDocumentFilter.value;

    const selectedSort =
        requestSortFilter.value;

    filteredRequests =
        currentRequests.filter(function (request) {

            const studentName =
                String(request.name || "");

            const matchesSearch =
                studentName.toLowerCase().includes(searchValue) ||
                request.referenceNumber.toLowerCase().includes(searchValue);

            let matchesStatus = true;

            if (selectedStatus === "pending") {
                matchesStatus =
                    request.status === "Pending Review";
            }

            if (selectedStatus === "payment") {
                matchesStatus =
                    request.status === "Payment Required";
            }

            if (selectedStatus === "processing") {
                matchesStatus =
                    request.status === "Processing";
            }

            if (selectedStatus === "ready") {
                matchesStatus =
                    request.status === "Ready for Pickup";
            }

            const matchesDocument =
                selectedDocument === "all" ||
                request.documentType === selectedDocument;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesDocument
            );
        });

    filteredRequests.sort(function (a, b) {

        const dateA =
            new Date(a.dateRequested);

        const dateB =
            new Date(b.dateRequested);

        if (selectedSort === "oldest") {
            return dateA - dateB;
        }

        return dateB - dateA;
    });

    requestCurrentPage = 1;

    displayRequests(filteredRequests);
}


/* ==========================================
   SEARCH
========================================== */

requestSearch.addEventListener(
    "input",
    updateRequests
);


/* ==========================================
   STATUS FILTER
========================================== */

requestStatusFilter.addEventListener(
    "change",
    updateRequests
);


/* ==========================================
   DOCUMENT TYPE FILTER
========================================== */

requestDocumentFilter.addEventListener(
    "change",
    updateRequests
);


/* ==========================================
   DATE SORT
========================================== */

requestSortFilter.addEventListener(
    "change",
    updateRequests
);


/* ==========================================
   INITIAL DISPLAY
========================================== */

loadCurrentRequests();
updateRequests();