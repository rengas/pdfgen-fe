import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

import "./Dashboard.css";
import { auth, logout } from "../../config/firebase";

const columns = [
  { id: 'id', label: 'ID', minWidth: 170 },
  { id: 'name', label: 'NAME', minWidth: 100 },
  {
    id: 'created_at',
    label: 'CREATED AT',
    minWidth: 170,
  },
  {
    id: 'updated_at',
    label: 'UPDATED AT',
    minWidth: 170,
  },
  {
    id: 'pdf',
    label: 'GENERATED PDF',
    minWidth: 170
  },
];

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [name, setName] = useState("");
  const [focused, setFocused] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const height = 40;
  const labelOffset = -6;
  const rows = [
    {id: '3928493578-dfd76fd8-df8ydfyd-fdjfhd898r1', name: 'Invoice Singapore', created_at: '21-09-2022', updated_at: '21-09-2022', pdf: 'download sample.pdf'},
    {id: '3928493578-dfd76fd8-df8ydfyd-fdjfhd898r2', name: 'Invoice Singapore', created_at: '21-09-2022', updated_at: '21-09-2022', pdf: 'download sample.pdf'},
    {id: '3928493578-dfd76fd8-df8ydfyd-fdjfhd898r3', name: 'Invoice Singapore', created_at: '21-09-2022', updated_at: '21-09-2022', pdf: 'download sample.pdf'},
    {id: '3928493578-dfd76fd8-df8ydfyd-fdjfhd898r4', name: 'Invoice Singapore', created_at: '21-09-2022', updated_at: '21-09-2022', pdf: 'download sample.pdf'},
    {id: '3928493578-dfd76fd8-df8ydfyd-fdjfhd898r5', name: 'Invoice Singapore', created_at: '21-09-2022', updated_at: '21-09-2022', pdf: 'download sample.pdf'},
    {id: '3928493578-dfd76fd8-df8ydfyd-fdjfhd898r6', name: 'Invoice Singapore', created_at: '21-09-2022', updated_at: '21-09-2022', pdf: 'download sample.pdf'},
    {id: '3928493578-dfd76fd8-df8ydfyd-fdjfhd898r7', name: 'Invoice Singapore', created_at: '21-09-2022', updated_at: '21-09-2022', pdf: 'download sample.pdf'},
    {id: '3928493578-dfd76fd8-df8ydfyd-fdjfhd898r8', name: 'Invoice Singapore', created_at: '21-09-2022', updated_at: '21-09-2022', pdf: 'download sample.pdf'},
    {id: '3928493578-dfd76fd8-df8ydfyd-fdjfhd898r9', name: 'Invoice Singapore', created_at: '21-09-2022', updated_at: '21-09-2022', pdf: 'download sample.pdf'},
    {id: '3928493578-dfd76fd8-df8ydfyd-fdjfhd898r0', name: 'Invoice Singapore', created_at: '21-09-2022', updated_at: '21-09-2022', pdf: 'download sample.pdf'},
  ];

  useEffect(() => {
    if (loading) return;
    if (!user) return navigate("/");
    
    if (user) {
      console.log(user.refreshToken);
      user.getIdToken().then(result => {
        console.log(result);
        sessionStorage.setItem('token', result);
      })
      setName(user.displayName);
    }
  }, [user, loading]);

  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const navigateToAddDesign = () => {
    navigate("/add-design");
  }

  return (
    <div className="dashboard">
       <div className="dashboard__header">
        <Button variant="contained" onClick={navigateToAddDesign}>Add Design</Button>
        <TextField id="search" className="dashboard__search--text" label="Search" variant="outlined" onFocus={onFocus} onBlur={onBlur}
          /* styles the wrapper */
          style={{ height }}

          /* styles the label component */
          InputLabelProps={{
            style: {
              height,
              ...(!focused && { top: `${labelOffset}px` }),
            },
          }}

          /* styles the input component */
          inputProps={{
              style: {
                height,
                padding: '0 14px',
              },
          }}
        />
        <Button variant="contained">Search</Button>
       </div>

       <TableContainer sx={{ maxHeight: 'calc(100vh - 8.375rem)' }}>
        <Table stickyHeader aria-label="Design Table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, backgroundColor: '#F3F4F6', color: '#6B7280', fontWeight: 600 }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
     </div>
  );
}
export default Dashboard;