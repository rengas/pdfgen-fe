import React, { useEffect, useState } from "react";
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

import ErrorDialog from '../ErrorDialog/ErrorDialog';
import designService from '../../services/design.service';
import "./Dashboard.css";

const columns = [
  { id: 'id', label: 'ID', minWidth: 170 },
  { id: 'name', label: 'NAME', minWidth: 100 },
  {
    id: 'createdAt',
    label: 'CREATED AT',
    minWidth: 170,
  },
  {
    id: 'updatedAt',
    label: 'UPDATED AT',
    minWidth: 150,
  },
  {
    id: 'name',
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
  const [focused, setFocused] = useState(false);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState('');
  const [errDlgOpen, setErrDlgOpen] = useState(false);
  const height = 40;
  const labelOffset = -6;

  useEffect(() => {
    console.log('Rendering');
      fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
        const res = await designService.listDesign();
        const {data} = res;

        if (data) {
            setRows(data);
        }
    } catch (err) {
      setErrMsg(err?.message);
      setErrDlgOpen(true);
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
      try {
          const res = await designService.listDesign();
          const {data} = res;

          if (data) { 
              console.log(data);
          }
      } catch (err) {
        setErrMsg(err?.message);
        setErrDlgOpen(true);
      }
    }
  }

  const handleDelete = async(row) => {
    try {
      const res = await designService.deleteDesign(row.id);
      const {data} = res;

      if (data) { 
          console.log(data);
      }
    } catch (err) {
      setErrMsg(err?.message);
      setErrDlgOpen(true);
    }
  }

  const handleEdit = async (row) => {
    try {
      const res = await designService.getDesignByID(row.id);
      const {data} = res;

      if (data) { 
          console.log(data);
      }
    } catch (err) {
      setErrMsg(err?.message);
      setErrDlgOpen(true);
    }
  }

  const handleClose = () => {
    setErrDlgOpen(false);
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
              {columns.map((column, columnHeadIndex) => (
                <TableCell
                  key={column.id + column.label + columnHeadIndex}
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
              .map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.id + index}>
                    {columns.map((column, columnIndex) => {
                      const value = row[column.id];
                      return (
                        column.label === 'ACTION' ? <TableCell key={row.id + value + columnIndex} style={{
                          display: 'flex',
                          gap: '.5rem',
                          padding: '.5rem'
                        }}>
                            <IconButton aria-label="delete" key={row.id + 'delete-btn' + columnIndex} 
                              onClick={() => handleDelete(row)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>

                            <IconButton aria-label="edit"  key={row.id + 'edit-btn' + columnIndex} 
                              onClick={() => handleEdit(row)}>
                              <EditIcon fontSize="small" />
                            </IconButton>

                            {/* <IconButton aria-label="view">
                              <TableViewIcon />
                            </IconButton> */}
                          </TableCell> : <TableCell key={row.id + value + columnIndex} style={{padding: '.5rem'}}>
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
      <ErrorDialog errorMsg={errMsg} open={errDlgOpen} onClose={handleClose} />
     </div>
  );
}
export default Dashboard;