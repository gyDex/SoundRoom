import { api } from ".";

export async function getTracksByGroup() {
    const res = await api.get('/tracks/');

    return res.data;
}

export async function getAllTracks() {
    const res = await api.get('/tracks');
    return res.data;
}