document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById("coin-search");
    const suggestionsList = document.getElementById("suggestions");
    const coinDetailsDiv = document.getElementById("coin-details");
    let coinsList = [];

    async function fetchCoinsList() {
        try {
            const response = await fetch("https://api.coingecko.com/api/v3/coins/list");
            coinsList = await response.json();
        } catch (error) {
            console.error("Error fetching coins list:", error);
        }
    }

    async function fetchCoinDetails(coinId) {
        try {
            const response = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
            const coinDetails = await response.json();
            displayCoinDetails(coinDetails);
        } catch (error) {
            console.error("Error fetching coin details:", error);
        }
    }

    function displayCoinDetails(details) {
        coinDetailsDiv.innerHTML = `
            <h2>${details.name} (${details.symbol.toUpperCase()})</h2>
            <p><strong>Hashing Algorithm:</strong> ${details.hashing_algorithm || "N/A"}</p>
            <p><strong>Description:</strong> ${details.description.en || "No description available."}</p>
            <p><strong>Market Cap (EUR):</strong> €${details.market_data.market_cap.eur.toLocaleString()}</p>
            <p><strong>Homepage:</strong> <a href="${details.links.homepage[0]}" target="_blank">${details.links.homepage[0]}</a></p>
            <p><strong>Genesis Date:</strong> ${details.genesis_date || "N/A"}</p>
        `;
    }

    function filterCoins(query) {
//     	console.log(coinsList);
        const filteredCoins = coinsList.filter(coin => 
            coin.name.toLowerCase().includes(query.toLowerCase()) || 
            coin.symbol.toLowerCase().includes(query.toLowerCase())
        );
//         console.log(filteredCoins);
        displaySuggestions(filteredCoins);
    }

    function displaySuggestions(coins) {
        suggestionsList.innerHTML = coins.map(coin => 
            `<li data-id="${coin.id}">${coin.name} (${coin.symbol.toUpperCase()})</li>`
        ).join("");
    }

	function createSpinner() {
		const spinnerElement = document.createElement('div');
		spinnerElement.classList.add('spinner');
		return spinnerElement;
	}
    
    searchInput.addEventListener("input", function() {
        const query = searchInput.value.trim();
        if (query) {
            filterCoins(query);
        } else {
            suggestionsList.innerHTML = "";
        }
    });

    suggestionsList.addEventListener("click", function(event) {
        if (event.target.tagName === "LI") {
            const coinId = event.target.getAttribute("data-id");
            fetchCoinDetails(coinId);
        	coinDetailsDiv.style.visibility = 'visible';
        	suggestionsList.innerHTML = "";
            coinDetailsDiv.appendChild(createSpinner());
            searchInput.value = "";
        }
    });

    fetchCoinsList();
});
