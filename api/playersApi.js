// שליפת כל השחקנים
export async function getAllPlayers() {
    const url = "http://localhost:3000/players/";
    try {
        const res = await fetch(url);
        if (!res.ok)
            throw new Error("Failed to fetch players");

        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error("Error fetching players:", error);
        return [];
    }
}

// יצירת שחקן חדש
export async function createPlayer(name) {
    const url = "http://localhost:3000/players";
    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: name, lowestTime: null })
        });
        if (!res.ok)
            throw new Error("NOT ADD NEW");

        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error("Error creating players:", error);
        throw error;
    }
}

// עדכון זמן השיא של השחקן
export async function updatePlayer(player) {
    const url = "http://localhost:3000/players/" + player.id;
    try {
        const res = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({lowestTime: player.lowestTime})
        });
        if (!res.ok)
            throw new Error("NOT UPDATE");

        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error("Error updating player:", error);
        throw error;
    }
}

// חיפוש שחקן
export async function findPlayerByName(name) {
    try {
        let players = await getAllPlayers();

        const player = players.find((player) => {
            return player.name === name;
        });

        return player;
    }
    catch (error) {
        console.error("Error finding player:", error);
        throw error;
    }
}