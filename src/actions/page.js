"use server";

import { connectDB } from "@/database";
import Notes from "@/models/notes";
import User from "@/models/user";

import bcrypt from 'bcryptjs';



export const AddNoteAction = async (noteData) => {
    'use server';
    await connectDB();

    try {
        // console.log("Note data received on server:", noteData);  

        const note = new Notes({
            title: noteData.title,
            desc: noteData.desc,
            tagTitle: noteData.tagTitle,
            tagColor: noteData.tagColor,
            link: noteData.link,
            isOpen: noteData.isOpen,
            user: noteData.user,
        });

        await note.save();
        // console.log("Note saved successfully:", note);
        return note.toObject();
    } catch (error) {
        console.error('Failed to add note:', error);
        throw new Error('Failed to add note');
    }
};


export const FetchNoteAction = async (userId) => {
    console.log("Fetching notes for userId:", userId);

    await connectDB();

    try {
        const notes = await Notes.find({ user: userId }).exec();
        // console.log("Fetched notes:", notes); 
        return notes;
    } catch (error) {
        console.error("Failed to fetch notes:", error);
        throw new Error("Failed to fetch notes");
    }
};



export const DeleteNoteAction = async (id, userId) => {
    await connectDB();

    try {
        const deletedNote = await Notes.findByIdAndDelete(id);
        if (!deletedNote) {
            throw new Error("Note not found");
        }


        await User.findByIdAndUpdate(userId, { $pull: { notes: id } });

        return deletedNote.toObject();
    } catch (error) {
        console.log(error);
        throw new Error("Failed to delete note");
    }
};


export const EditNoteAction = async (id, formData, userId) => {
    await connectDB();

    const { title, desc, link, isOpen, tagTitle, tagColor } = formData;

    const tag = {
        isOpen,
        tagTitle,
        tagColor,
    };

    try {
        const updatedNote = await Notes.findOneAndUpdate(
            { _id: id, user: userId },
            { title, desc, tag, link },
            { new: true }
        );

        if (!updatedNote) {
            throw new Error("Note not found");
        }

        return updatedNote.toObject();
    } catch (error) {
        console.log(error);
        throw new Error("Failed to edit note");
    }
};


export const SignUpAction = async (formData) => {
    await connectDB();

    const name = formData.get('name');
    const phone = formData.get('phone');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
    }

    try {
        const existingUser = await User.findOne({ phone });
        if (existingUser) {

            throw new Error('User already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, phone, password: hashedPassword });
        await newUser.save();

        return newUser.toObject();
    } catch (error) {
        console.error('SignUpAction Error:', error.message);

        throw new Error(error.message);
    }
};

export const LoginAction = async (formData) => {
    await connectDB();

    const phone = formData.get('phone');
    const password = formData.get('password');

    try {

        const user = await User.findOne({ phone });
        if (!user) {
            throw new Error('User not found');
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        return user.toObject();
    } catch (error) {
        console.log(error);
        throw new Error('Failed to log in');
    }
};

