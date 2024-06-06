document.getElementById('bookForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const bookTitle = document.getElementById('bookTitle').value;

    fetch('/findPublisher', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: bookTitle }),
    })
    .then(response => response.json())
    .then(data => {
        const resultContainer = document.getElementById('result');
        resultContainer.innerHTML = ''; // Clear previous content

        if (data.error) {
            resultContainer.textContent = data.error;
        } else {
            let message = data.message ? data.message : '';
            let publisher = data.publisher ? data.publisher : '';

            // Format demands as bullet points
            const demands = [
                'Here is what we are asking of St. Martin’s Press',
                'Address and denounce the Islamophobia/racism from their employee.',
                'Offer tangible steps for how they’re going to mitigate the harm this employee caused.',
                'Address how, moving forward, they will support and protect their Palestinian, Muslim, and Arab readers, influencers, and authors in addition to their BIPOC readers, influencers, and authors.'
            ];
            const demandsHTML = demands.map(demand => `<li>${demand}</li>`).join('');
            const demandsList = `<ul class="demands">${demandsHTML}</ul>`;

            // Display message with special styling for St. Martin's Press
            if (publisher.includes("St. Martin's Press")) {
                message += `<div class="message">${demandsList}</div>`;
            }

            // Append publisher and message to result container
            resultContainer.innerHTML = `<div>${publisher}</div>${message}`;
        }
    })
    .catch(error => console.error('Error:', error));
});
