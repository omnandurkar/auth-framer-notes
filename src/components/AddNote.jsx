"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import { AddNoteAction } from "@/actions/page";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

const AddNote = ({ onNoteAdded }) => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [tagTitle, setTagTitle] = useState("");
    const [tagColor, setTagColor] = useState("");
    const [link, setLink] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();  // Prevent default form submission behavior.

        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?._id;

        if (!userId) {
            console.error("User not logged in!");
            return;
        }

        const noteData = {
            title,
            desc,
            tagTitle,
            tagColor,
            link,
            isOpen,
            user: userId,
        };


        try {
            await AddNoteAction(noteData);
            onNoteAdded();
            // Notify parent component to refresh notes.
            console.log(noteData);
            // Clear form inputs after successful submission
            setTitle("");
            setDesc("");
            setTagTitle("");
            setTagColor("");
            setLink("");
            setIsOpen(false);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving note:", error);
        }
    };

    return (
        <>
            <Button onClick={() => setIsModalOpen(true)}>Add Note</Button>

            <Dialog open={isModalOpen} onOpenChange={(open) => setIsModalOpen(open)}>
                <form onSubmit={handleSubmit}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Note</DialogTitle>
                            <DialogDescription>
                                Fill out the form below to create a new note. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div>
                                <Label htmlFor="title">Title<span className="text-red-500">*</span></Label>
                                <Input
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Note Title"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="desc">Description<span className="text-red-500">*</span></Label>
                                <Textarea
                                    id="desc"
                                    value={desc}
                                    onChange={(e) => setDesc(e.target.value)}
                                    placeholder="Note Description"
                                    required
                                />
                            </div>
                            <div>
                                <Label htmlFor="link">Link</Label>
                                <Input
                                    id="link"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    placeholder="Add a link (optional)"
                                />
                            </div>
                            <div className="flex gap-4">
                                <div>
                                    <Label htmlFor="tagTitle">Tag</Label>
                                    <Input
                                        id="tagTitle"
                                        value={tagTitle}
                                        onChange={(e) => setTagTitle(e.target.value)}
                                        placeholder="Tag Title"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="tagColor">Tag Color</Label>
                                    <Input
                                        id="tagColor"
                                        value={tagColor}
                                        onChange={(e) => setTagColor(e.target.value)}
                                        placeholder="Color"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="isOpen"
                                    checked={isOpen}
                                    onCheckedChange={(checked) => setIsOpen(checked)}
                                />
                                <Label htmlFor="isOpen">Is this note public?</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSubmit} type="submit">Save Note</Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        </>
    );
};

export default AddNote;
