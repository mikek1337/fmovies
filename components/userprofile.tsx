import { getAuthSession } from "@/lib/auth";

const UserProfile = async () => {
  const session = await getAuthSession();
  return (
  <></>
  );
};

export default UserProfile;
