/* ==========================================
   CREATE ANNOUNCEMENT MODAL
========================================== */

const createAnnouncementBtn =
    document.querySelector(".create-announcement-btn");

const createAnnouncementModal =
    document.getElementById("createAnnouncementModal");

const announcementTitle =
    document.getElementById("announcementTitle");

const announcementMessage =
    document.getElementById("announcementMessage");

const announcementTitleError =
    document.getElementById("announcementTitleError");

const announcementMessageError =
    document.getElementById("announcementMessageError");

const cancelAnnouncement =
    document.getElementById("cancelAnnouncement");

const publishAnnouncement =
    document.getElementById("publishAnnouncement");


function clearAnnouncementForm() {

    announcementTitle.value = "";
    announcementMessage.value = "";

    announcementTitleError.textContent = "";
    announcementMessageError.textContent = "";

}


createAnnouncementBtn.addEventListener("click", function () {

    clearAnnouncementForm();

    createAnnouncementModal.classList.add("show");

    announcementTitle.focus();

});


cancelAnnouncement.addEventListener("click", function () {

    createAnnouncementModal.classList.remove("show");

    clearAnnouncementForm();

});


/* ==========================================
   PUBLISH CONFIRMATION
========================================== */

const confirmAnnouncementModal =
    document.getElementById("confirmAnnouncementModal");

const cancelConfirmAnnouncement =
    document.getElementById("cancelConfirmAnnouncement");

const confirmPublishAnnouncement =
    document.getElementById("confirmPublishAnnouncement");


publishAnnouncement.addEventListener("click", function () {

    let hasError = false;

    announcementTitleError.textContent = "";
    announcementMessageError.textContent = "";


    if (announcementTitle.value.trim() === "") {

        announcementTitleError.textContent =
            "Please enter an announcement title.";

        hasError = true;

    }


    if (announcementMessage.value.trim() === "") {

        announcementMessageError.textContent =
            "Please enter an announcement message.";

        hasError = true;

    }


    if (hasError) {
        return;
    }


    createAnnouncementModal.classList.remove("show");

    confirmAnnouncementModal.classList.add("show");

});


cancelConfirmAnnouncement.addEventListener("click", function () {

    confirmAnnouncementModal.classList.remove("show");

    createAnnouncementModal.classList.add("show");

});


confirmPublishAnnouncement.addEventListener("click", function () {

    const newAnnouncement = {
        id: Date.now(),
        title: announcementTitle.value.trim(),
        message: announcementMessage.value.trim(),
        date: new Date().toISOString().split("T")[0]
    };


    announcements.push(newAnnouncement);


    localStorage.setItem(
        "demoAnnouncements",
        JSON.stringify(announcements)
    );

    addActivity(
        "▣",
        "Announcement published",
        newAnnouncement.title + " was published."
    );


    displayAnnouncements();


    confirmAnnouncementModal.classList.remove("show");

    clearAnnouncementForm();

});


/* ==========================================
   ANNOUNCEMENT LIST
========================================== */

const announcementList =
    document.getElementById("announcementList");

const announcementCount =
    document.getElementById("announcementCount");

const announcementSort =
    document.getElementById("announcementSort");


function displayAnnouncements() {

    announcementList.innerHTML = "";


    /* ==========================================
       UPDATE ANNOUNCEMENT COUNT
    ========================================== */

    const count = announcements.length;

    if (count === 1) {

        announcementCount.textContent =
            "1 published announcement";

    } else {

        announcementCount.textContent =
            `${count} published announcements`;

    }


    /* ==========================================
       NO ANNOUNCEMENTS
    ========================================== */

    if (announcements.length === 0) {

        announcementList.innerHTML = `
            <div class="no-announcements">

                <div class="no-announcement-icon">📢</div>

                <h3>No announcements yet</h3>

                <p>
                    Create an announcement to display it to students.
                </p>

            </div>
        `;

        return;
    }


    /* ==========================================
       SORT ANNOUNCEMENTS
    ========================================== */

    const sortedAnnouncements =
        [...announcements].sort(function (a, b) {

            if (announcementSort.value === "newest") {

                return new Date(b.date) - new Date(a.date)
                    || b.id - a.id;

            }

            return new Date(a.date) - new Date(b.date);

        });


    /* ==========================================
       DISPLAY ANNOUNCEMENTS
    ========================================== */

    sortedAnnouncements.forEach(function (announcement) {

        const formattedDate =
            new Date(announcement.date + "T00:00:00")
                .toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                });


        announcementList.innerHTML += `
            <div class="announcement-card">

                <div class="announcement-card-header">

                    <div>
                        <h3>${announcement.title}</h3>

                        <span class="announcement-date">
                            ${formattedDate}
                        </span>
                    </div>

                    <span class="announcement-status">
                        Published
                    </span>

                </div>


                <p class="announcement-message">
                    ${announcement.message}
                </p>


                <div class="announcement-card-actions">

                    <button
                        type="button"
                        class="announcement-edit-btn"
                        data-index="${announcements.indexOf(announcement)}">
                        Edit
                    </button>

                    <button
                        type="button"
                        class="announcement-delete-btn"
                        data-index="${announcements.indexOf(announcement)}">
                        Delete
                    </button>

                </div>

            </div>
        `;

    });

}

displayAnnouncements();

announcementSort.addEventListener("change", function () {

    displayAnnouncements();

});


/* ==========================================
   EDIT ANNOUNCEMENT
========================================== */

const editAnnouncementModal =
    document.getElementById("editAnnouncementModal");

const editAnnouncementTitle =
    document.getElementById("editAnnouncementTitle");

const editAnnouncementMessage =
    document.getElementById("editAnnouncementMessage");

const editAnnouncementTitleError =
    document.getElementById("editAnnouncementTitleError");

const editAnnouncementMessageError =
    document.getElementById("editAnnouncementMessageError");

const cancelEditAnnouncement =
    document.getElementById("cancelEditAnnouncement");

const saveEditAnnouncement =
    document.getElementById("saveEditAnnouncement");


let selectedAnnouncementIndex = null;


/* ==========================================
   OPEN EDIT MODAL
========================================== */

announcementList.addEventListener("click", function (event) {

    if (!event.target.classList.contains("announcement-edit-btn")) {
        return;
    }


    selectedAnnouncementIndex =
        Number(event.target.dataset.index);


    const announcement =
        announcements[selectedAnnouncementIndex];


    editAnnouncementTitle.value =
        announcement.title;

    editAnnouncementMessage.value =
        announcement.message;


    editAnnouncementTitleError.textContent = "";
    editAnnouncementMessageError.textContent = "";


    editAnnouncementModal.classList.add("show");

    editAnnouncementTitle.focus();

});


/* ==========================================
   CANCEL EDIT
========================================== */

cancelEditAnnouncement.addEventListener("click", function () {

    editAnnouncementModal.classList.remove("show");

    selectedAnnouncementIndex = null;

});


/* ==========================================
   SAVE EDIT
========================================== */

const confirmEditAnnouncementModal =
    document.getElementById("confirmEditAnnouncementModal");

const cancelConfirmEditAnnouncement =
    document.getElementById("cancelConfirmEditAnnouncement");

const confirmEditAnnouncement =
    document.getElementById("confirmEditAnnouncement");


saveEditAnnouncement.addEventListener("click", function () {

    let hasError = false;

    editAnnouncementTitleError.textContent = "";
    editAnnouncementMessageError.textContent = "";


    if (editAnnouncementTitle.value.trim() === "") {

        editAnnouncementTitleError.textContent =
            "Please enter an announcement title.";

        hasError = true;

    }


    if (editAnnouncementMessage.value.trim() === "") {

        editAnnouncementMessageError.textContent =
            "Please enter an announcement message.";

        hasError = true;

    }


    if (hasError) {
        return;
    }


    editAnnouncementModal.classList.remove("show");

    confirmEditAnnouncementModal.classList.add("show");

});


/* ==========================================
   CANCEL EDIT CONFIRMATION
========================================== */

cancelConfirmEditAnnouncement.addEventListener("click", function () {

    confirmEditAnnouncementModal.classList.remove("show");

    editAnnouncementModal.classList.add("show");

});


/* ==========================================
   CONFIRM EDIT
========================================== */

confirmEditAnnouncement.addEventListener("click", function () {

    announcements[selectedAnnouncementIndex].title =
        editAnnouncementTitle.value.trim();

    announcements[selectedAnnouncementIndex].message =
        editAnnouncementMessage.value.trim();

    localStorage.setItem(
        "demoAnnouncements",
        JSON.stringify(announcements)
    );

    displayAnnouncements();


    confirmEditAnnouncementModal.classList.remove("show");

    selectedAnnouncementIndex = null;

});


/* ==========================================
   DELETE ANNOUNCEMENT
========================================== */

const confirmDeleteAnnouncementModal =
    document.getElementById("confirmDeleteAnnouncementModal");

const cancelDeleteAnnouncement =
    document.getElementById("cancelDeleteAnnouncement");

const confirmDeleteAnnouncement =
    document.getElementById("confirmDeleteAnnouncement");


/* ==========================================
   OPEN DELETE CONFIRMATION
========================================== */

announcementList.addEventListener("click", function (event) {

    if (!event.target.classList.contains("announcement-delete-btn")) {
        return;
    }


    selectedAnnouncementIndex =
        Number(event.target.dataset.index);


    confirmDeleteAnnouncementModal.classList.add("show");

});


/* ==========================================
   CANCEL DELETE
========================================== */

cancelDeleteAnnouncement.addEventListener("click", function () {

    confirmDeleteAnnouncementModal.classList.remove("show");

    selectedAnnouncementIndex = null;

});


/* ==========================================
   CONFIRM DELETE
========================================== */

confirmDeleteAnnouncement.addEventListener("click", function () {

    announcements.splice(selectedAnnouncementIndex, 1);

    localStorage.setItem(
        "demoAnnouncements",
        JSON.stringify(announcements)
    );

    displayAnnouncements();

    confirmDeleteAnnouncementModal.classList.remove("show");

    selectedAnnouncementIndex = null;

});


/* ==========================================
   CLOSE MODALS BY CLICKING OUTSIDE
========================================== */

createAnnouncementModal.addEventListener("click", function (event) {

    if (event.target === createAnnouncementModal) {

        createAnnouncementModal.classList.remove("show");

        clearAnnouncementForm();

    }

});


confirmAnnouncementModal.addEventListener("click", function (event) {

    if (event.target === confirmAnnouncementModal) {

        confirmAnnouncementModal.classList.remove("show");

        clearAnnouncementForm();

    }

});


editAnnouncementModal.addEventListener("click", function (event) {

    if (event.target === editAnnouncementModal) {

        editAnnouncementModal.classList.remove("show");

        selectedAnnouncementIndex = null;

    }

});


confirmEditAnnouncementModal.addEventListener("click", function (event) {

    if (event.target === confirmEditAnnouncementModal) {

        confirmEditAnnouncementModal.classList.remove("show");

        selectedAnnouncementIndex = null;

    }

});


confirmDeleteAnnouncementModal.addEventListener("click", function (event) {

    if (event.target === confirmDeleteAnnouncementModal) {

        confirmDeleteAnnouncementModal.classList.remove("show");

        selectedAnnouncementIndex = null;

    }

});