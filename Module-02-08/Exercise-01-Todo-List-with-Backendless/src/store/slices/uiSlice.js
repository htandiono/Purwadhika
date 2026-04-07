export const createUiSlice = (set) => ({
    filter: "All",
    searchQuery: "",
    sortOrder: "newest",

    setFilter: (filter) => set({ filter }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
    setSortOrder: (sortOrder) => set({ sortOrder }),
});
