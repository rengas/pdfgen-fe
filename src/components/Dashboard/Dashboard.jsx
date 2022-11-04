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
import moment from 'moment';

import ErrorDialog from '../ErrorDialog/ErrorDialog';
import MessageDialog from '../MessageDialog/MessageDialog';
import designService from '../../services/design.service';
import { useApp } from '../../contexts/app.context';
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
  const [totalCount, setTotalCount] = useState(0);
  const {appState} = useApp();
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState('');
  const [errDlgOpen, setErrDlgOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgDlgOpen, setMsgDlgOpen] = useState(false);
  const height = 40;
  const labelOffset = -6;

  useEffect(() => {
      fetchDesigns();
  }, [page]);

  useEffect(() => {
    fetchDesigns();
  }, [rowsPerPage]);

  const fetchDesigns = async () => {
    try {
      const queryStr = searchTerm ? `count=${rowsPerPage}&page=${page + 1}&search=${searchTerm}` : `count=${rowsPerPage}&page=${page + 1}`;
        const res = await designService.listDesign(queryStr);
        const {data} = res;

        if (data) {
          const {designs, pagination} = data;
          if (page === 0) {
            setRows(designs ? designs : []);
          } else {
            setRows((prev) => [...prev, ...designs]);
          }

          if (pagination && 'Total' in pagination) {
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
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(() => {
      return 0;
    });
  };

  const navigateToAddDesign = () => {
    navigate("/add-design");
  }

  const handleSearchTermChange = (e) => {
    setSearchTerm(e.target.value);
  }

  const handleSearch = () => {
    if (searchTerm) {
      setPage(() => {
        fetchDesigns();
        return 0;
      });
    }
  }

  const handleDelete = async(row) => {
    try {
      const res = await designService.deleteDesign(row.id);
      const {data} = res;

      if (data) {
        setPage(() => {
          fetchDesigns();
          return 0;
        });
        setMsg('Design deleted successfully');
        setMsgDlgOpen(true);
        setTimeout(() => {
            setMsgDlgOpen(false);
        }, 2000);
      }
    } catch (err) {
      setErrMsg(err?.message);
      setErrDlgOpen(true);
    }
  }

  const handleEdit = (row) => {
    navigate(`/edit-design/${row.id}`);
  }

  const handleClose = () => {
    setErrDlgOpen(false);
  }

  const handleDownload = async (row) => {
    try {
        const payload = {
            DesignId: row.id,
            fields: row.fields,
        };

        const response = await designService.generatePDF(payload);
        const temp = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = temp;
        link.setAttribute('download', `${row.name}.pdf`); //or any other extension
        document.body.appendChild(link);
        link.click();
    } catch(err) {
        setErrMsg(err?.message);
        setErrDlgOpen(true);
    }
  }

  return (
    <div className="dashboard">
       <div className="dashboard__header">
        <Button variant="contained" className="custom-btn" onClick={navigateToAddDesign}>Add Design</Button>
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
        <Button variant="contained" className="custom-btn" onClick={handleSearch}>Search</Button>
       </div>

       <div className={appState.sidebar ? 'dashboard__table--wrapper' : 'dashboard__table--wrapper full-width'}>
        <TableContainer sx={{ maxHeight: 'calc(100vh - 11.375rem)', width: appState.sidebar ? 'calc(100vw - 12.5rem)' : '100vw'}}>
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
                            gap: '1rem',
                            padding: '.5rem'
                          }}>
                              <IconButton aria-label="delete" key={row.id + 'delete-btn' + columnIndex} 
                                onClick={() => handleDelete(row)} className="custom-btn" size="small">
                                <DeleteIcon fontSize="small" />
                              </IconButton>

                              <IconButton aria-label="edit"  key={row.id + 'edit-btn' + columnIndex} 
                                onClick={() => handleEdit(row)} className="custom-btn" size="small">
                                <EditIcon fontSize="small" />
                              </IconButton>

                              {/* <IconButton aria-label="view" key={row.id + 'view-btn' + columnIndex} >
                                <TableViewIcon />
                              </IconButton> */}
                                </TableCell> : ((column.label === 'CREATED AT' || column.label === 'UPDATED AT') ? <TableCell key={row.id + value + columnIndex} style={{width: column.width, padding: '.5rem'}}>
                                  <div style={{overflow: "hidden", textOverflow: "ellipsis"}}>
                                    <Typography noWrap>
                                      {/* <Moment  format="D MMM YYYY, h:mm:ss A">{value}</Moment> */}
                                      {moment(value).format('D MMM YYYY, h:mm:ss A')}
                                    </Typography>
                                  </div>
                              </TableCell> : column.label === 'GENERATED PDF' ? <TableCell key={row.id + value + columnIndex} 
                                style={{width: column.width, padding: '.5rem'}}>
                                  <div style={{overflow: "hidden", textOverflow: "ellipsis"}}>
                                    <Typography noWrap>
                                      <a href="javascript:void(0)" className="download-pdf" onClick={() => handleDownload(row)}>{`${value}.pdf`}</a>
                                    </Typography>
                                  </div>
                              </TableCell>: <TableCell key={row.id + value + columnIndex} style={{width: column.width, padding: '.5rem'}}>
                                  <div style={{overflow: "hidden", textOverflow: "ellipsis"}}>
                                    <Typography noWrap>
                                      {value}
                                    </Typography>
                                  </div>
                              </TableCell>
                            )
                          )
                        }
                      )}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        {
          rows && rows.length > 0 && <TablePagination sx={{width: appState.sidebar ? 'calc(100vw - 15rem)' : 'calc(100vw - 2rem)'}}
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

      <MessageDialog msg={msg} open={msgDlgOpen} onClose={handleClose} />
      <ErrorDialog errorMsg={errMsg} open={errDlgOpen} onClose={handleClose} />
     </div>
  );
}
export default Dashboard;