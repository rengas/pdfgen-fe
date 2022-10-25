import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

import "./ErrorDialog.css";

export default function SimpleDialog(props) {
    const { onClose, errorMsg, open } = props;
  
    const handleClose = () => {
      onClose();
    };
  
    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Error</DialogTitle>
        
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{errorMsg}</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  
  SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    errorMsg: PropTypes.string.isRequired,
  };