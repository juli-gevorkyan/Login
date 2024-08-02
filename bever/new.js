document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://bever-aca-assignment.azurewebsites.net/invoices';
    const apiUrlLines = 'https://bever-aca-assignment.azurewebsites.net/invoicelines';
    const apiProducts = 'https://bever-aca-assignment.azurewebsites.net/products';
    const tableBody = document.getElementById('tbodyTable');
    const invoiceLinesTable = document.getElementById('invoiceLinesTable');
    const logoutButton = document.getElementById('logoutButton');
    const userId = localStorage.getItem('loggedInUserId');
    let allProducts = [];

    fetch(apiProducts, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        allProducts = data.value;
        fetchInvoices(userId);
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

    function fetchInvoices(userId) {
        fetch(`${apiUrl}?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data.value)) {
                throw new Error('Expected data.value to be an array');
            }

            const userInvoices = data.value.filter(invoice => invoice.UserId === userId);

            userInvoices.forEach(invoice => {
                const row = document.createElement('tr');

                const selectCell = document.createElement('td');
                const radioButton = document.createElement('input');
                radioButton.type = 'radio';
                radioButton.name = 'invoiceSelect';
                radioButton.value = invoice.InvoiceId;
                radioButton.addEventListener('change', () => displayInvoiceLines(invoice.InvoiceId));
                selectCell.appendChild(radioButton);
                row.appendChild(selectCell);

                const nameCell = document.createElement('td');
                nameCell.textContent = invoice.Name || 'No Name';
                row.appendChild(nameCell);

                const dateCell = document.createElement('td');
                dateCell.textContent = new Date(invoice.PaidDate).toLocaleDateString();
                row.appendChild(dateCell);

                const amountCell = document.createElement('td');
                amountCell.textContent = invoice.TotalAmount;
                row.appendChild(amountCell);

                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    function displayInvoiceLines(invoiceId) {
        fetch(`${apiUrlLines}?invoiceId=${invoiceId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            if (!Array.isArray(data.value)) {
                throw new Error('Expected data.value to be an array');
            }

            invoiceLinesTable.innerHTML = ''; 

            data.value.forEach(line => {
                const product = allProducts.find(p => p.ProductId === line.ProductId);

                const row = document.createElement('tr');

                const productCell = document.createElement('td');
                productCell.textContent = product ? product.Name : 'Unknown Product';
                row.appendChild(productCell);

                const priceCell = document.createElement('td');
                priceCell.textContent = product ? product.Price : 'N/A';
                row.appendChild(priceCell);

                const quantityCell = document.createElement('td');
                quantityCell.textContent = line.Quantity;
                row.appendChild(quantityCell);

                const totalCell = document.createElement('td');
                totalCell.textContent = line.TotalAmount;
                row.appendChild(totalCell);

                invoiceLinesTable.appendChild(row);
            });
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }

    logoutButton.addEventListener('click', () => {
        window.location.href = 'index.html';
    });
});
