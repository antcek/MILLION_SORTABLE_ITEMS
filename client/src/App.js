import React, { useState, useEffect, useCallback } from "react";
import { Box, Container, TextField, Typography, CircularProgress } from "@mui/material";
import { DragDropContext } from "react-beautiful-dnd";
import axios from "axios";
import ItemList from "./components/ItemList";
import "./App.css";

const API_BASE_URL = process.env.NODE_ENV === "production" ? "/api" : "http://localhost:5000/api";

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [sortOrder, setSortOrder] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const stateResponse = await axios.get(`${API_BASE_URL}/state`);
        const { selectedIds = [], sortOrder = [] } = stateResponse.data;

        setSelectedIds(selectedIds);
        setSortOrder(sortOrder);

        await fetchItems(1, searchTerm, selectedIds, sortOrder);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, []);

  const fetchItems = async (pageNum, search, selected = selectedIds, order = sortOrder) => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/items`, {
        params: {
          page: pageNum,
          limit: 20,
          search: search,
        },
      });

      const { items, totalCount, hasMore } = response.data;
      setItems((prevItems) => (pageNum === 1 ? items : [...prevItems, ...items]));
      setTotalCount(totalCount);
      setHasMore(hasMore);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching items:", error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setPage(1);
    fetchItems(1, value);
  };

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchItems(nextPage, searchTerm);
    }
  }, [loading, hasMore, page, searchTerm]);

  const handleToggleSelect = useCallback((id) => {
    setSelectedIds((prevSelected) => {
      let newSelected;
      if (prevSelected.includes(id)) {
        newSelected = prevSelected.filter((itemId) => itemId !== id);
      } else {
        newSelected = [...prevSelected, id];
      }

      axios
        .post(`${API_BASE_URL}/selection`, { selectedIds: newSelected })
        .catch((error) => console.error("Error updating selection:", error));

      return newSelected;
    });
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.index === destination.index) return;

    const reorderedItems = [...items];

    const [movedItem] = reorderedItems.splice(source.index, 1);

    reorderedItems.splice(destination.index, 0, movedItem);

    setItems(reorderedItems);

    const newSortOrder = reorderedItems.map((item) => item.id);
    setSortOrder(newSortOrder);

    axios
      .post(`${API_BASE_URL}/sort`, { sortOrder: newSortOrder })
      .catch((error) => console.error("Error updating sort order:", error));
  };

  return (
    <Container maxWidth="md" className="App">
      <Typography variant="h4" component="h1" gutterBottom>
        Test Task - Data List (1,000,000 items)
      </Typography>

      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Type to search..."
        />
      </Box>

      <Typography variant="body2" gutterBottom>
        {selectedIds.length} items selected | Total results: {totalCount}
      </Typography>

      <DragDropContext onDragEnd={handleDragEnd}>
        <ItemList
          items={items}
          selectedIds={selectedIds}
          onToggleSelect={handleToggleSelect}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          loading={loading}
        />
      </DragDropContext>

      {loading && (
        <Box display="flex" justifyContent="center" mt={2}>
          <CircularProgress />
        </Box>
      )}
    </Container>
  );
}

export default App;
