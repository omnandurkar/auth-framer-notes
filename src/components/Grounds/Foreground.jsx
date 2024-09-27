'use client';

import React, { useEffect, useRef, useState } from 'react';
import Card from '../Card';
import { FetchNoteAction } from '@/actions/page';
import AddNote from '../AddNote';
import { ArrowLeftCircleIcon, ArrowRightCircle, Power } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const Foreground = () => {
    const ref = useRef(null);
    const router = useRouter();
    const scrollContainerRef = useRef(null);

    const [notes, setNotes] = useState([]);
    const [notesIsLoading, setNotesIsLoading] = useState(true);

    const [isLogOutDialogOpen, setisLogOutDialogOpen] = React.useState(false);

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const userId = user?._id;

                if (!userId) {
                    router.push('/auth/login'); // Redirect to login if not authenticated
                    return;
                }

                const fetchedNotes = await FetchNoteAction(userId); // Fetch notes for the user
                // console.log("Fetched notes in useEffect:", fetchedNotes); // Debugging
                setNotes(fetchedNotes);
            } catch (error) {
                console.error('Failed to fetch notes:', error);
            } finally {
                setNotesIsLoading(false);
            }
        };
        fetchNotes();
    }, [router]);


    const handleDeleteNote = (id) => {
        setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
    };

    const handleUpdateNotes = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const userId = user?._id;

            const updatedNotes = await FetchNoteAction(userId);
            setNotes(updatedNotes);
        } catch (error) {
            console.error('Failed to fetch updated notes:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        router.push('/auth/login'); // Redirect to login after logout
    };

    const scrollLeft = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
        }
    };

    return (
        <div ref={ref} className='fixed pt-36 md:pt-52 inset-0 md:overflow-hidden overflow-auto p-10 md:px-20 top-0 left-0 w-full h-full z-[3]'>

            <div className='mt-10 relative'>
                {notesIsLoading ? (
                    <div ref={scrollContainerRef} className='flex flex-col py-10 md:flex-row gap-10 justify-center overflow-x-auto scrollbar-hide'>
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className='w-60 h-72 rounded-xl bg-neutral-300/50 animate-pulse'></div>
                        ))}
                    </div>
                ) : (
                    <div ref={scrollContainerRef} className='flex flex-col py-10 md:flex-row gap-10 justify-center items-center overflow-y-hidden flex-wrap overflow-x-auto scrollbar-hide'>
                        {notes && notes.length > 0 ? notes.map((note) => (
                            <Card
                                key={note._id}
                                data={note}
                                reference={ref}
                                onDelete={handleDeleteNote}
                                onUpdate={handleUpdateNotes}
                            />
                        )) : (
                            // <div className='relative'>
                            //     <div className='text-center text-lg font-bold fixed top-52 left-1/2 transform -translate-x-[50%] text-neutral-900'>
                            //         No notes found
                            //     </div>
                            //     <div className='fixed top-64 left-1/2 transform -translate-x-[50%] text-neutral-100'>
                            //         <AddNote onNoteAdded={handleUpdateNotes} />
                            //     </div>
                            // </div>
                            <div className=' w-full flex flex-col  h-96 justify-center space-y-7 items-center' >
                                <h1 className='text-lg font-bold text-gray-600'>No Notes Found</h1>
                                <AddNote onNoteAdded={handleUpdateNotes} />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {notes.length > 0 &&

                <div className='hidden md:flex w-full justify-between py-10 pe-3'>
                    <button onClick={scrollLeft} className='text-black p-2 rounded-full'>
                        <ArrowLeftCircleIcon />
                    </button>
                    <button onClick={scrollRight} className='text-black p-2 rounded-full'>
                        <ArrowRightCircle />
                    </button>
                </div>
            }



            <div className="absolute top-5 right-5 md:space-y-2 flex md:flex-col justify-between space-x-24 md:space-x-0 ">
                {notes.length > 0 && <AddNote onNoteAdded={handleUpdateNotes} />}
                {/* <Button onClick={() => setisLogOutDialogOpen(true)}>LogOut</Button> */}
                <Button onClick={() => setisLogOutDialogOpen(true)}> Log <Power className='text-red-400' size={15} />ut</Button>
            </div>



            <Dialog open={isLogOutDialogOpen} onOpenChange={() => setisLogOutDialogOpen(false)} >
                <DialogContent className="max-w-xs">
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription className="flex justify-center gap-5 pt-5">
                            <Button onClick={() => setisLogOutDialogOpen(false)} variant="outline">Cancel</Button>
                            <Button onClick={handleLogout}>Logout</Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default Foreground;

