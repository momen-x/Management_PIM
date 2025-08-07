import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { domineName } from "@/app/utils/tokenName";
import { Alert } from "@mui/material";

interface PasswordDialogProps {
  id: number;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogEditPasswordAccount = ({
  id,
  open,
  setOpen,
}: PasswordDialogProps) => {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setPasswords({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors("");
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = "";

    if (!passwords.oldPassword.trim()) {
      newErrors = "Current password is required";
      valid = false;
    }

    if (!passwords.newPassword.trim()) {
      newErrors = "New password is required";
      valid = false;
    } else if (passwords.newPassword.length < 8) {
      newErrors = "Password must be at least 8 characters";
      valid = false;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      newErrors = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handlePasswordChange = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors("");

    try {
      const response = await axios.put(`${domineName}/api/profile/${id}`, {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword,
        confirmNewPassword: passwords.confirmPassword,
      });

      // Show success message or handle success

      handleClose();
    } catch (error: any) {
      console.error("Password update error:", error);

      if (error.response && error.response.data) {
        const message =
          error.response.data.message || "Failed to update password";
        setErrors(message);
      } else {
        setErrors("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof typeof passwords, value: string) => {
    setPasswords((prev) => ({ ...prev, [field]: value }));
    if (errors) {
      setErrors("");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Update Password</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To change your password, please enter your current password and then
          your new password.
        </DialogContentText>
        {errors && (
          <Alert severity="error" onClose={() => setErrors("")} sx={{ mb: 2 }}>
            {errors}
          </Alert>
        )}
        <TextField
          margin="dense"
          id="oldPassword"
          label="Current Password"
          type="password"
          fullWidth
          variant="standard"
          value={passwords.oldPassword}
          onChange={(e) => handleInputChange("oldPassword", e.target.value)}
          disabled={isLoading}
          required
        />
        <TextField
          margin="dense"
          id="newPassword"
          label="New Password"
          type="password"
          fullWidth
          variant="standard"
          value={passwords.newPassword}
          onChange={(e) => handleInputChange("newPassword", e.target.value)}
          disabled={isLoading}
          required
        />
        <TextField
          margin="dense"
          id="confirmPassword"
          label="Confirm New Password"
          type="password"
          fullWidth
          variant="standard"
          value={passwords.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          disabled={isLoading}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isLoading}>
          Cancel
        </Button>
        <Button onClick={handlePasswordChange} disabled={isLoading}>
          {isLoading ? "Updating..." : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogEditPasswordAccount;
