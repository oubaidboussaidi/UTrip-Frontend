import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Selection,
  Inject,
  Toolbar,
  Edit,
  Sort,
  Filter,
  Search,
} from '@syncfusion/ej2-react-grids';

import { Header } from '../components';
import apiAdmin from '../../api/apiAdmin';

const EventsAdmin = () => {
  const [events, setEvents] = useState([]);
  const gridRef = useRef(null);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const initialSearch = searchParams.get('search') || "";

  const selectionSettings = {
    type: 'Multiple',
    persistSelection: true,
    checkboxOnly: true,
    mode: 'Row',
  };

  const toolbarOptions = ['Delete', 'Search'];
  const editing = { allowDeleting: true, allowEditing: false };

  useEffect(() => {
    console.log("▶ useEffect → fetchEvents()");
    fetchEvents();
  }, []);

  useEffect(() => {
    if (gridRef.current) {
      if (initialSearch) {
        setTimeout(() => {
          gridRef.current.search(initialSearch);
        }, 1000);
      } else {
        // Clear search if no param is present
        gridRef.current.search("");
      }
    }
  }, [initialSearch, events]);

  const fetchEvents = async () => {
    console.log("▶ fetchEvents CALLED");
    try {
      const { data } = await apiAdmin.fetchAllEvents();
      console.log("✔ fetchAllEvents RESPONSE:", data);

      const formatted = data.map(ev => ({
        ...ev,
        primaryId: ev.id, // required for selection
        date: new Date(ev.date),
      }));

      console.log("✔ formatted events:", formatted);
      setEvents(formatted);
    } catch (err) {
      console.error("✖ fetchEvents ERROR:", err);
      alert('⚠️ Could not fetch events');
    }
  };

  // ================================================================
  // SELECTION LOGGING
  // ================================================================

  const rowSelected = (args) => {
    console.log("▶ rowSelected EVENT");
    console.log("   → Selected row data:", args.data);
    console.log("   → Selected index:", args.rowIndex);

    const recs = gridRef.current?.getSelectedRecords() || [];
    console.log("   → getSelectedRecords() after select:", recs);
  };

  const rowDeselected = (args) => {
    console.log("▶ rowDeselected EVENT");
    console.log("   → Deselected data:", args.data);
    console.log("   → Deselected index:", args.rowIndex);

    const recs = gridRef.current?.getSelectedRecords() || [];
    console.log("   → getSelectedRecords() after deselect:", recs);
  };

  const selectionChanged = (args) => {
    console.log("▶ selectionChanged EVENT:", args);

    const recs = gridRef.current?.getSelectedRecords() || [];
    console.log("   → getSelectedRecords() inside selectionChanged:", recs);

    console.log("   → Row Indexes:", gridRef.current?.getSelectedRowIndexes());
  };

  const dataBound = () => {
    console.log("▶ dataBound EVENT (grid loaded)");

    const recs = gridRef.current?.getSelectedRecords() || [];
    console.log("   → getSelectedRecords() on dataBound:", recs);
  };

  // ================================================================
  // DELETE HANDLER
  // ================================================================
  const toolbarClick = async (args) => {
    console.log("▶ toolbarClick triggered:", args);

    if (args.item.id === 'eventsGrid_delete') {
      console.log("▶ Delete button clicked");

      const selectedRecords = gridRef.current?.getSelectedRecords() || [];

      console.log("▶ toolbarClick → getSelectedRecords():", selectedRecords);
      console.log("   → Selected row indexes:", gridRef.current?.getSelectedRowIndexes());
      console.log("   → Selected row elements:", gridRef.current?.getSelectedRows());

      if (!selectedRecords.length) {
        console.warn("⚠ No items selected");
        return alert('⚠️ Select at least one event.');
      }

      if (!window.confirm(`Delete ${selectedRecords.length} event(s)?`)) {
        console.log("✖ Delete cancelled");
        return;
      }

      try {
        for (const ev of selectedRecords) {
          console.log("▶ Attempting to delete event primaryId:", ev.primaryId);
          await apiAdmin.deleteEvent(ev.primaryId); // FIXED
          console.log("✔ Deleted:", ev.primaryId);
        }

        alert('✅ Event(s) deleted!');
        fetchEvents();
      } catch (err) {
        console.error("✖ Error deleting events:", err);
        alert('⚠️ Error deleting events');
      }
    }
  };

  // ================================================================
  // Row Styling
  // ================================================================
  const rowDataBound = (args) => {
    console.log("▶ rowDataBound:", args.data);

    if (args.data.status === 'APPROVED') {
      args.row.style.background = "#f5f5f5";
      args.row.style.opacity = "0.6";
    }
  };

  // ================================================================
  // Status Dropdown Template
  // ================================================================
  const StatusTemplate = (props) => {
    console.log("▶ Rendering StatusTemplate for:", props);

    const [open, setOpen] = React.useState(false);
    const btnRef = React.useRef(null);
    const [coords, setCoords] = React.useState({ x: 0, y: 0 });

    const toggleDropdown = () => {
      console.log("▶ toggleDropdown clicked");

      if (!open && btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect();
        setCoords({ x: rect.x, y: rect.bottom + 4 });
        console.log("▶ Dropdown coords:", rect);
      }
      setOpen(!open);
    };

    const handleAction = async (newStatus) => {
      console.log(`▶ handleAction → New Status "${newStatus}" for ID:`, props.id);

      try {
        if (newStatus === "APPROVED") await apiAdmin.approveEvent(props.id);
        if (newStatus === "REJECTED") await apiAdmin.rejectEvent(props.id);
        if (newStatus === "PENDING") await apiAdmin.setPendingEvent(props.id);

        console.log("✔ Status updated:", newStatus);
        alert(`Status changed to ${newStatus}`);

        setOpen(false);
        fetchEvents();
      } catch (err) {
        console.error("✖ Status update failed", err);
        alert("⚠️ Status update failed");
      }
    };

    const badgeClasses = {
      APPROVED: "bg-green-200 text-green-800",
      REJECTED: "bg-red-200 text-red-800",
      PENDING: "bg-yellow-200 text-yellow-800",
    };

    return (
      <>
        <button
          ref={btnRef}
          onClick={toggleDropdown}
          className={`px-3 py-1 rounded-full font-semibold hover:opacity-80 ${badgeClasses[props.status]}`}
        >
          {props.status} ▼
        </button>

        {open && (
          <div
            style={{
              position: "fixed",
              top: coords.y,
              left: coords.x,
              zIndex: 9999,
            }}
            className="w-36 bg-white border rounded shadow-xl"
          >
            <button className="block w-full px-3 py-2 hover:bg-yellow-100"
              onClick={() => handleAction("PENDING")}
            >
              Set Pending
            </button>
            <button className="block w-full px-3 py-2 hover:bg-green-100"
              onClick={() => handleAction("APPROVED")}
            >
              Approve
            </button>
            <button className="block w-full px-3 py-2 hover:bg-red-100"
              onClick={() => handleAction("REJECTED")}
            >
              Reject
            </button>
          </div>
        )}
      </>
    );
  };

  // ================================================================
  // Status Cell Color
  // ================================================================
  const statusCellColor = (args) => {
    console.log("▶ Coloring status cell:", args.data.status);

    if (args.data.status === 'APPROVED') args.cell.style.backgroundColor = '#d4edda';
    if (args.data.status === 'PENDING') args.cell.style.backgroundColor = '#fff3cd';
    if (args.data.status === 'REJECTED') args.cell.style.backgroundColor = '#f8d7da';
  };

  // ================================================================
  // RENDER GRID
  // ================================================================
  return (
    <div className="bg-gray-50/50 dark:bg-main-dark-bg min-h-screen p-6 md:p-10 text-gray-900 dark:text-white">
      <Header category="Page" title="Manage Events" />

      <GridComponent
        id="eventsGrid"
        ref={gridRef}
        dataSource={events}
        primaryKey="primaryId"  // FIXED
        allowPaging
        allowSorting
        allowFiltering
        enableHover={false}
        pageSettings={{ pageCount: 5 }}
        selectionSettings={selectionSettings}
        toolbar={toolbarOptions}
        editSettings={editing}
        toolbarClick={toolbarClick}
        queryCellInfo={statusCellColor}
        rowDataBound={rowDataBound}
        height={600}

        // selection logging
        rowSelected={rowSelected}
        rowDeselected={rowDeselected}
        selectionChanged={selectionChanged}
        dataBound={dataBound}
      >
        <ColumnsDirective>

          {/* REQUIRED primary key column */}
          <ColumnDirective field="primaryId" isPrimaryKey={true} visible={false} />

          <ColumnDirective type="checkbox" width={50} />
          <ColumnDirective field="title" headerText="Event Name" width="150" />
          <ColumnDirective field="location" headerText="Location" width="120" />
          <ColumnDirective field="date" headerText="Date" width="120" textAlign="Center" format="yMd" />
          <ColumnDirective field="category" headerText="Category" width="100" />
          <ColumnDirective field="price" headerText="Price" width="80" textAlign="Right" format="C2" />
          <ColumnDirective
            field="status"
            headerText="Status"
            width="150"
            textAlign="Center"
            template={StatusTemplate}
          />
          <ColumnDirective field="organizerEmail" headerText="Organizer Email" width="220" />

        </ColumnsDirective>

        <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter, Search]} />
      </GridComponent>
    </div>
  );
};

export default EventsAdmin;
