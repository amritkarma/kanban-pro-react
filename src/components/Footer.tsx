const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6 mt-8">
      <div className="container mx-auto text-center">
        <p className="text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Kanban Board. All rights reserved.
        </p>
        <p className="text-xs mt-2 text-gray-500">
          Built with React and Tailwind CSS.
        </p>
      </div>
    </footer>
  );
};

export default Footer;