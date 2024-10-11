// components/Card.js

"use client";

import React from 'react';
import { FaRegFileAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { CircleX, Copy, Edit, Link, Link2 } from 'lucide-react';
import { DeleteNoteAction } from '@/actions/page';



import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from './ui/button';
import EditNoteDialog from './EditNoteDialoge';
import { toast } from 'sonner';

const Card = ({ data, reference, onDelete, onUpdate }) => {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);

    const handleDelete = async () => {
        try {
            await DeleteNoteAction(data._id);
            onDelete(data._id); // Notify parent of delete
        } catch (error) {
            console.error('Failed to delete note:', error);
        }
    };

    const handleDownload = () => {
        console.log('download');
    };

    const handleDescCopy = () => {
        navigator.clipboard.writeText(data.link);
        toast.success('Description copied to clipboard');
    }
    const handleLinkCopy = () => {
        navigator.clipboard.writeText(data.link);
        toast.success('Link Copied to clipboard');
    }

    return (
        <>
            <motion.div
                drag
                dragConstraints={reference}
                whileDrag={{ scale: 1.1 }}
                dragElastic={0.2}
                dragTransition={{ bounceStiffness: 500, bounceDamping: 10 }}
                className='flex-shrink-0 relative w-60 h-72 rounded-xl shadow bg-zinc-200  md:bg-zinc-200/80 text-zinc-800 px-8 py-10 overflow-hidden'
            >
                <div className='flex justify-between'>
                    <FaRegFileAlt />
                    <CircleX className='cursor-pointer active:scale-90 transition-all' onClick={() => setIsDeleteDialogOpen(true)} size={20} />
                </div>
                <p className='text-md capitalize leading-tight mt-5 font-bold'>{data.title}</p>
                <div className='overflow-y-auto max-h-24 '>
                    <p onClick={handleDescCopy} className='text-sm cursor-copy  leading-tight mt-5 font-semibold'>{data.desc}</p>
                </div>
                <div className='footer absolute bottom-0 w-full left-0'>
                    <div className='flex justify-between space-x-2 px-8 py-3 items-center mb-5'>
                        {/* <h5>{data.filesize}</h5> */}

                        <span >
                            <Edit className='cursor-pointer  active:scale-90 transition-all' onClick={() => setIsEditDialogOpen(true)} />
                        </span>

                        {
                            data.link && <Link className='cursor-pointer  active:scale-90 transition-all' onClick={handleLinkCopy} />

                        }



                    </div>
                    {
                        data.tag.isOpen && (
                            <div
                                className={`tag flex justify-center items-center w-full h-12 py-4 ${data.tag.tagColor === "green"
                                    ? "bg-green-600"
                                    : data.tag.tagColor === "blue"
                                        ? "bg-blue-600"
                                        : data.tag.tagColor === "yellow"
                                            ? "bg-yellow-400"
                                            : data.tag.tagColor === "red"
                                                ? "bg-red-600"
                                                : data.tag.tagColor === "purple"
                                                    ? "bg-purple-600"
                                                    : "bg-black"
                                    }`}
                            >
                                <h2 className="font-semibold text-zinc-100 text-sm">{data.tag.tagTitle}</h2>
                            </div>

                        )
                    }
                </div>

                <Dialog open={isDeleteDialogOpen} onOpenChange={() => setIsDeleteDialogOpen(false)} >
                    <DialogContent className="max-w-xs">
                        <DialogHeader>
                            <DialogTitle>Are you absolutely sure?</DialogTitle>
                            <DialogDescription className="flex justify-center gap-5 pt-5">
                                <Button onClick={() => setIsDeleteDialogOpen(false)} variant="outline">Cancel</Button>
                                <Button onClick={handleDelete}>Delete</Button>
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>

                <EditNoteDialog
                    open={isEditDialogOpen}
                    onClose={() => setIsEditDialogOpen(false)}
                    noteData={data}
                    onUpdate={() => {
                        onUpdate();
                        setIsEditDialogOpen(false);
                    }}
                />
            </motion.div>
        </>
    );
};

export default Card;
