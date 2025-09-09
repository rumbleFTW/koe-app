export function Footer() {
  return (
    <footer className="border-t bg-white w-full">
      <div className="px-0 md:px-20 flex h-24 flex-col items-center justify-center text-center text-sm text-gray-500 md:flex-row md:justify-between">
        <p>&copy; {new Date().getFullYear()} Koe Labs. All Rights Reserved.</p>
        <div className="mt-2 flex space-x-4 md:mt-0">
          <a href="#" className="hover:text-gray-900">Privacy</a>
          <a href="#" className="hover:text-gray-900">Terms</a>
        </div>
      </div>
    </footer>
  );
}