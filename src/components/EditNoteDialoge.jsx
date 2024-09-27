"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from './ui/button';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { EditNoteAction } from '@/actions/page';
import { Label } from './ui/label';
import { toast } from 'sonner';
// import toast from 'react-hot-toast';

const EditNoteDialog = ({ open, onClose, noteData, onUpdate }) => {
    const [title, setTitle] = useState(noteData.title);
    const [desc, setDesc] = useState(noteData.desc);
    const [link, setLink] = useState(noteData.link);
    const [tagTitle, setTagTitle] = useState(noteData.tag.tagTitle);
    const [tagColor, setTagColor] = useState(noteData.tag.tagColor);
    const [isTagOpen, setIsTagOpen] = useState(noteData.tag.isOpen);

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            title,
            desc,
            link,
            isOpen: isTagOpen,
            tagTitle,
            tagColor,
        };

        try {
            await EditNoteAction(noteData._id, formData, JSON.parse(localStorage.getItem('user'))._id);
            onUpdate(); // Notify parent component of the update
            toast.success("Note updated successfully");
            onClose(); // Close the dialog
        } catch (error) {
            console.error("Error updating note:", error);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Note</DialogTitle>
                    <DialogDescription>
                        Update the details of the note below and click save when done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleEditSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="items-center gap-4">
                            <Label htmlFor="title" className="text-right">Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="col-span-3"
                                placeholder="Note Title"
                                required
                            />
                        </div>
                        <div className="items-center gap-4">
                            <Label htmlFor="desc" className="text-right">Description</Label>
                            <Textarea
                                id="desc"
                                value={desc}
                                onChange={(e) => setDesc(e.target.value)}
                                className="col-span-3"
                                placeholder="Note Description"
                                required
                            />
                        </div>
                        <div className="items-center gap-4">
                            <Label htmlFor="link" className="text-right">Link</Label>
                            <Input
                                id="link"
                                value={link}
                                onChange={(e) => setLink(e.target.value)}
                                className="col-span-3"
                                placeholder="Note Link"
                            />
                        </div>
                        <div className="ms-1 flex items-center gap-2">
                            <Checkbox
                                id="isOpen"
                                checked={isTagOpen}
                                onCheckedChange={(checked) => setIsTagOpen(checked)}
                            />
                            <Label htmlFor="isOpen">Open Tag</Label>
                        </div>
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
                                    className="col-span-3 border rounded-md p-2"
                                >
                                    <option value="" disabled>Select Tag Color</option>
                                    <option value="green">Green</option>
                                    <option value="blue">Blue</option>
                                    <option value="yellow">Yellow</option>
                                    <option value="red">Red</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={onClose} variant="outline">Cancel</Button>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditNoteDialog;
