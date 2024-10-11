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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const colorOptions = [
    { value: "red", label: "Red" },
    { value: "purple", label: "Purple" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "yellow", label: "Yellow" }
    // { value: "black", label: "Black" },
];

const AddNote = ({ onNoteAdded }) => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [tagTitle, setTagTitle] = useState("");
    const [tagColor, setTagColor] = useState("");
    const [link, setLink] = useState("");
    const [isTagOpen, setIsTagOpen] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?._id;

        if (!userId) {
            console.error("User not logged in!");
            return;
        }

        if (!title) {
            toast.error("Title is required!");
            return;
        }

        if (!desc) {
            toast.error("Description is required!");
            return;
        }

        const noteData = {
            title,
            desc,
            tagTitle,
            tagColor,
            link,
            isOpen: isTagOpen,
            user: userId,
        };

        try {
            setLoading(true);
            await AddNoteAction(noteData);
            onNoteAdded();
            toast.success("Note added successfully!");
            setTitle("");
            setDesc("");
            setTagTitle("");
            setTagColor("");
            setLink("");
            setIsTagOpen(true);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Error saving note:", error);
        } finally {
            setLoading(false);
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
                            {/* <div className="ms-1 flex items-center gap-2">
                                <Switch
                                    id="isOpen"
                                    checked={isTagOpen}
                                    onCheckedChange={(checked) => setIsTagOpen(checked)}
                                />
                                <Label htmlFor="isOpen">Open Tag</Label>
                            </div> */}
                            {isTagOpen && (
                                <div className="grid grid-cols-2 gap-5">
                                    <div className="items-center gap-4">
                                        <Label htmlFor="tagTitle" className="text-right">Tag Title</Label>
                                        <Input
                                            id="tagTitle"
                                            value={tagTitle}
                                            onChange={(e) => setTagTitle(e.target.value)}
                                            className="col-span-3"
                                            placeholder="Tag Title"
                                        />
                                    </div>
                                    <div className="flex-col items-center ">
                                        <Label className="text-right">Tag Color</Label>
                                        <div className="flex  space-x-3 py-2">
                                            {colorOptions.map((color) => (
                                                <div
                                                    key={color.value}
                                                    onClick={() => setTagColor(color.value)}
                                                    className={`h-6 w-6 rounded-sm cursor-pointer border-2 border-transparent ${tagColor === color.value ? 'ring-1 ring-black  drop-shadow-md' : ''}`}
                                                    style={{ backgroundColor: color.value }}
                                                />
                                            ))}

                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="ms-1 hidden  items-center gap-2">
                                <Switch
                                    id="isOpen"
                                    checked={isTagOpen}
                                    onCheckedChange={(checked) => setIsTagOpen(checked)}
                                />
                                <Label htmlFor="isOpen">Open Tag</Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleSubmit} type="submit" disabled={loading}>
                                {loading ? `Saving...` : `Save Note`}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </form>
            </Dialog>
        </>
    );
};

export default AddNote;
