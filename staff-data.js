/* ==========================================
   STAFF RECENT DOCUMENT ACTIVITY
========================================== */

let staffRecentActivities =
    JSON.parse(localStorage.getItem("staffRecentActivities"));

/* ==========================================
   INITIAL DOCUMENT ACTIVITIES
========================================== */

if (!staffRecentActivities) {

    staffRecentActivities = [];

    const staffRequests =
        JSON.parse(localStorage.getItem("demoRequests")) || [];

    staffRequests
        .slice(0, 7)
        .forEach(function (request) {

            let icon = "⚙";
            let title = "Document request updated";
            let description =
                request.name + " — " +
                request.documentType +
                " is currently " +
                request.status + ".";

            if (request.status === "Pending Review") {

                icon = "•";
                title = "New document request";
                description =
                    request.name + " requested " +
                    request.documentType + ".";

            } else if (
                request.status === "Payment Required" ||
                request.status === "Pending Payment"
            ) {

                icon = "✓";
                title = "Document request approved";
                description =
                    request.name + " — " +
                    request.documentType +
                    " is pending payment.";

            } else if (request.status === "Processing") {

                icon = "⚙";
                title = "Document request processing";
                description =
                    request.name + " — " +
                    request.documentType +
                    " is being processed.";

            } else if (request.status === "Ready for Pickup") {

                icon = "✓";
                title = "Document ready for pickup";
                description =
                    request.name + " — " +
                    request.documentType +
                    " is ready for pickup.";
            }

            staffRecentActivities.push({
                id: Date.now() + staffRecentActivities.length,
                icon: icon,
                title: title,
                description: description,
                date: new Date(
                    (request.dateRequested || new Date().toISOString().split("T")[0]) +
                    "T00:00:00"
                ).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric"
                })
            });

        });

    staffRecentActivities =
        staffRecentActivities.slice(0, 7);

    localStorage.setItem(
        "staffRecentActivities",
        JSON.stringify(staffRecentActivities)
    );
}

/* ==========================================
   ADD STAFF ACTIVITY
========================================== */

function addStaffActivity(icon, title, description) {

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

    staffRecentActivities.unshift(activity);

    staffRecentActivities =
        staffRecentActivities.slice(0, 7);

    localStorage.setItem(
        "staffRecentActivities",
        JSON.stringify(staffRecentActivities)
    );
}