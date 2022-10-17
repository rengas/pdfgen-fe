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
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TableViewIcon from '@mui/icons-material/TableView';
import axios from 'axios';

import "./Dashboard.css";
import { getHostName } from '../../api/apiClient';
import { auth } from "../../config/firebase";

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
    minWidth: 150,
  },
  {
    id: 'pdf',
    label: 'GENERATED PDF',
    minWidth: 150
  },
  {
    id: 'action',
    label: 'ACTION',
    minWidth: 120
  },
];

function Dashboard() {
  const [user, loading, error] = useAuthState(auth);
  const [focused, setFocused] = useState(false);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
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
    // if (!user) return navigate("/");
    
    if (user) {
      sessionStorage.setItem('token', user.accessToken);
      fetchDesigns();
    }
  }, [user, loading]);

  const fetchDesigns = async () => {
    const URL = `${getHostName()}/design?count=10&page=1&search=in`;
    const authToken = sessionStorage.getItem('token');
    if (authToken) {
        const config = {
            headers: { Authorization: `Bearer ${authToken}`,  'Content-Type': 'application/json' }
        };
        const res = await axios.get(URL, config);
        const {data} = res;

        if (data) {
            console.log(data);
        }
    }
  }

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

  const handleSearchTermChange = (e) => {
    console.log(e.target.value);
    setSearchTerm(e.target.value);
  }

  const handleSearch = async () => {
    if (searchTerm) {
      const URL = `${getHostName()}/design?q=${searchTerm}`;
      const authToken = sessionStorage.getItem('token');
      if (authToken) {
          const config = {
              headers: { Authorization: `Bearer ${authToken}`,  'Content-Type': 'application/json' }
          };
          const res = await axios.get(URL, config);
          const {data} = res;

          if (data) { 
              console.log(data);
          }
      }
    }
  }

  const handleDelete = async(row) => {
    const URL = `${getHostName()}/design/${row.id}`;
    const authToken = sessionStorage.getItem('token');
    if (authToken) {
        const config = {
            headers: { Authorization: `Bearer ${authToken}`,  'Content-Type': 'application/json' }
        };
        const res = await axios.delete(URL, config);
        const {data} = res;

        if (data) { 
            console.log(data);
        }
    }
  }

  const handleEdit = async (row) => {
    const URL = `${getHostName()}/design/${row.id}`;
    const authToken = sessionStorage.getItem('token');
    if (authToken) {
        const config = {
            headers: { Authorization: `Bearer ${authToken}`,  'Content-Type': 'application/json' }
        };
        const res = await axios.get(URL, config);
        const {data} = res;

        if (data) { 
            console.log(data);
        }
    }
  }

  return (
    <div className="dashboard">
       <div className="dashboard__header">
        <Button variant="contained" onClick={navigateToAddDesign}>Add Design</Button>
        <TextField id="search" className="dashboard__search--text" label="Search" variant="outlined" onFocus={onFocus} onBlur={onBlur}
          value={searchTerm}
          onChange={handleSearchTermChange}
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
        <Button variant="contained" onClick={handleSearch}>Search</Button>
       </div>

       <TableContainer sx={{ maxHeight: 'calc(100vh - 11.375rem)' }}>
        <Table stickyHeader aria-label="Design Table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth, backgroundColor: '#F3F4F6', color: '#6B7280', fontWeight: 600, padding: '.5rem' }}
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
                        column.label === 'ACTION' ? <TableCell key={column.id} style={{
                          display: 'flex',
                          gap: '.5rem',
                          padding: '.5rem'
                        }}>
                            <IconButton aria-label="delete" onClick={() => handleDelete(row)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>

                            <IconButton aria-label="edit" onClick={() => handleEdit(row)}>
                              <EditIcon fontSize="small" />
                            </IconButton>

                            {/* <IconButton aria-label="view">
                              <TableViewIcon />
                            </IconButton> */}
                          </TableCell> : <TableCell key={column.id}  style={{padding: '.5rem'}}>
                          {value}
                        </TableCell>
                      )
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