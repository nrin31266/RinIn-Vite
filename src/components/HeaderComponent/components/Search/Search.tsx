import TextField from "@mui/material/TextField";
import React, { useEffect, useRef, useState } from "react";
import { fetchConnections } from "./../../../../store/networkingSlide";
import type { IUser } from "../../../../store/authSlice";
import { useAppDispatch } from "../../../../store/store";
import { search } from "../../../../store/searchSlide";
import SearchCardItem from "./components/SearchCardItem";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [searching, setSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [openSearchContent, setOpenSearchContent] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null); // Tham chiếu đến phần tử chứa TextField và kết quả tìm kiếm
  const contentRef = useRef<HTMLDivElement>(null); // Tham chiếu đến phần tử chứa kết quả tìm kiếm
  const [searchResults, setSearchResults] = useState<IUser[]>([]); // Giả sử bạn có một mảng kết quả tìm kiếm
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    // Lắng nghe click bên ngoài để đóng kết quả tìm kiếm
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) && // Nếu click ngoài TextField
        contentRef.current &&
        !contentRef.current.contains(event.target as Node) // và ngoài content
      ) {
        setOpenSearchContent(false); // Đóng kết quả tìm kiếm
      }
    };

    // Thêm event listener cho click bên ngoài
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Dọn dẹp event listener khi component bị hủy
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    // Giả sử bạn có một hàm để thực hiện tìm kiếm, delay sau khi dừng nhập 0.5s mới fetch
    const searchUser = async () => {
      if (searchTerm.trim() === "") {
        setSearching(false);
        return;
      }
      setSearching(true);
      // Gọi API hoặc thực hiện tìm kiếm ở đây
      // Ví dụ: dispatch(fetchConnections(searchTerm));
      console.log(`Searching for: ${searchTerm}`);
      await dispatch(search(searchTerm)).unwrap().then((results) => {
        setSearchResults(results as IUser[]);
        setSearching(false);
        setOpenSearchContent(true); // Mở kết quả tìm kiếm khi có kết quả
        console.log(`Search results:`, results);
      });

    //   setTimeout(() => {
    //     // Giả lập việc tìm kiếm
    //     setSearching(false);
    //   }, 1000);
    };
    const delayDebounceFn = setTimeout(() => {
      searchUser();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="md:relative">
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search..."
        size="small"
        className="bg-white rounded-md"
        onClick={() => setOpenSearchContent(true)}
        onChange={(e) => setSearchTerm(e.target.value)}
        inputRef={searchRef}
      />
      <div
        ref={contentRef}
        className={`absolute flex flex-col w-full md:w-[28rem] h-[20rem] overflow-auto left-0 top-13 bg-white border border-gray-300 shadow-md rounded-xs z-50
             ${openSearchContent ? "block" : "hidden"}`}
      >
        <div className="flex text-gray-700 p-2 items-center justify-center">
            <p>{searching ? "Searching..." : (searchResults.length < 1 && searchTerm.length > 0)  ? "No results found" : searchTerm.length < 1 ?
             "Search now..." : ""}</p>
        </div>
        <div className="flex flex-col w-full h-full space-y-2">
          {!searching && searchTerm.length>0 && searchResults.map((user) => (
            <SearchCardItem key={user.id} user={user} onClick={() => {
                navigate(`/profile/${user.id}`)
                setOpenSearchContent(false); // Đóng kết quả tìm kiếm khi click vào một kết quả
            }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Search;
