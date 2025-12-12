import axios from "axios";

console.log(">>> Concurrency test starting...");

const SLOT_ID = 1; // use a real slot ID from GET /api/slots
const NUM_REQUESTS = 50;

async function runTest() {
    console.log(`Running concurrency test with ${NUM_REQUESTS} requests on slot ${SLOT_ID}...\n`);

    const requests: Promise<any>[] = [];

    for (let i = 0; i < NUM_REQUESTS; i++) {
        requests.push(
            axios
                .post("http://localhost:4000/api/bookings", {
                    slot_id: SLOT_ID,
                    user_name: "User_" + i,
                })
                .then((res) => res.data) // success → return JSON
                .catch((err) => {
                    // normalize error payload so we don't get big HTML blobs
                    if (err.response?.data) return err.response.data;
                    return { error: err.message || "Unknown error" };
                })
        );
    }

    const results = await Promise.all(requests);

    console.log("\nRAW RESULTS:");
    console.log(results);

    let success = 0;
    let failedAlreadyBooked = 0;
    let slotNotFound = 0;
    let otherErrors = 0;

    for (const res of results) {
        if (res?.status === "PENDING" || res?.status === "CONFIRMED") {
            success++;
        } else if (res?.error === "Slot already booked") {
            failedAlreadyBooked++;
        } else if (res?.error === "Slot not found") {
            slotNotFound++;
        } else {
            otherErrors++;
        }
    }

    console.log("\nSUMMARY:");
    console.log("Successful bookings:", success);
    console.log("Failed (already booked):", failedAlreadyBooked);
    console.log("Failed (slot not found):", slotNotFound);
    console.log("Other errors:", otherErrors);
}

runTest()
    .then(() => console.log("\n>>> Concurrency test finished."))
    .catch((e) => {
        console.error("Test crashed:", e);
        console.log("\n>>> Concurrency test finished WITH ERRORS.");
    });
