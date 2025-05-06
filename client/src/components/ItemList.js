import React, { useRef, useEffect } from "react";
import { List, ListItem, Checkbox, Paper, Box, Typography } from "@mui/material";
import { Droppable, Draggable } from "react-beautiful-dnd";
import DragHandleIcon from "@mui/icons-material/DragHandle";

const ItemList = ({ items, selectedIds, onToggleSelect, onLoadMore, hasMore, loading }) => {
  const observer = useRef();

  const lastItemRef = (node) => {
    if (loading) return;

    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  };

  if (items.length === 0 && !loading) {
    return (
      <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
        <Typography align="center">No items found</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2}>
      <Droppable droppableId="items-list">
        {(provided) => (
          <List
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{ width: "100%", bgcolor: "background.paper", p: 0 }}
          >
            {items.map((item, index) => {
              const isSelected = selectedIds.includes(item.id);
              const isLastItem = index === items.length - 1;

              return (
                <Draggable key={item.id} draggableId={`item-${item.id}`} index={index}>
                  {(dragProvided) => (
                    <ListItem
                      ref={(node) => {
                        dragProvided.innerRef(node);
                        if (isLastItem) lastItemRef(node);
                      }}
                      divider
                      {...dragProvided.draggableProps}
                      sx={{
                        cursor: "pointer",
                        backgroundColor: isSelected ? "rgba(25, 118, 210, 0.08)" : "inherit",
                        display: "flex",
                        alignItems: "center",
                        "&:hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.04)",
                        },
                      }}
                    >
                      <Box
                        {...dragProvided.dragHandleProps}
                        sx={{ mr: 1, display: "flex", alignItems: "center" }}
                      >
                        <DragHandleIcon />
                      </Box>

                      <Checkbox
                        edge="start"
                        checked={isSelected}
                        onChange={() => onToggleSelect(item.id)}
                        sx={{ mr: 1 }}
                      />

                      <Box sx={{ flexGrow: 1 }}>
                        <Typography>{item.value}</Typography>
                      </Box>
                    </ListItem>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </Paper>
  );
};

export default ItemList;
