class ActionHandler {
    constructor(options = {}) {
        // Default options and customizable settings
        this.options = Object.assign({
            eventType: 'click', // Default event type
            selector: '.adminPanel__perform-action', // Default selector
            confirmMessages: {
                approve: "Are you sure you want to give this person access to an account?",
                reject: "Are you sure this person does not require an account?"
            },
            uris: {
                approve: null,
                reject: null
            },
            defaultUri: "path/to/file.php", // Default URI if neither approve nor reject is provided
            toastOptions: {
                borderColour: 'darkgreen',
                textColour: 'darkgreen'
            },
            // Customizable body option with FormData as default
            body: () => {
                const formData = new FormData();
                // Add default fields here if necessary
                return formData;
            }
        }, options);

        this.errMsgList = [];

        // Ensure there's at least one actionable URI
        if (!this.options.uris.approve && !this.options.uris.reject && !this.options.defaultUri) {
            throw new Error("At least one URI must be provided.");
        }

        this.initialize(); // Initialize event listeners upon creation
    }

    initialize() {
        document.querySelectorAll(this.options.selector).forEach(btn => {
            btn.addEventListener(this.options.eventType, (e) => {
                const action = btn.dataset.action || this.options.defaultUri; // Use defaultUri if dataset.action doesn't exist
                this.actionRequest(btn, action);
            });
        });
    }

    async actionRequest(event, action) {
        const approveUri = this.options.uris.approve;
        const rejectUri = this.options.uris.reject;
        let gotoUri = approveUri || rejectUri || this.options.defaultUri;

        // Confirm action if a message is defined
        const confirmMessage = this.options.confirmMessages[action] || this.options.confirmMessages.reject;
        const actionResult = confirm(confirmMessage);

        if (!actionResult) return;

        this.clearErrors();

        const body = this.options.body();

        try {
            const response = await fetch(gotoUri, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    "Content-Type": this.options.body() instanceof FormData ? "multipart/form-data" : "application/x-www-form-urlencoded"
                },
                body
            });

            const data = await response.json();

            if (data.status === 'ok') {
                const actionMsg = action === "approve" ? "User Approved!" : "Request Deleted!";
                this.toastMessage(`<i class="fa-solid fa-circle-check" style="color:darkgreen;"></i> ${actionMsg}`, this.options.toastOptions);
            } else {
                this.handleErrors(data.errors, event);
            }
        } catch (error) {
            console.error(error);
        }
    }

    handleErrors(errors, target) {
        let firstElem;
        let i = 1;

        target.style.borderColor = "#c03";
        this.toastMessage('<i class="fa-solid fa-circle-x" style="color:#c03;"></i> Something went wrong!');

        errors.forEach(err => {
            const errorName = err.src;
            const errorMsg = err.msg;
            const elem = document.querySelector(`#${errorName}`);

            elem.style.borderColor = '#c03';
            elem.classList.add("inputErrorIcon");
            elem.insertAdjacentHTML('afterend', `<p id="showError${errorName}" class="errorText fontSize12">${errorMsg}</p>`);
            this.errMsgList.push(document.querySelector(`#showError${errorName}`));

            if (i === 1) {
                firstElem = elem;
            }
            i++;
        });

        if (firstElem) {
            firstElem.scrollIntoView({ behavior: 'smooth' });
        }
    }

    clearErrors() {
        this.errMsgList.forEach(item => item.remove());
        this.errMsgList = [];
    }

    toastMessage(message, options = {}) {
        // Implement your toast notification logic here
        console.log("Toast Message: ", message);
    }
}
