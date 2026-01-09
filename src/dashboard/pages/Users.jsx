import React, { useState, useEffect, useRef } from 'react';
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
} from '@syncfusion/ej2-react-grids';

import { Header } from '../components';
import apiAdmin from '../../api/apiAdmin';

const Users = () => {
  const [users, setUsers] = useState([]);
  const gridRef = useRef(null);

  const selectionSettings = {
    type: 'Multiple',
    persistSelection: true,
    checkboxOnly: true,
    mode: 'Row'
  };

  const toolbarOptions = ['Delete'];
  const editSettings = { allowDeleting: true, allowEditing: false };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data } = await apiAdmin.fetchAllUsers();

      const formatted = data.map(u => ({
        ...u,
        id: u.email,
        isAdmin: u.role?.toLowerCase() === 'admin'
      }));

      setUsers(formatted);
    } catch (err) {
      alert('⚠️ Could not fetch users');
    }
  };

  const toolbarClick = async (args) => {
    if (args.item.id === 'usersGrid_delete') {
      const selectedRecords = gridRef.current?.getSelectedRecords() || [];

      // Block admin deletion
      const adminsSelected = selectedRecords.filter(u => u.isAdmin);
      if (adminsSelected.length > 0) {
        alert("❌ You cannot delete admin accounts.");
        return;
      }

      if (!selectedRecords.length) {
        alert('⚠️ Please select at least one user to delete.');
        return;
      }

      if (!window.confirm(`Delete ${selectedRecords.length} user(s)?`)) {
        return;
      }

      try {
        for (const user of selectedRecords) {
          await apiAdmin.deleteUser(user.email);
        }

        alert('✅ User(s) deleted successfully!');
        fetchUsers();
      } catch (err) {
        alert('⚠️ Error deleting user(s)');
      }
    }
  };

  // Disable checkbox for admin rows
  const rowDataBound = (args) => {
    if (args.data.isAdmin) {
      args.row.style.background = "#f8f8f8";
      args.row.style.opacity = "0.7";

      // Disable selection
      const checkboxCell = args.row.querySelector('.e-selectionbackground');
      if (checkboxCell) checkboxCell.style.pointerEvents = "none";

      const checkbox = args.row.querySelector('input[type="checkbox"]');
      if (checkbox) checkbox.disabled = true;
    }
  };

  return (
    <div className="bg-gray-50/50 dark:bg-main-dark-bg min-h-screen p-6 md:p-10 text-gray-900 dark:text-white">
      <Header category="Page" title="Customers" />

      <GridComponent
        id="usersGrid"
        ref={gridRef}
        dataSource={users}
        primaryKey="id"
        enableHover={false}
        allowPaging
        allowSorting
        pageSettings={{ pageCount: 5 }}
        selectionSettings={selectionSettings}
        toolbar={toolbarOptions}
        editSettings={editSettings}
        toolbarClick={toolbarClick}
        rowDataBound={rowDataBound}
      >
        <ColumnsDirective>

          <ColumnDirective type="checkbox" width={50} showCheckbox={true} />

          <ColumnDirective field="id" isPrimaryKey={true} visible={false} />

          <ColumnDirective field="firstName" headerText="First Name" width="150" />
          <ColumnDirective field="lastName" headerText="Last Name" width="150" />
          <ColumnDirective field="email" headerText="Email" width="250" />

          <ColumnDirective
            field="role"
            headerText="Role"
            width="100"
            textAlign="Center"
          />

        </ColumnsDirective>

        <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter]} />
      </GridComponent>
    </div>
  );
};

export default Users;
