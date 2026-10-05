 /* ==========================================
   DOCUMENT HISTORY
========================================== */

const historyTableBody =
    document.getElementById("historyTableBody");

const historySearch =
    document.getElementById("historySearch");

const historyStatusFilter =
    document.getElementById("historyStatusFilter");

const historyDocumentFilter =
    document.getElementById("historyDocumentFilter");

const historySortFilter =
    document.getElementById("historySortFilter");

const historyCount =
    document.getElementById("historyCount");

let currentHistoryPage = 1;
const historyPerPage = 25;


/* ==========================================
   GET LOGGED-IN STAFF ROLE
========================================== */

const historyRole =
    (sessionStorage.getItem("role") || "").toLowerCase();


const historyDocuments =
    JSON.parse(
        localStorage.getItem("documents")
    ) || [];


/* ==========================================
   CHECK DOCUMENT ASSIGNMENT
========================================== */

function isHistoryDocumentAssigned(documentType) {

    const documentSettings =
        historyDocuments.find(function (document) {

            return document[0] === documentType;

        });

    if (!documentSettings) {
        return false;
    }

    const assignedRole =
        String(
            documentSettings[3] || ""
        ).toLowerCase();

    return assignedRole === historyRole;
}


/* ==========================================
   GET HISTORY DATA
========================================== */

function getHistoryData() {

    const savedHistory =
        localStorage.getItem(
            "staffDocumentHistory"
        );

    const history =
        savedHistory
            ? JSON.parse(savedHistory)
            : [];


    const demoRequests =
        JSON.parse(
            localStorage.getItem("demoRequests")
        ) || [];


    const demoHistory =
        demoRequests
            .filter(function (request) {

                return (
                    (
                        request.status === "Completed" ||
                        request.status === "Rejected"
                    ) &&
                    isHistoryDocumentAssigned(
                        request.documentType
                    )
                );

            })
            .map(function (request) {

                return {
                    ...request,
                    status:
                        request.status.toLowerCase(),

                    dateCompleted:
                        request.dateCompleted ||
                        request.dateFinalized ||
                        request.dateRequested
                };

            });


    const combinedHistory = [];


    history.forEach(function (request) {

        if (
            isHistoryDocumentAssigned(
                request.documentType
            )
        ) {

            combinedHistory.push(request);

        }

    });


    demoHistory.forEach(function (request) {

        const alreadyExists =
            combinedHistory.some(function (item) {

                return (
                    item.referenceNumber ===
                    request.referenceNumber
                );

            });


        if (!alreadyExists) {

            combinedHistory.push(request);

        }

    });


    return combinedHistory;
}


/* ==========================================
   DOCUMENT FILTER OPTIONS
========================================== */

function loadHistoryDocumentFilter() {

    const currentDocuments =
        historyDocuments.filter(function (item) {

            const assignedRole =
                String(
                    item[3] || ""
                ).toLowerCase();

            return assignedRole === historyRole;

        }).map(function (item) {

            return item[0];

        });


    const historyData =
        getHistoryData();


    const historicalDocuments =
        historyData.map(function (item) {

            return item.documentType;

        });


    const documentTypes = [
        ...new Set([
            ...currentDocuments,
            ...historicalDocuments
        ])
    ];


    historyDocumentFilter.innerHTML = `
        <option value="all">All Document Types</option>
    `;


    documentTypes.forEach(function (type) {

        const option =
            document.createElement("option");

        option.value = type;
        option.textContent = type;

        historyDocumentFilter.appendChild(
            option
        );

    });

}


/* ==========================================
   DISPLAY HISTORY
========================================== */

function displayHistory() {

    const searchValue =
        historySearch.value
            .toLowerCase()
            .trim();


    const statusValue =
        historyStatusFilter.value;


    const documentValue =
        historyDocumentFilter.value;


    const sortValue =
        historySortFilter.value;


    const historyData =
        getHistoryData();


    let filteredData =
        historyData.filter(function (item) {

            const studentName =
                String(item.name || "");


            const referenceNumber =
                String(
                    item.referenceNumber || ""
                );


            const matchesSearch =
                studentName
                    .toLowerCase()
                    .includes(searchValue) ||

                referenceNumber
                    .toLowerCase()
                    .includes(searchValue);


            const matchesStatus =
                statusValue === "all" ||
                item.status === statusValue;


            const matchesDocument =
                documentValue === "all" ||
                item.documentType === documentValue;


            return (
                matchesSearch &&
                matchesStatus &&
                matchesDocument
            );

        });


    filteredData.sort(function (a, b) {

        const dateA =
            new Date(a.dateRequested);

        const dateB =
            new Date(b.dateRequested);


        return sortValue === "newest"
            ? dateB - dateA
            : dateA - dateB;

    });


    const totalRecords =
        filteredData.length;


    const startIndex =
        (currentHistoryPage - 1) *
        historyPerPage;


    const endIndex =
        startIndex +
        historyPerPage;


    const pageData =
        filteredData.slice(
            startIndex,
            endIndex
        );


    historyTableBody.innerHTML = "";


    pageData.forEach(function (item) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${item.name}</td>

            <td>${item.referenceNumber}</td>

            <td>${item.documentType}</td>

            <td>
                ${formatHistoryDate(
                    item.dateRequested
                )}
            </td>

            <td>
                ${formatHistoryDate(
                    item.dateCompleted
                )}
            </td>

            <td>
                <span class="history-status ${item.status}">
                    ${
                        item.status === "completed"
                            ? "Completed"
                            : "Rejected"
                    }
                </span>
            </td>

            <td>
                <button
                    type="button"
                    class="history-view-btn"
                    data-reference="${item.referenceNumber}"
                >
                    View
                </button>
            </td>
        `;


        historyTableBody.appendChild(row);

    });


    historyCount.textContent =
        `Showing ${pageData.length} of ${totalRecords} records`;


    displayHistoryPagination(
        totalRecords
    );


    addHistoryViewListeners();

}


/* ==========================================
   PAGINATION
========================================== */

function displayHistoryPagination(
    totalRecords
) {

    const pagination =
        document.getElementById(
            "pagination"
        );


    if (!pagination) {
        return;
    }


    pagination.innerHTML = "";


    const totalPages =
        Math.ceil(
            totalRecords /
            historyPerPage
        );


    if (totalPages <= 1) {
        return;
    }


    const previousButton =
        document.createElement("button");


    previousButton.type = "button";
    previousButton.textContent = "‹";


    previousButton.disabled =
        currentHistoryPage === 1;


    previousButton.addEventListener(
        "click",
        function () {

            if (currentHistoryPage > 1) {

                currentHistoryPage--;

                displayHistory();

            }

        }
    );


    pagination.appendChild(
        previousButton
    );


    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        const button =
            document.createElement("button");


        button.type = "button";
        button.textContent = page;


        if (
            page ===
            currentHistoryPage
        ) {

            button.classList.add(
                "active"
            );

        }


        button.addEventListener(
            "click",
            function () {

                currentHistoryPage =
                    page;

                displayHistory();

            }
        );


        pagination.appendChild(
            button
        );

    }


    const nextButton =
        document.createElement("button");


    nextButton.type = "button";
    nextButton.textContent = "›";


    nextButton.disabled =
        currentHistoryPage ===
        totalPages;


    nextButton.addEventListener(
        "click",
        function () {

            if (
                currentHistoryPage <
                totalPages
            ) {

                currentHistoryPage++;

                displayHistory();

            }

        }
    );


    pagination.appendChild(
        nextButton
    );

}


/* ==========================================
   FILTER EVENTS
========================================== */

historySearch.addEventListener(
    "input",
    function () {

        currentHistoryPage = 1;

        displayHistory();

    }
);


historyStatusFilter.addEventListener(
    "change",
    function () {

        currentHistoryPage = 1;

        displayHistory();

    }
);


historyDocumentFilter.addEventListener(
    "change",
    function () {

        currentHistoryPage = 1;

        displayHistory();

    }
);


historySortFilter.addEventListener(
    "change",
    function () {

        currentHistoryPage = 1;

        displayHistory();

    }
);


/* ==========================================
   HISTORY DATE FORMAT
========================================== */

function formatHistoryDate(dateString) {

    if (!dateString) {
        return "Not available";
    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    if (isNaN(date.getTime())) {
        return "Not available";
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
   VIEW HISTORY DETAILS
========================================== */

const historyDetailsModal =
    document.getElementById(
        "historyDetailsModal"
    );


const historyDetailsModalContent =
    document.querySelector(
        ".history-details-modal-content"
    );


const historyDetailsCloseBtn =
    document.querySelector(
        ".history-details-close-btn"
    );


const historyDetails =
    document.getElementById(
        "historyDetails"
    );


const historyMainContent =
    document.querySelector(
        ".main-content"
    );


function addHistoryViewListeners() {

    const viewButtons =
        document.querySelectorAll(
            ".history-view-btn"
        );


    viewButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const referenceNumber =
                    button.dataset.reference;


                const historyData =
                    getHistoryData();


                const historyRequest =
                    historyData.find(
                        function (item) {

                            return (
                                item.referenceNumber ===
                                referenceNumber
                            );

                        }
                    );


                if (!historyRequest) {
                    return;
                }


                const formattedDateRequested =
                    formatHistoryDate(
                        historyRequest.dateRequested
                    );


                const formattedDateCompleted =
                    formatHistoryDate(
                        historyRequest.dateCompleted
                    );


                const statusText =
                    historyRequest.status ===
                    "completed"
                        ? "Completed"
                        : "Rejected";


                historyDetails.innerHTML = `

                    <div class="history-detail-item">
                        <span class="history-detail-label">
                            Reference Number
                        </span>

                        <span class="history-detail-value">
                            ${historyRequest.referenceNumber}
                        </span>
                    </div>

                    <div class="history-detail-item">
                        <span class="history-detail-label">
                            Student Name
                        </span>

                        <span class="history-detail-value">
                            ${historyRequest.name}
                        </span>
                    </div>

                    <div class="history-detail-item">
                        <span class="history-detail-label">
                            Document Type
                        </span>

                        <span class="history-detail-value">
                            ${historyRequest.documentType}
                        </span>
                    </div>

                    <div class="history-detail-item">
                        <span class="history-detail-label">
                            Purpose
                        </span>

                        <span class="history-detail-value">
                            ${historyRequest.purpose || "Not provided"}
                        </span>
                    </div>

                    <div class="history-detail-item">
                        <span class="history-detail-label">
                            Number of Copies
                        </span>

                        <span class="history-detail-value">
                            ${historyRequest.copies || "Not provided"}
                        </span>
                    </div>

                    <div class="history-detail-item">
                        <span class="history-detail-label">
                            Delivery Method
                        </span>

                        <span class="history-detail-value">
                            ${historyRequest.deliveryMethod || "Pick Up at Registrar's Office"}
                        </span>
                    </div>

                    <div class="history-detail-item">
                        <span class="history-detail-label">
                            Payment Method
                        </span>

                        <span class="history-detail-value">
                            ${historyRequest.paymentMethod || "Not provided"}
                        </span>
                    </div>

                    <div class="history-detail-item">
                        <span class="history-detail-label">
                            Payment Reference Number
                        </span>

                        <span class="history-detail-value">
                            ${historyRequest.paymentReferenceNumber || "Not provided"}
                        </span>
                    </div>

                    <div class="history-detail-item">
                        <span class="history-detail-label">
                            Special Instructions
                        </span>

                        <span class="history-detail-value">
                            ${historyRequest.instructions || "None"}
                        </span>
                    </div>

                    <div class="history-detail-item">
                        <span class="history-detail-label">
                            Date Requested
                        </span>

                        <span class="history-detail-value">
                            ${formattedDateRequested}
                        </span>
                    </div>

                    <div class="history-detail-item">
                        <span class="history-detail-label">
                            Date Completed
                        </span>

                        <span class="history-detail-value">
                            ${formattedDateCompleted}
                        </span>
                    </div>

                    <div class="history-detail-item">
                        <span class="history-detail-label">
                            Pickup Date
                        </span>

                        <span class="history-detail-value">
                            ${formatHistoryDate(
                                historyRequest.pickupDate
                            )}
                        </span>
                    </div>

                    <div class="history-detail-item">
                        <span class="history-detail-label">
                            Status
                        </span>

                        <span class="history-detail-value">

                            <span class="history-detail-status ${historyRequest.status}">
                                ${statusText}
                            </span>

                        </span>
                    </div>

                `;


                historyDetailsModal.style.display =
                    "flex";


                historyDetailsModalContent.scrollTop =
                    0;


                requestAnimationFrame(
                    function () {

                        historyDetailsModalContent
                            .scrollTop = 0;

                    }
                );


                if (historyMainContent) {

                    historyMainContent.style
                        .overflowY = "hidden";

                }

            }
        );

    });

}


/* ==========================================
   CLOSE HISTORY DETAILS
========================================== */

function closeHistoryDetailsModal() {

    historyDetailsModal.style.display =
        "none";


    historyDetailsModalContent.scrollTop =
        0;


    if (historyMainContent) {

        historyMainContent.style.scrollTop =
            0;

        historyMainContent.style.overflowY =
            "auto";

    }


    document.body.style.overflow = "";

}


/* ==========================================
   CLOSE BUTTON
========================================== */

historyDetailsCloseBtn.addEventListener(
    "click",
    closeHistoryDetailsModal
);


/* ==========================================
   CLOSE WHEN CLICKING OUTSIDE
========================================== */

historyDetailsModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            historyDetailsModal
        ) {

            closeHistoryDetailsModal();

        }

    }
);


/* ==========================================
   UPDATE WHEN DATA CHANGES
========================================== */

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key === "staffDocumentHistory" ||
            event.key === "demoRequests" ||
            event.key === "documents"
        ) {

            loadHistoryDocumentFilter();

            currentHistoryPage = 1;

            displayHistory();

        }

    }
);


/* ==========================================
   INITIALIZE
========================================== */

loadHistoryDocumentFilter();

displayHistory();