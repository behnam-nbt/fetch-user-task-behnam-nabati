'use client'
import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setSelectedUser, toggleModal } from '@/redux/userSlice';
import Modal from '../modules/Modal';
import ClipLoader from 'react-spinners/ClipLoader';
import UserTable from '../modules/UserTable';
import Pagination from '../modules/Pagination';
import fetchUsers from "@/utils/fetchUsers";

function UserPage({ initialUsers = [] }) {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasData, setHasData] = useState(true);

  const [page, setPage] = useState(1); // Default to page 1 initially

  const dispatch = useDispatch();
  const modalOpen = useSelector((state) => state.user.modalOpen);
  const selectedUser = useSelector((state) => state.user.selectedUser);

  const router = useRouter(); 

  // Get the page query parameter from the URL and set it to state
  useEffect(() => {
    const urlPage = new URLSearchParams(window.location.search).get('page');
    if (urlPage) {
      setPage(parseInt(urlPage, 10));
    }
  }, []);

  // Update the URL query parameter when page changes
  useEffect(() => {
    router.push(`?page=${page}`, undefined, { shallow: true });
  }, [page, router]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Sorting logic
  const sortedUsers = useMemo(() => {
    if (!sortKey) return users;
    return [...users].sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
  }, [users, sortKey]);

  // Filtering logic
  const filteredUsers = useMemo(() => {
    return sortedUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedUsers, searchTerm]);

  // Fetch users on page change
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const current = await fetchUsers(page);
        const next = await fetchUsers(page + 1);

        setUsers(current);
        setHasData(next.length > 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    loadUsers();
  }, [page]);

  return (
    <div className="container mx-auto p-4 relative">
      <input
        className="border border-zinc-500 w-full p-2 mb-10 rounded-md focus:outline-none"
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <ClipLoader color="#0984e3" size={50} />
        </div>
      ) : (
        <UserTable
          users={filteredUsers}
          onSort={setSortKey}
          onRowClick={(user) => {
            dispatch(setSelectedUser(user));
            dispatch(toggleModal());
          }}
        />
      )}

      <Pagination
        page={page}  // Pass the current page to Pagination
        hasNext={hasData}
        onPrev={() => setPage((prev) => prev - 1)}  // Decrease the page number
        onNext={() => setPage((prev) => prev + 1)}  // Increase the page number
      />

      {modalOpen && <Modal user={selectedUser} />}
    </div>
  );
}

export default UserPage;
