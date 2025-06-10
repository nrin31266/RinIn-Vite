import TextField from "@mui/material/TextField";
import MainNav from "./components/MainNav/MainNav";
import ProfileNav from "./components/ProfileNav/ProfileNav";
import Divider from "@mui/material/Divider";

const HeaderComponent = () => {
  return (
    <header className="sticky bg-white top-0 z-40 border-b-1 border-gray-200 px-2 py-3">
      <div className="container grid grid-cols-[1fr_auto] gap-4 relative items-center">
        <div className="grid grid-cols-[auto_1fr] items-center md:gap-4 gap-2">
            <nav aria-label="Home">
                 <img src="/logo.png" alt="Logo" className="h-12 w-12 min-w-12 rounded-md" />
            </nav>
          <TextField
         
          id="filled-size-small"
          variant="outlined"
          size="small"
          placeholder="Search..."
          className="md:w-96"
        />
        </div>
        <div className="grid grid-cols-[auto_auto_auto] items-center gap-2 md:gap-4">
            <MainNav />
            <Divider orientation="vertical" flexItem  variant="middle"/>
            <ProfileNav/>
        </div>
        
      </div>
    </header>
  );
};

export default HeaderComponent;
