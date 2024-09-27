"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Ensure you're using Next.js router
import { toast, Toaster } from 'react-hot-toast';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch user data from localStorage or an API if needed
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    } else {
      router.push('/auth/login'); // Redirect to login if no user is found
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/auth/login'); // Redirect to login after logout
  };

  return (
    <div className='p-4 rounded-lg border max-w-md mx-auto mt-40 bg-white shadow-md'>
      <Toaster /> {/* Include the Toaster component */}
      <h1 className='text-2xl font-semibold mb-4'>Dashboard</h1>
      {user ? (
        <div>
          <p className='text-lg mb-4'>Welcome, {user.name}!</p>
          <p className='text-lg mb-4'>Phone: {user.phone}!</p>
          <Button onClick={handleLogout} className="w-full mt-4">Logout</Button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
