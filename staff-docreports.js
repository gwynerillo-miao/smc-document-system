/* ==========================================
   DOCUMENT REPORTS
========================================== */

const totalRequests =
    document.getElementById("totalRequests");

const pendingReviewRequests =
    document.getElementById("pendingReviewRequests");

const pendingPaymentRequests =
    document.getElementById("pendingPaymentRequests");

const processingRequests =
    document.getElementById("processingRequests");

const readyForPickupRequests =
    document.getElementById("readyForPickupRequests");

const completedRequests =
    document.getElementById("completedRequests");

const rejectedRequests =
    document.getElementById("rejectedRequests");

const chartTotal =
    document.getElementById("chartTotal");

const pieChart =
    document.querySelector(".pie-chart");

const sortPicker =
    document.getElementById("sortPicker");

const sortValue =
    document.getElementById("sortValue");

const monthPicker =
    document.getElementById("monthPicker");


/* ==========================================
   GET LOGGED-IN STAFF ROLE
========================================== */

const reportRole =
    (sessionStorage.getItem("role") || "").toLowerCase();


const reportDocuments =
    JSON.parse(
        localStorage.getItem("documents")
    ) || [];


/* ==========================================
   CHECK DOCUMENT ASSIGNMENT
========================================== */

function isReportDocumentAssigned(documentType) {

    const documentSettings =
        reportDocuments.find(function (document) {

            return document[0] === documentType;

        });

    if (!documentSettings) {
        return false;
    }

    const assignedRole =
        String(
            documentSettings[3] || ""
        ).toLowerCase();

    return assignedRole === reportRole;
}


/* ==========================================
   GET REPORT DATA
========================================== */

function getReportData() {

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


    const combinedRequests = [];

    const referenceNumbers =
        new Set();


    currentRequests.forEach(function (request) {

        if (
            !referenceNumbers.has(
                request.referenceNumber
            ) &&
            isReportDocumentAssigned(
                request.documentType
            )
        ) {

            referenceNumbers.add(
                request.referenceNumber
            );


            combinedRequests.push({

                ...request,

                reportStatus:
                    request.status,

                reportDate:
                    request.dateRequested

            });

        }

    });


    historyRequests.forEach(function (request) {

        if (
            !referenceNumbers.has(
                request.referenceNumber
            ) &&
            isReportDocumentAssigned(
                request.documentType
            )
        ) {

            referenceNumbers.add(
                request.referenceNumber
            );


            combinedRequests.push({

                ...request,

                reportStatus:
                    request.status
                        .toLowerCase() ===
                    "completed"
                        ? "Completed"
                        : request.status
                            .toLowerCase() ===
                          "rejected"
                            ? "Rejected"
                            : request.status,

                reportDate:
                    request.dateRequested

            });

        }

    });


    return combinedRequests;
}


/* ==========================================
   FILTER REPORT DATA
========================================== */

function getFilteredReportData() {

    const data =
        getReportData();


    const selectedMonth =
        monthPicker.value;


    if (!selectedMonth) {
        return data;
    }


    return data.filter(function (request) {

        return (
            request.reportDate &&
            request.reportDate.startsWith(
                selectedMonth
            )
        );

    });

}


/* ==========================================
   UPDATE REPORT
========================================== */

function updateReports() {

    const data =
        getFilteredReportData();


    let pendingReview = 0;
    let pendingPayment = 0;
    let processing = 0;
    let readyForPickup = 0;
    let completed = 0;
    let rejected = 0;


    data.forEach(function (request) {

        switch (request.reportStatus) {

            case "Pending Review":
                pendingReview++;
                break;

            case "Payment Required":
                pendingPayment++;
                break;

            case "Processing":
                processing++;
                break;

            case "Ready for Pickup":
                readyForPickup++;
                break;

            case "Completed":
                completed++;
                break;

            case "Rejected":
                rejected++;
                break;

        }

    });


    const total =
        data.length;


    /* ==========================================
       UPDATE SUMMARY
    ========================================== */

    totalRequests.textContent =
        total;

    pendingReviewRequests.textContent =
        pendingReview;

    pendingPaymentRequests.textContent =
        pendingPayment;

    processingRequests.textContent =
        processing;

    readyForPickupRequests.textContent =
        readyForPickup;

    completedRequests.textContent =
        completed;

    rejectedRequests.textContent =
        rejected;

    chartTotal.textContent =
        total;


    /* ==========================================
       UPDATE PIE CHART
    ========================================== */

    updatePieChart(
        pendingReview,
        pendingPayment,
        processing,
        readyForPickup,
        completed,
        rejected,
        total
    );


    updateDocumentTypeReport();

}


/* ==========================================
   PIE CHART
========================================== */

function updatePieChart(
    pendingReview,
    pendingPayment,
    processing,
    readyForPickup,
    completed,
    rejected,
    total
) {

    if (total === 0) {

        pieChart.style.background =
            "#e5e9e7";

        return;

    }


    const values = [
        pendingReview,
        pendingPayment,
        processing,
        readyForPickup,
        completed,
        rejected
    ];


    const colors = [
        "#e67e22",
        "#8e44ad",
        "#e5b700",
        "#2980b9",
        "#13563a",
        "#b42318"
    ];


    let currentDegree = 0;

    const sections = [];


    values.forEach(function (value, index) {

        if (value === 0) {
            return;
        }


        const degree =
            (value / total) * 360;


        const nextDegree =
            currentDegree + degree;


        sections.push(
            colors[index] +
            " " +
            currentDegree +
            "deg " +
            nextDegree +
            "deg"
        );


        currentDegree =
            nextDegree;

    });


    pieChart.style.background =
        "conic-gradient(" +
        sections.join(", ") +
        ")";

}


/* ==========================================
   DOCUMENT TYPE REPORT
========================================== */

const documentTypeChart =
    document.getElementById(
        "documentTypeChart"
    );


function updateDocumentTypeReport() {

    if (!documentTypeChart) {
        return;
    }


    const selectedMonth =
        monthPicker.value ||
        "";


    /* ==========================================
       ONLY STAFF-ASSIGNED DOCUMENTS
    ========================================== */

    const assignedDocuments =
        reportDocuments.filter(
            function (document) {

                const assignedRole =
                    String(
                        document[3] || ""
                    ).toLowerCase();

                return (
                    assignedRole ===
                    reportRole
                );

            }
        );


    const documentCounts = {};


    assignedDocuments.forEach(
        function (document) {

            const documentType =
                document[0];

            documentCounts[
                documentType
            ] = 0;

        }
    );


    /* ==========================================
       GET REQUESTS
    ========================================== */

    const currentRequests =
        JSON.parse(
            localStorage.getItem(
                "demoRequests"
            )
        ) || [];


    const historyRequests =
        JSON.parse(
            localStorage.getItem(
                "staffDocumentHistory"
            )
        ) || [];


    const allRequests = [];

    const referenceNumbers =
        new Set();


    currentRequests.forEach(
        function (request) {

            if (
                !referenceNumbers.has(
                    request.referenceNumber
                ) &&
                isReportDocumentAssigned(
                    request.documentType
                )
            ) {

                referenceNumbers.add(
                    request.referenceNumber
                );

                allRequests.push(request);

            }

        }
    );


    historyRequests.forEach(
        function (request) {

            if (
                !referenceNumbers.has(
                    request.referenceNumber
                ) &&
                isReportDocumentAssigned(
                    request.documentType
                )
            ) {

                referenceNumbers.add(
                    request.referenceNumber
                );

                allRequests.push(request);

            }

        }
    );


    /* ==========================================
       COUNT DOCUMENT REQUESTS
    ========================================== */

    allRequests.forEach(
        function (request) {

            if (
                selectedMonth &&
                (
                    !request.dateRequested ||
                    !request.dateRequested
                        .startsWith(
                            selectedMonth
                        )
                )
            ) {

                return;

            }


            const status =
                (
                    request.status ||
                    ""
                ).toLowerCase();


            const countedStatuses = [

                "payment required",
                "processing",
                "ready for pickup",
                "completed"

            ];


            if (
                countedStatuses.includes(
                    status
                ) &&
                request.documentType &&
                Object.prototype.hasOwnProperty.call(
                    documentCounts,
                    request.documentType
                )
            ) {

                documentCounts[
                    request.documentType
                ]++;

            }

        }
    );


    /* ==========================================
       SORT HIGHEST TO LOWEST
    ========================================== */

    const sortedDocuments =
        Object.entries(
            documentCounts
        ).sort(function (a, b) {

            return b[1] - a[1];

        });


    const highestCount =
        sortedDocuments.length
            ? sortedDocuments[0][1]
            : 0;


    documentTypeChart.innerHTML =
        "";


    if (!sortedDocuments.length) {

        documentTypeChart.innerHTML =
            "<p>No document types available.</p>";

        return;

    }


    /* ==========================================
       DISPLAY DOCUMENT TYPES
    ========================================== */

    sortedDocuments.forEach(
        function (item) {

            const documentType =
                item[0];

            const count =
                item[1];


            const width =
                highestCount > 0
                    ? (
                        count /
                        highestCount
                    ) * 100
                    : 0;


            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "document-type-row";


            row.innerHTML = `
                <div class="document-type-name">
                    ${documentType}
                </div>

                <div class="document-type-bar-container">
                    <div
                        class="document-type-bar"
                        style="width: ${width}%;">
                    </div>
                </div>

                <div class="document-type-count">
                    ${count}
                </div>
            `;


            documentTypeChart.appendChild(
                row
            );

        }
    );

}


/* ==========================================
   MONTH FILTER
========================================== */

monthPicker.addEventListener(
    "change",
    function () {

        if (monthPicker.value) {

            const date =
                new Date(
                    monthPicker.value +
                    "-01"
                );


            const monthName =
                date.toLocaleDateString(
                    "en-US",
                    {
                        month: "long",
                        year: "numeric"
                    }
                );


            sortValue.textContent =
                monthName;

        } else {

            sortValue.textContent =
                "All Time";

        }


        updateReports();

    }
);


/* ==========================================
   SORT PICKER
========================================== */

sortPicker.addEventListener(
    "click",
    function () {

        monthPicker.showPicker();

    }
);


/* ==========================================
   UPDATE WHEN DATA CHANGES
========================================== */

window.addEventListener(
    "storage",
    function (event) {

        if (
            event.key === "demoRequests" ||
            event.key === "staffDocumentHistory" ||
            event.key === "documents"
        ) {

            updateReports();

        }

    }
);


/* ==========================================
   INITIAL REPORT
========================================== */

updateReports();