# fetchAPI Action Handler
Use a flexible library to manage dynamic button clicks and form submissions.

## Usage

*Single Event Handler*
Add the following code to the `<head>` tags when you have only one event to trigger.
```
document.addEventListener('DOMContentLoaded', () => {
    try {
        const actionHandler = new ActionHandler({
            eventType: 'click', // Specify the event type
            selector: '.my-custom-button', // Specify a custom selector
            defaultUri: "path/to/file.php", // Default URI
            body: () => {
                const formData = new FormData();
                formData.append('customField', 'customValue');
                return formData; // FormData as the default
            }
        });
    } catch (error) {
        console.error(error.message);
    }
});
```

*Multiple Event Handlers*
Add the following code to the `<head>` tags when you want to include multiple event handlers.
```
function createActionHandlers() {
    const handlers = [
        {
            fieldName: 'status',
            eventType: 'change',
            defaultUri: "path/to/file.php"
        },
        {
            fieldName: 'team',
            eventType: 'change',
            defaultUri: "path/to/file.php"
        },
    ];

    handlers.forEach(config => {
        const container = formContainers[config.fieldName];
        if (container) {
            try {
                // Check if this is a button click event handler
                const selector = config.buttonSelector || `#account${config.fieldName.charAt(0).toUpperCase() + config.fieldName.slice(1)}`;
                new ActionHandler({
                    selector: selector,
                    eventType: config.eventType,
                    defaultUri: config.defaultUri,
                    body: () => {
                        const formData = new FormData();
                        formData.append(container.name, container.value); // Append value of the current field
                        return formData;
                    }
                });
            } catch (error) {
                console.error(error.message);
            }
        }
    });
}
```

Call the function to create action handlers
```
document.addEventListener('DOMContentLoaded', createActionHandlers);
```
