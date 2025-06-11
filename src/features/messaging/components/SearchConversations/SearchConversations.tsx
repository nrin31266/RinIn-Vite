import SearchIcon from "@mui/icons-material/Search";
import { use, useEffect, useRef, useState } from "react";

import type { IUser } from "../../../../store/authSlice";
import UserContactCard from "../UserContactCard/UserContactCard";

interface SearchConversationsProps {
  autoFocus: boolean;
  contacts: IUser[];
  loading: boolean;
}
const SearchConversations = ({ autoFocus, contacts, loading }: SearchConversationsProps) => {
  
const searchRef = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (autoFocus && searchRef.current) {
      searchRef.current.focus();
    }
  }, [autoFocus]);
  
 


  const filteredUsers: IUser[] = search
    ? contacts.filter((c) => {
        const fullName = `${c.firstName} ${c.lastName}`;
        return fullName.toLowerCase().includes(search.toLowerCase());
      })
    : contacts;

  return (
    <div>
      <div className="h-[4rem] border-b border-gray-200 flex items-center justify-center px-2 relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border-2 border-gray-300 outline-none w-full py-2 pr-2 pl-10 rounded-sm focus:border-[var(--primary-color)]"
          placeholder="Search conversations..."
          ref={searchRef}
        />
        <SearchIcon className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400" />
      </div>
      <div className="p-4 overflow-auto h-[calc(100vh-14rem)] space-y-4 flex flex-col">
        {loading  ? (
          <div className="text-center text-gray-500">Loading contacts...</div>
        ) : (
          filteredUsers.map((user) => (
            <UserContactCard key={user.id} contact={user} />
          ))
        )}
      </div>
    </div>
  );
};

export default SearchConversations;
