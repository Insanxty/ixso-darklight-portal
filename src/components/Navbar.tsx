import LoginButton from "./LoginButton";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 glass-card">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gradient">IXSO</h1>
        <LoginButton />
      </div>
    </nav>
  );
};

export default Navbar;