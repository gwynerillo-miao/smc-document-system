/* ==========================================
   DOCUMENT TABLE
========================================== */

const documentTableBody = document.getElementById("documentTableBody");

function displayDocuments() {

    documentTableBody.innerHTML = "";

    documents.forEach(function (document, index) {

        documentTableBody.innerHTML += `
            <tr>
                <td>${document[0]}</td>
                <td>${document[3] || "Registrar"}</td>
                <td>${document[1]}</td>
                <td>${document[2]}</td>
                <td>
                    <button type="button" class="edit-document-btn" data-index="${index}">
                        Edit
                    </button>
                </td>
            </tr>
        `;

    });

}

displayDocuments();


/* ==========================================
   ADD DOCUMENT MODAL
========================================== */

const addDocumentBtn = document.querySelector(".add-document-btn");
const addDocumentModal = document.getElementById("addDocumentModal");
const cancelAddDocument = document.getElementById("cancelAddDocument");
const saveDocument = document.getElementById("saveDocument");

const documentName = document.getElementById("documentName");
const documentAssignedStaff = document.getElementById("documentAssignedStaff");
const documentPrice = document.getElementById("documentPrice");
const documentProcessingTime = document.getElementById("documentProcessingTime");

function clearDocumentForm() {

    documentName.value = "";
    documentAssignedStaff.value = "";
    documentPrice.value = "";
    documentProcessingTime.value = "";

}

addDocumentBtn.addEventListener("click", function () {

    clearDocumentForm();

    addDocumentModal.classList.add("show");

    documentName.focus();

});


cancelAddDocument.addEventListener("click", function () {

    addDocumentModal.classList.remove("show");

    clearDocumentForm();

});


/* ==========================================
   ADD DOCUMENT CONFIRMATION
========================================== */

const confirmDocumentModal =
    document.getElementById("confirmDocumentModal");

const cancelConfirmDocument =
    document.getElementById("cancelConfirmDocument");

const confirmAddDocument =
    document.getElementById("confirmAddDocument");


saveDocument.addEventListener("click", function () {

    if (
        documentName.value.trim() === "" ||
        documentAssignedStaff.value === "" ||
        documentPrice.value === "" ||
        documentProcessingTime.value === ""
    ) {
        return;
    }

    addDocumentModal.classList.remove("show");

    confirmDocumentModal.classList.add("show");

});


cancelConfirmDocument.addEventListener("click", function () {

    confirmDocumentModal.classList.remove("show");

    addDocumentModal.classList.add("show");

});


confirmAddDocument.addEventListener("click", function () {

    const name =
        documentName.value.trim();

    const assignedStaff =
        documentAssignedStaff.value;

    const price =
        Number(documentPrice.value);

    const processingTime =
        Number(documentProcessingTime.value);


    documents.push([
        name,
        `₱${price.toFixed(2)}`,
        `After ${processingTime} working days`,
        assignedStaff
    ]);


    localStorage.setItem(
        "documents",
        JSON.stringify(documents)
    );


    addActivity(
        "+",
        "Document type added",
        name + " was added to the document settings."
    );


    displayDocuments();

    confirmDocumentModal.classList.remove("show");

    clearDocumentForm();

});


/* ==========================================
   EDIT DOCUMENT MODAL
========================================== */

const editDocumentModal =
    document.getElementById("editDocumentModal");

const editDocumentName =
    document.getElementById("editDocumentName");

const editDocumentAssignedStaff =
    document.getElementById("editDocumentAssignedStaff");

const editDocumentPrice =
    document.getElementById("editDocumentPrice");

const editDocumentProcessingTime =
    document.getElementById("editDocumentProcessingTime");

const cancelEditDocument =
    document.getElementById("cancelEditDocument");

const saveEditDocument =
    document.getElementById("saveEditDocument");

const deleteDocument =
    document.getElementById("deleteDocument");

let selectedDocumentIndex = null;


/* ==========================================
   OPEN EDIT MODAL
========================================== */

documentTableBody.addEventListener("click", function (event) {

    if (!event.target.classList.contains("edit-document-btn")) {
        return;
    }


    selectedDocumentIndex =
        Number(event.target.dataset.index);


    const document =
        documents[selectedDocumentIndex];


    editDocumentName.value =
        document[0];


    editDocumentAssignedStaff.value =
        document[3] || "Registrar";


    editDocumentPrice.value =
        document[1].replace("₱", "");


    editDocumentProcessingTime.value =
        document[2].replace(/\D/g, "");


    editDocumentModal.classList.add("show");

});


/* ==========================================
   CANCEL EDIT
========================================== */

cancelEditDocument.addEventListener("click", function () {

    editDocumentModal.classList.remove("show");

    selectedDocumentIndex = null;

});


/* ==========================================
   SAVE EDIT
========================================== */

const confirmEditModal =
    document.getElementById("confirmEditModal");

const cancelConfirmEdit =
    document.getElementById("cancelConfirmEdit");

const confirmEdit =
    document.getElementById("confirmEdit");


saveEditDocument.addEventListener("click", function () {

    if (
        editDocumentAssignedStaff.value === "" ||
        editDocumentPrice.value === "" ||
        editDocumentProcessingTime.value === ""
    ) {
        return;
    }


    editDocumentModal.classList.remove("show");

    confirmEditModal.classList.add("show");

});


cancelConfirmEdit.addEventListener("click", function () {

    confirmEditModal.classList.remove("show");

    editDocumentModal.classList.add("show");

});


confirmEdit.addEventListener("click", function () {

    if (selectedDocumentIndex === null) {
        return;
    }


    const assignedStaff =
        editDocumentAssignedStaff.value;

    const price =
        Number(editDocumentPrice.value);

    const processingTime =
        Number(editDocumentProcessingTime.value);


    documents[selectedDocumentIndex][1] =
        `₱${price.toFixed(2)}`;


    documents[selectedDocumentIndex][2] =
        `After ${processingTime} working days`;


    documents[selectedDocumentIndex][3] =
        assignedStaff;


    localStorage.setItem(
        "documents",
        JSON.stringify(documents)
    );


    addActivity(
        "✎",
        "Document settings updated",
        documents[selectedDocumentIndex][0] +
        " settings were updated."
    );


    displayDocuments();

    confirmEditModal.classList.remove("show");

    selectedDocumentIndex = null;

});


/* ==========================================
   DELETE DOCUMENT
========================================== */

const confirmDeleteModal =
    document.getElementById("confirmDeleteModal");

const cancelConfirmDelete =
    document.getElementById("cancelConfirmDelete");

const confirmDelete =
    document.getElementById("confirmDelete");


deleteDocument.addEventListener("click", function () {

    editDocumentModal.classList.remove("show");

    confirmDeleteModal.classList.add("show");

});


cancelConfirmDelete.addEventListener("click", function () {

    confirmDeleteModal.classList.remove("show");

    editDocumentModal.classList.add("show");

});


confirmDelete.addEventListener("click", function () {

    if (selectedDocumentIndex === null) {
        return;
    }


    const deletedDocumentName =
        documents[selectedDocumentIndex][0];


    /* SAVE DELETED DOCUMENT FOR HISTORY */

    const deletedDocuments =
        JSON.parse(
            localStorage.getItem("deletedDocuments")
        ) || [];


    if (!deletedDocuments.includes(deletedDocumentName)) {

        deletedDocuments.push(
            deletedDocumentName
        );

    }


    localStorage.setItem(
        "deletedDocuments",
        JSON.stringify(deletedDocuments)
    );


    /* REMOVE FROM CURRENT DOCUMENT SETTINGS */

    documents.splice(
        selectedDocumentIndex,
        1
    );


    localStorage.setItem(
        "documents",
        JSON.stringify(documents)
    );


    addActivity(
        "×",
        "Document type deleted",
        deletedDocumentName +
        " was removed from the document settings."
    );


    displayDocuments();

    confirmDeleteModal.classList.remove("show");

    selectedDocumentIndex = null;

});


/* ==========================================
   CLOSE MODALS BY CLICKING OUTSIDE
========================================== */

addDocumentModal.addEventListener("click", function (event) {

    if (event.target === addDocumentModal) {

        addDocumentModal.classList.remove("show");

        clearDocumentForm();

    }

});


confirmDocumentModal.addEventListener("click", function (event) {

    if (event.target === confirmDocumentModal) {

        confirmDocumentModal.classList.remove("show");

        clearDocumentForm();

    }

});


editDocumentModal.addEventListener("click", function (event) {

    if (event.target === editDocumentModal) {

        editDocumentModal.classList.remove("show");

        selectedDocumentIndex = null;

    }

});


confirmEditModal.addEventListener("click", function (event) {

    if (event.target === confirmEditModal) {

        confirmEditModal.classList.remove("show");

        selectedDocumentIndex = null;

    }

});


confirmDeleteModal.addEventListener("click", function (event) {

    if (event.target === confirmDeleteModal) {

        confirmDeleteModal.classList.remove("show");

        selectedDocumentIndex = null;

    }

});