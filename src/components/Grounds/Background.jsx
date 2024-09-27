'use client'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const Background = () => {
    const [user, setUser] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) {
            setUser(storedUser);
        } else {
            router.push('/auth/login'); // Redirect to login if no user is found
        }
    }, [router]);

    const userName = user?.name;
    const firstName = userName ? userName.split(' ')[0] : '';

    // Log user data when it changes
    // useEffect(() => {
    //     if (user) {
    //         console.log(user);
    //     }
    // }, [user]);

    return (
        <div className='fixed h-screen w-full z-[2]' >
            <div className='absolute top-[5%]  w-full ps-5 justify-start text-zinc-200 flex py-10 font-semibold text-4xl md:text-9xl' >
                Welcome, <span className='text-[#c7c5c5]'>{firstName}</span>
            </div>

            {/* at the bottom of the screen at the center */}
            <div className='absolute bottom-[2%] w-full'>
                <h2 className='text-center text-zinc-800 opacity-50 text-sm font-semibold'>
                    Made with ❤️ by Om Nandurkar
                </h2>
            </div>
        </div>
    );
}

export default Background;
