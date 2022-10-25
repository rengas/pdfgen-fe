import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';

import "./MessageDialog.css";

const useStyles = makeStyles({
  paper: { minWidth: "500px" }
});

export default function MessageDialog(props) {
    const { onClose, msg, open } = props;
    const classes = useStyles(props);
  
    const handleClose = () => {
      onClose();
    };
  
    return (
      <Dialog onClose={handleClose} open={open} classes={{ paper: classes.paper}}>
        <DialogTitle>Message</DialogTitle>
        
        <DialogContent>
          <DialogContentText id="alert-dialog-description">{msg}</DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  
  MessageDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    msg: PropTypes.string.isRequired,
  };