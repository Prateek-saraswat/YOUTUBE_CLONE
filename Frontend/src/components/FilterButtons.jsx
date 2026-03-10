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
    <div className="sticky top-14 bg-white z-40 flex gap-3 overflow-x-auto py-2 whitespace-nowrap no-scrollbar w-full max-w-full">
      
      {/* Loop through categories and create a button for each */}
      {categories.map((category) => (
        
        <button
          key={category} // unique key for React list rendering
          
          // When clicked, update the selected category
          onClick={() => onCategoryChange(category)}

          // Dynamic styling based on active category
          className={`px-4 py-2 rounded-lg text-sm font-medium flex-shrink-0 transition
          ${
            activeCategory === category
              ? "bg-black text-white" // style for active category
              : "bg-gray-200 text-black hover:bg-gray-300" // style for inactive category
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