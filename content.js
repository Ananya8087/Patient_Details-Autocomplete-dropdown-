// Fetch the medicines data
fetch(chrome.runtime.getURL('medicines.json'))
    .then(response => {
        console.log('Fetched medicines.json');
        return response.json();
    })
    .then(medicines => {
        console.log('Medicines data parsed', medicines);

        // Add event listener to the document to handle input events
        document.addEventListener('input', function(event) {
            const inputField = event.target;

            // Check if the input field matches the selector criteria
            if (inputField.matches('input.p-inputtext.p-component.subm_field.form-control')) {
                console.log('Input event detected');
                const query = inputField.value.toLowerCase().trim();
                console.log('Query:', query);

                // Create the dropdown
                const dropdown = document.createElement('ul');
                dropdown.classList.add('autocomplete-dropdown');
                inputField.parentElement.appendChild(dropdown); // Append to the parent of the input field
                console.log('Dropdown created and appended to body');

                dropdown.innerHTML = ''; // Clear previous dropdown items

                if (query) {
                    const filteredMedicines = medicines.filter(medicine =>
                        medicine.toLowerCase().startsWith(query)
                    );

                    console.log('Filtered medicines:', filteredMedicines);

                    filteredMedicines.forEach(medicine => {
                        const item = document.createElement('li');
                        item.textContent = medicine;
                        item.addEventListener('click', () => {
                            console.log('Medicine selected:', medicine);
                            inputField.value = medicine; // Set the value of the input field to the selected medicine
                            dropdown.remove(); // Remove the dropdown after selecting
                            inputField.dispatchEvent(new Event('input')); // Dispatch an input event on the input field to trigger any associated event listeners
                        });
                        dropdown.appendChild(item);
                    });

                    // Position the dropdown
                    dropdown.style.position = 'absolute';
                    dropdown.style.left = `${inputField.offsetLeft}px`;
                    dropdown.style.top = `${inputField.offsetTop + inputField.offsetHeight}px`;
                    dropdown.style.width = `${inputField.offsetWidth}px`;

                    console.log('Dropdown positioned');
                }
            }
        });

        // Add event listener to handle clicks on the document
        document.addEventListener('click', function(event) {
            const target = event.target;

            // Check if the click target is an input field or an item in the dropdown
            const isInputField = target.matches('input.p-inputtext.p-component.subm_field.form-control');
            const isDropdownItem = target.closest('.autocomplete-dropdown li');

            // If neither the input field nor the dropdown item was clicked, remove the dropdown
            if (!isInputField && !isDropdownItem) {
                const dropdowns = document.querySelectorAll('.autocomplete-dropdown');
                dropdowns.forEach(dropdown => {
                    dropdown.remove(); // Remove the dropdown
                });
            }
        });
    })
    .catch(error => {
        console.error('Error fetching or parsing medicines.json:', error);
    });

// Add CSS for the dropdown directly within content.js
const style = document.createElement('style');
style.innerHTML = `
.autocomplete-dropdown {
    position: absolute;
    background: white;
    border: 1px solid #ccc;
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 200px;
    overflow-y: auto;
    z-index: 1000;
}

.autocomplete-dropdown li {
    padding: 8px;
    cursor: pointer;
}

.autocomplete-dropdown li:hover {
    background-color: #f0f0f0;
}
`;
document.head.appendChild(style);
