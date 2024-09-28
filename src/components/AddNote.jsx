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
// import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner";


const AddNote = ({ onNoteAdded }) => {
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [tagTitle, setTagTitle] = useState("");
    const [tagColor, setTagColor] = useState("");
    const [link, setLink] = useState("");
    // const [isOpen, setIsOpen] = useState(false);
    const [isTagOpen, setIsTagOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);


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
            await AddNoteAction(noteData);
            onNoteAdded();
            toast.success("Note added successfully!");
            
            // console.log(noteData);
            
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
                            <div className="ms-1 flex items-center gap-2">
                                <Switch
                                    id="isOpen"
                                    checked={isTagOpen}
                                    onCheckedChange={(checked) => setIsTagOpen(checked)}
                                />
                                <Label htmlFor="isOpen">Open Tag</Label>
                            </div>
                            {
                                isTagOpen && (
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
                                        <div className="items-center gap-4">
                                            <Label htmlFor="tagColor" className="text-right">Tag Color</Label>
                                            <select
                                                id="tagColor"
                                                value={tagColor}
                                                onChange={(e) => setTagColor(e.target.value)}
                                                className="col-span-3 border text-sm rounded-md p-2"
                                            >
                                                <option value="" disabled>Select Tag Color</option>
                                                <option value="green">Green</option>
                                                <option value="blue">Blue</option>
                                                <option value="yellow">Yellow</option>
                                                <option value="red">Red</option>
                                            </select>
                                        </div>
                                    </div>
                                )
                            }
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
