// שליפת כל החידות
export async function getAllRiddles() {
    const url = "http://localhost:3000/riddles/";
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
    const url = "http://localhost:3000/riddles";
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
    const url = "http://localhost:3000/riddles/" + id;
    try {
        const res = await fetch(url, {
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
 const url = "http://localhost:3000/riddles/" + id;
    try {
        const res = await fetch(url, {
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
