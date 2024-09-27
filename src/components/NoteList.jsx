"use client"

import { FetchNoteAction } from "@/actions/page";
import React, { useEffect, useState } from "react";
import Card from "./Card";


const NotesList = () => {
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        const fetchNotes = async () => {
            const fetchedNotes = await FetchNoteAction();
            setNotes(fetchedNotes);
        };
        fetchNotes();
    }, []);

    return (
        <div className="space-y-4">
            {notes.length > 0 ? (
                notes.map((note) => (

                    <Card data={note} />

                ))
            ) : (
                <p>No notes found</p>
            )}
        </div>
    );
};

export default NotesList;
