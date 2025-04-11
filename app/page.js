import UserPage from "@/components/templates/UserPage";
import fetchUsers from "@/utils/fetchUsers";

export default async function Home() {
  const users = await fetchUsers();
  return (
    <UserPage initialUsers={users} />
  );
}
