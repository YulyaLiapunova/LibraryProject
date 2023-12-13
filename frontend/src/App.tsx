import React, { useState } from "react";
import { Tab, Tabs } from "@mui/material";
import Books from './Books';
import Users from './Users';

function App() {
  const [currentTabIndex, setCurrentTabIndex] = useState(0);

  const handleTabChange = (_e: any, tabIndex: React.SetStateAction<number>) => {
    setCurrentTabIndex(tabIndex);
  };

  return (
    <React.Fragment>
      <Tabs value={currentTabIndex} onChange={handleTabChange}>
        <Tab label="Книги" />
        <Tab label="Клиенты" />
      </Tabs>

      {/* TAB 1 Contents */}
      {currentTabIndex === 0 && (
        <Books />
      )}

      {/* TAB 2 Contents */}
      {currentTabIndex === 1 && (
        <Users />
      )}
    </React.Fragment>
  );
}

export default App;
