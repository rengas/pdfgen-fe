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
import { Typography } from '@mui/material';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import TableViewIcon from '@mui/icons-material/TableView';

import ErrorDialog from '../ErrorDialog/ErrorDialog';
import designService from '../../services/design.service';
import "./Dashboard.css";

const columns = [
  { id: 'id', label: 'ID', width: '100px'},
  { id: 'name', label: 'NAME', width: '100px'},
  { id: 'createdAt',label: 'CREATED AT', width: '100px'},
  { id: 'updatedAt',label: 'UPDATED AT', width: '100px'},
  { id: 'name',label: 'GENERATED PDF', width: '100px'},
  { id: 'action', label: 'ACTION', width: '100px'},
];

function Dashboard() {
  const [focused, setFocused] = useState(false);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState([]);
  const [count, setCouunt] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState('');
  const [errDlgOpen, setErrDlgOpen] = useState(false);
  const height = 40;
  const labelOffset = -6;

  useEffect(() => {
      fetchDesigns();
  }, [page]);

  const fetchDesigns = async () => {
    try {
      const queryStr = `count=${count}&page=${page + 1}`;
        const res = await designService.listDesign(queryStr);
        console.log(res);
        const {data} = res;

        if (data) {
          const {designs, pagination} = data;
          if (page === 0) {
            setRows(designs);
          } else {
            setRows((prev) => [...prev, ...designs]);
          }

          if (pagination && 'Total' in pagination) {
            console.log(pagination.Total)
            setTotalCount(pagination.Total);
          }
        }
    } catch (err) {
      setErrMsg(err?.message);
      setErrDlgOpen(true);
    }
  }

  const onFocus = () => setFocused(true);
  const onBlur = () => setFocused(false);

  const handleChangePage = (event, newPage) => {
    console.log(newPage);
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

       <div className="dashboard__table--wrapper">
        <TableContainer sx={{ maxHeight: 'calc(100vh - 11.375rem)', width: 'calc(100vw - 7.25rem)'}}>
          <Table stickyHeader aria-label="Design Table" sx={{tableLayout: 'fixed'}}>
            <TableHead>
              <TableRow>
                {columns.map((column, columnHeadIndex) => (
                  <TableCell
                    key={column.id + column.label + columnHeadIndex}
                    align={column.align}
                    style={{ width: column.width, backgroundColor: '#F3F4F6', color: '#6B7280', fontWeight: 600, padding: '.5rem' }}
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

                              {/* <IconButton aria-label="view" key={row.id + 'view-btn' + columnIndex} >
                                <TableViewIcon />
                              </IconButton> */}
                            </TableCell> : <TableCell key={row.id + value + columnIndex} style={{width: column.width, padding: '.5rem'}}>
                              <div style={{overflow: "hidden", textOverflow: "ellipsis"}}>
                                <Typography noWrap>
                                  {value}
                                </Typography>
                              </div>
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        {
          rows && rows.length > 0 && <TablePagination sx={{width: 'calc(100vw - 9.25rem)'}}
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={totalCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        }
       </div>
      <ErrorDialog errorMsg={errMsg} open={errDlgOpen} onClose={handleClose} />
     </div>
  );
}
export default Dashboard;