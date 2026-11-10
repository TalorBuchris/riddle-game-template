const url = "http://localhost:3000/api/riddles/";

// שליפת כל החידות
export async function getAllRiddles() {
    try {
        const res = await fetch(url);
        if (!res.ok)
            throw new Error("Failed to fetch riddles");

        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error("Error fetching riddles:", error);
        return [];
    }
}

// יצירת חידה חדשה
export async function createRiddle(riddle) {
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(riddle)
        });
        if (!res.ok)
            throw new Error("NOT ADD NEW");

        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error("Error creating riddles:", error);
        throw error;
    }
}

// עדכון חידה
export async function updateRiddle(id, riddle) {
    try {
        const res = await fetch(url + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(riddle)
        });
        if (!res.ok)
            throw new Error("NOT UPDATE");

        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error("Error updating riddle:", error);
        return [];
    }
}

// מחיקת חידה
export async function deleteRiddle(id) {
    try {
        const res = await fetch(url + id, {
            method: "DELETE",
        });
        if (!res.ok)
            throw new Error("NOT DELETE");

        return true;
    }
    catch (error) {
        console.error("Error deleting riddle:", error);
        return false;
    }
}
