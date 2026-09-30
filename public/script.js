let readings = [];


// READ - Get all readings
async function loadReadings() {

    try {

        const response = await fetch("/api/readings");

        readings = await response.json();

        const table = document.getElementById("readingsTable");

        table.innerHTML = "";

        readings.forEach(reading => {

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${reading.greenhouse}</td>

                <td>${reading.soilMoisture}%</td>

                <td>${reading.temperature}°C</td>

                <td>${reading.humidity}%</td>

                <td>

                    <button
                        class="action-button"
                        onclick="editReading('${reading._id}')">
                        Edit
                    </button>

                    <button
                        class="action-button"
                        onclick="deleteReading('${reading._id}')">
                        Delete
                    </button>

                </td>
            `;

            table.appendChild(row);

        });

    } catch (error) {

        console.error("Error loading readings:", error);

    }
}



// CREATE / UPDATE - Save reading
async function saveReading() {

    const id = document.getElementById("readingId").value;

    const data = {

        greenhouse:
            document.getElementById("greenhouse").value,

        soilMoisture:
            document.getElementById("soilMoisture").value,

        temperature:
            document.getElementById("temperature").value,

        humidity:
            document.getElementById("humidity").value

    };


    if (!data.greenhouse ||
        !data.soilMoisture ||
        !data.temperature ||
        !data.humidity) {

        alert("Please fill all fields.");

        return;
    }


    try {

        if (id) {

            // UPDATE

            await fetch(`/api/readings/${id}`, {

                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)

            });

            alert("Reading updated successfully.");

        } else {

            // CREATE

            await fetch("/api/readings", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)

            });

            alert("Reading added successfully.");

        }


        clearForm();

        loadReadings();

    } catch (error) {

        console.error("Error saving reading:", error);

    }

}



// UPDATE - Load selected reading into form
function editReading(id) {

    const reading =
        readings.find(item => item._id === id);


    if (!reading) {
        return;
    }


    document.getElementById("readingId").value =
        reading._id;

    document.getElementById("greenhouse").value =
        reading.greenhouse;

    document.getElementById("soilMoisture").value =
        reading.soilMoisture;

    document.getElementById("temperature").value =
        reading.temperature;

    document.getElementById("humidity").value =
        reading.humidity;

}



// DELETE - Delete reading
async function deleteReading(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this reading?");


    if (!confirmDelete) {
        return;
    }


    try {

        await fetch(`/api/readings/${id}`, {

            method: "DELETE"

        });

        alert("Reading deleted successfully.");

        loadReadings();

    } catch (error) {

        console.error("Error deleting reading:", error);

    }

}



// Clear form
function clearForm() {

    document.getElementById("readingId").value = "";

    document.getElementById("greenhouse").value = "";

    document.getElementById("soilMoisture").value = "";

    document.getElementById("temperature").value = "";

    document.getElementById("humidity").value = "";

}



// Load readings when page opens
loadReadings();