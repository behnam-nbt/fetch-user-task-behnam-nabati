import React from 'react';

function UserTable({ users, onSort, onRowClick }) {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg border border-zinc-400">
      <table className="w-full text-left border-collapse rounded-lg">
        <thead className="bg-blue-600 text-white">
          <tr>
            {['name', 'email', 'username'].map((key) => (
              <th
                key={key}
                onClick={() => onSort(key)}
                className="px-6 py-3 text-lg font-semibold cursor-pointer hover:bg-blue-700 transition"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)} ⬆⬇
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr
              key={user.id}
              className={`cursor-pointer transition hover:bg-blue-100 ${
                index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
              }`}
              onClick={() => onRowClick(user)}
            >
              <td className="px-6 py-4 border-b">{user.name}</td>
              <td className="px-6 py-4 border-b">{user.email}</td>
              <td className="px-6 py-4 border-b">{user.username}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
