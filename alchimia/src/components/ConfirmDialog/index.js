import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const ConfirmDialog = (props) => {
  const { title, children, open, setOpen, onConfirm, state } = props;
  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="confirm-dialog"
    >
      <DialogTitle id="confirm-dialog">{title}</DialogTitle>
      <DialogContent>{children}</DialogContent>
      <DialogActions>
        {state === "delete" && (
          <>
            <Button
              variant="contained"
              onClick={() => setOpen(false)}
              color="primary"
            >
              No
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setOpen(false);
                onConfirm();
              }}
              color="default"
            >
              Yes
            </Button>
          </>
        )}
        {state === "confirm" && (
          <>
            <Button
              variant="contained"
              onClick={() => setOpen(false)}
              color="default"
            >
              No
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setOpen(false);
                onConfirm();
              }}
              color="primary"
            >
              Yes
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
