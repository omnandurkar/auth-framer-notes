"use client";

import { SignUpAction } from '@/actions/page';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation'; // Ensure you're using Next.js router
import { Loader2, Triangle } from 'lucide-react';
import Link from 'next/link';

const SignUpForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [loading, setLoading] = useState(false);

    const router = useRouter(); // Use the Next.js router for navigation

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        try {
            const result = await SignUpAction(new FormData(e.target));
            toast.success('Sign up successful!');
            setFormData({ name: '', phone: '', password: '', confirmPassword: '' });
            // Redirect to login page
            router.push('/auth/login');
        } catch (error) {
            if (error.message === 'User already exists') {
                toast.error('User already exists');
            } else if (error.message === 'Passwords do not match') {
                toast.error('Passwords do not match');
            } else {
                toast.error('Sign up failed. Please try again.');
            }
            console.error('Sign Up Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row bg-gray-100  h-screen">

            <div className="hidden lg:flex flex-col space-y-10 items-center justify-center flex-1 bg-white text-black">
                <div className="max-w-md text-center">
                    <img src='https://autuswealth.co.uk/wp-content/uploads/2024/05/undraw_team_up_re_84ok-1-2022x2048.png' alt='logo' className='w-96 h-96' />
                </div>
                <Link href="/" >
                    <h1 className='text-6xl font-bold'> LinkShift Notes</h1>
                </Link>
            </div>

            <Link href="/" >
                <h1 className='text-5xl md:hidden text-center py-16 font-bold'>LinkShift Notes</h1>
            </Link>


            <Toaster />

            <div className=" bg-gray-100 md:w-1/2 w-full flex flex-col  items-center justify-center">

                <div className=' flex flex-col border-2 w-10/12 md:w-1/2 p-2 bg-white py-7 rounded-xl shadow-xl justify-center items-center'>
                    <h2 className='font-bold text-lg md:text-xl'>Create your account</h2>
                    <p className='text-xs text-neutral-500 font-medium'>Welcome! Please fill in the details to get started.</p>

                    <form onSubmit={handleSubmit} className="space-y-4 w-full p-8  rounded-md mx-auto">
                        <div>
                            <Label className="text-gray-500" htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                value={formData.name}
                                onChange={handleChange}
                                className="mt-1"
                                required
                            />
                        </div>
                        <div>
                            <Label className="text-gray-500" htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                name="phone"
                                type="text"
                                value={formData.phone}
                                onChange={handleChange}
                                className="mt-1"
                                required
                            />
                        </div>
                        <div>
                            <Label className="text-gray-500" htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="mt-1 "
                                required
                            />
                        </div>
                        <div>
                            <Label className="text-gray-500" htmlFor="confirmPassword">Confirm Password</Label>
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="mt-1"
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full mt-4 active:scale-90 drop-shadow-lg" disabled={loading} >
                            {loading ? <div className='flex'> <Loader2 className='animate-spin h-5 ' /> <h2>Creating Account...</h2></div> : <div className='flex justify-center items-center'> Sign Up<span> <Triangle className='rotate-90 h-2 fill-gray-300' /> </span> </div>}
                        </Button>
                    </form>

                    <div>
                        <h1 className='text-xs text-gray-400 font-medium'>Already have an account? <Link className='font-semibold text-black' href="/auth/login" >Sign in</Link></h1>
                    </div >
                </div>
            </div>
        </div>
    );
};

export default SignUpForm;
