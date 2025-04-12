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
  const [users, setUsers] = useState(initialUsers); // State to hold the list of users for the current page
  const [search, setSearch] = useState(''); // Raw search input from the user
  const [searchTerm, setSearchTerm] = useState(''); // Debounced version of search input, used for filtering
  const [sortKey, setSortKey] = useState(null); // Current field to sort by (e.g., name, email, etc.)
  const [isLoading, setIsLoading] = useState(false); // Loading state for async data fetching
  const [error, setError] = useState(null); // Stores any error that occurs during data fetch
  const [hasData, setHasData] = useState(true); // Boolean to track if there's more data (for pagination)

  const [page, setPage] = useState(1); // Current page number

  const dispatch = useDispatch(); // Redux hook to dispatch actions
  const modalOpen = useSelector((state) => state.user.modalOpen); // Redux selector for modal visibility state
  const selectedUser = useSelector((state) => state.user.selectedUser); // Redux selector for currently selected user

  const router = useRouter(); // Next.js router for navigation and URL manipulation

  // On first render, read 'page' and 'sort' query params from the URL
  // and update local state accordingly
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlPage = params.get('page');
    const urlSort = params.get('sort');
    const urlSearch = params.get('search');

    if (urlPage) {
      setPage(parseInt(urlPage, 10)); // convert page to number
    }
    const validSortKeys = ['name', 'email', 'username']; // restrict sort keys to known fields
    if (urlSort && validSortKeys.includes(urlSort)) {
      setSortKey(urlSort);
    }

    if (urlSearch) {
      setSearch(urlSearch);
      setSearchTerm(urlSearch);
    }
  }, []);

  // When the page number changes, update the URL without reloading the page
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
  
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
  
    router.push(`?${params.toString()}`, undefined, { shallow: true });
  }, [search, router]);
  

  // Sorting logic
  const sortedUsers = useMemo(() => {
    if (!sortKey) return users;
    return [...users].sort((a, b) => a[sortKey].localeCompare(b[sortKey]));
  }, [users, sortKey]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (sortKey) {
      params.set('sort', sortKey);
    } else {
      params.delete('sort');
    }
    router.push(`?${params.toString()}`, undefined, { shallow: true });
  }, [sortKey, router]);


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
