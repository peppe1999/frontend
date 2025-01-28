document.addEventListener('DOMContentLoaded', () => {
    
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];

    dateInput.setAttribute('min', today);

    const urlParams = new URLSearchParams(window.location.search);
    const bookingId = urlParams.get('bookingId'); 

    if (bookingId) {
        fetch(`http://127.0.0.1:8000/api/bookings/${bookingId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Errore nel recupero della prenotazione.");
                }
                return response.json();
            })
            .then((booking) => {
                document.getElementById("name").value = booking.name;
                document.getElementById("date").value = booking.date;
                document.getElementById("time").value = booking.time;
                document.getElementById("guests").value = booking.guests;
            })
            .catch((error) => {
                console.error(error);
                alert("Errore nel caricamento della prenotazione.");
            });
    }

    document.getElementById("booking-form").addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const bookingData = {
            id: bookingId ? parseInt(bookingId, 10) : Date.now(),
            name: formData.get("name"),
            date: formData.get("date"),
            time: formData.get("time"),
            guests: parseInt(formData.get("guests"), 10),
        };

        try {
            const method = bookingId ? "PUT" : "POST";
            const url = bookingId
                ? `http://127.0.0.1:8000/api/bookings/${bookingId}`
                : "http://127.0.0.1:8000/api/bookings";

            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingData),
            });

            if (!response.ok) {
                const error = await response.json();
                alert(error.detail || "Errore durante la creazione o modifica della prenotazione.");
                return;
            }

            const result = await response.json();
            alert(`Numero di prenotazione: ${result.id}`);
            window.location.href = `confirmation.html?bookingId=${result.id}`;
        } catch (error) {
            alert("Errore imprevisto: " + error.message);
        }
    });
});
