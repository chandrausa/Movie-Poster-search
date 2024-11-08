document.getElementById('searchButton').addEventListener('click', function() {
    performSearch();
});

document.getElementById('searchInput').addEventListener('input', function() {
    const query = this.value.trim();
    if (query) {
        fetchSuggestions(query);
    } else {
        document.getElementById('suggestionsContainer').style.display = 'none';
    }
});

document.getElementById('suggestionsContainer').addEventListener('click', function(event) {
    if (event.target.classList.contains('suggestion')) {
        document.getElementById('searchInput').value = event.target.textContent;
        performSearch();
    }
});

function performSearch() {
    const query = document.getElementById('searchInput').value.trim();
    const moviePostersContainer = document.getElementById('moviePostersContainer');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const suggestionsContainer = document.getElementById('suggestionsContainer');

    // Clear previous results
    moviePostersContainer.innerHTML = ''; // Clear previous movie posters
    noResultsMessage.style.display = 'none'; // Hide no results message
    suggestionsContainer.innerHTML = ''; // Clear previous suggestions
    suggestionsContainer.style.display = 'none'; // Hide suggestions

    if (!query) {
        noResultsMessage.textContent = 'Please enter a movie title.';
        noResultsMessage.style.display = 'block';
        return;
    }

    // Fetch movie posters from OMDb API
    fetch(`https://www.omdbapi.com/?s=${encodeURIComponent(query)}&type=movie&apikey=8bf83328`)
        .then(response => response.json())
        .then(data => {
            if (data.Response === 'True') {
                let hasValidPosters = false;

                data.Search.forEach(movie => {
                    if (movie.Poster && movie.Poster !== 'N/A') {
                        const imgElement = document.createElement('img');
                        imgElement.src = movie.Poster;
                        imgElement.alt = movie.Title;
                        imgElement.classList.add('movie-poster'); // Add a class for styling
                        moviePostersContainer.appendChild(imgElement);
                        hasValidPosters = true;
                    }
                });

                if (!hasValidPosters) {
                    noResultsMessage.textContent = `No posters available for "${query}".`;
                    noResultsMessage.style.display = 'block';
                }
            } else {
                noResultsMessage.textContent = `No titles found for "${query}".`;
                noResultsMessage.style.display = 'block';
            }
        })
        .catch(error => {
            noResultsMessage.textContent = 'An error occurred while fetching results. Please try again.';
            noResultsMessage.style.display = 'block';
            console.error('OMDb API Error:', error);
        });
}

function fetchSuggestions(query) {
    // Example API for suggestions. Replace with a real API if available.
    fetch(`https://api.example.com/suggestions?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            const suggestionsContainer = document.getElementById('suggestionsContainer');
            suggestionsContainer.innerHTML = ''; // Clear previous suggestions

            if (data.suggestions && data.suggestions.length > 0) {
                data.suggestions.forEach(suggestion => {
                    const suggestionElement = document.createElement('div');
                    suggestionElement.classList.add('suggestion');
                    suggestionElement.textContent = suggestion;
                    suggestionsContainer.appendChild(suggestionElement);
                });
                suggestionsContainer.style.display = 'block'; // Show suggestions
            } else {
                suggestionsContainer.style.display = 'none'; // Hide if no suggestions
            }
        })
        .catch(error => {
            console.error('Suggestions API Error:', error);
        });
}
