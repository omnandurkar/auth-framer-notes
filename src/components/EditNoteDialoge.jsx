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
import { Switch } from "@/components/ui/switch"

// import toast from 'react-hot-toast';

const colorOptions = [
    { value: "red", label: "Red" },
    { value: "purple", label: "Purple" },
    { value: "blue", label: "Blue" },
    { value: "green", label: "Green" },
    { value: "yellow", label: "Yellow" }
    // { value: "black", label: "Black" },
];

const EditNoteDialog = ({ open, onClose, noteData, onUpdate }) => {
    const [title, setTitle] = useState(noteData.title);
    const [desc, setDesc] = useState(noteData.desc);
    const [link, setLink] = useState(noteData.link);
    const [tagTitle, setTagTitle] = useState(noteData.tag.tagTitle);
    const [tagColor, setTagColor] = useState(noteData.tag.tagColor);
    const [isTagOpen, setIsTagOpen] = useState(noteData.tag.isOpen);
    const [loading, setLoading] = useState(false);

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
            setLoading(true);
            await EditNoteAction(noteData._id, formData, JSON.parse(localStorage.getItem('user'))._id);
            onUpdate();
            toast.success("Note updated successfully");
            onClose();
        } catch (error) {
            console.error("Error updating note:", error);
        } finally {
            setLoading(false);
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
                        <div className="ms-1 hidden items-center gap-2">
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
                                    {/* <div className="items-center gap-4">
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
                                    </div> */}

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
                            )
                        }
                    </div>
                    <DialogFooter>
                        <Button onClick={onClose} variant="outline">Cancel</Button>
                        <Button className="mb-3 md:mb-0" type="submit" disabled={loading} >
                            {loading ? `Saving...` : `Save Changes`}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default EditNoteDialog;
