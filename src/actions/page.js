"use server";

import { connectDB } from "@/database";
import Notes from "@/models/notes";
import User from "@/models/user";
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Encryption settings
const algorithm = 'aes-256-ctr';
const secretKey = process.env.SECRET_KEY;

// Encryption function
const encrypt = (text) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(secretKey, 'hex'), iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

// Decryption function
const decrypt = (hash) => {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(secretKey, 'hex'), Buffer.from(hash.iv, 'hex'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrypted.toString();
};


// Add Note Action
export const AddNoteAction = async (noteData) => {
    'use server';
    await connectDB();

    const tag = {
        isOpen: noteData.isOpen,
        tagTitle: noteData.tagTitle,
        tagColor: noteData.tagColor,
    };

    try {
        // console.log("Note data received on server:", noteData);

        const encryptedNote = encrypt(noteData.desc);
        const encryptedTitle = encrypt(noteData.title);


        const encryptedNoteString = JSON.stringify(encryptedNote);
        const encryptedTitleString = JSON.stringify(encryptedTitle);

        const note = new Notes({
            title: encryptedTitleString,
            desc: encryptedNoteString,
            link: noteData.link,
            tag,
            user: noteData.user,
        });

        await note.save();
        return note.toObject();
    } catch (error) {
        console.error('Failed to add note:', error);
        throw new Error('Failed to add note');
    }
};





// Fetch Notes Action
export const FetchNoteAction = async (userId) => {
    // console.log("Fetching notes for userId:", userId);

    await connectDB();

    try {
        const notes = await Notes.find({ user: userId }).exec();


        const decryptedNotes = notes.map(note => {
            const noteObject = note.toObject();


            let decryptedDesc, decryptedTitle;

            try {
                decryptedDesc = decrypt(JSON.parse(noteObject.desc));
            } catch (error) {
                console.error("Failed to parse and decrypt description:", error);
                decryptedDesc = "Decryption error";
            }

            try {
                decryptedTitle = decrypt(JSON.parse(noteObject.title));
            } catch (error) {
                console.error("Failed to parse and decrypt title:", error);
                decryptedTitle = "Decryption error";
            }

            return {
                ...noteObject,
                title: decryptedTitle,
                desc: decryptedDesc,
            };
        });

        // console.log("Fetched notes:", decryptedNotes);
        return decryptedNotes;
    } catch (error) {
        console.error("Failed to fetch notes:", error);
        throw new Error("Failed to fetch notes");
    }
};



// Delete Note Action
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
// Edit Note Action
export const EditNoteAction = async (id, formData, userId) => {
    await connectDB();

    const { title, desc, link, isOpen, tagTitle, tagColor } = formData;

    const tag = {
        isOpen,
        tagTitle,
        tagColor,
    };

    try {

        const encryptedTitle = JSON.stringify(encrypt(title));
        const encryptedDesc = JSON.stringify(encrypt(desc));

        const updatedNote = await Notes.findOneAndUpdate(
            { _id: id, user: userId },
            { title: encryptedTitle, desc: encryptedDesc, tag, link },
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


// Sign Up Action
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

// Login Action
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
