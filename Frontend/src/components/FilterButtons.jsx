// src/components/FilterButtons.jsx

// List of categories used to filter videos (similar to YouTube category filters)
const categories = [
  "All",
  "Music",
  "Gaming",
  "Education",
  "Sports",
  "News",
  "Entertainment",
  "Science & Tech",
  "Comedy",
];

// FilterButtons component
// Props:
// activeCategory -> currently selected category
// onCategoryChange -> function to update selected category
const FilterButtons = ({ activeCategory, onCategoryChange }) => {
  return (

    // sticky -> keeps the filter bar fixed while scrolling
    // top-14 -> distance from top (to stay below header)
    // overflow-x-auto -> allows horizontal scrolling on small screens
    // whitespace-nowrap -> keeps buttons in a single line
    <div className="sticky top-14 bg-white z-40 flex gap-3 items-center overflow-x-auto px-3 py-2 whitespace-nowrap no-scrollbar w-full max-w-full border-b border-gray-100">

      {/* Loop through categories and create a button for each */}
      {categories.map((category) => (

        <button
          key={category} // unique key for React list rendering
          role="tab"
          aria-selected={activeCategory === category}

          // When clicked, update the selected category
          onClick={() => onCategoryChange(category)}

          // Dynamic styling based on active category — matches YouTube chip design
          className={`px-3 py-1.5 rounded-lg text-sm font-medium flex-shrink-0 transition-colors duration-150 cursor-pointer
            ${
              activeCategory === category
                ? "bg-[#0f0f0f] text-white"           // active: YT near-black chip
                : "bg-[#f2f2f2] text-[#0f0f0f] hover:bg-[#e5e5e5]"  // inactive: YT light gray chip
            }`}
        >
          {/* Display category name */}
          {category}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;