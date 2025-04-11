const fetchUsers = async (page = 1, limit = 5) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/users?_limit=${limit}&_page=${page}`);
    if (!res.ok) throw new Error('Failed to fetch users!');
    return res.json();
  };
  
  export default fetchUsers;
  