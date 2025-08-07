"use client";
import {
  Alert,
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import SaveIcon from "@mui/icons-material/Save";
import LockIcon from "@mui/icons-material/Lock";
import axios from "axios";
import { domineName } from "@/app/utils/tokenName";
import DialogEditPasswordAccount from "./PasswordDialogProps";
import DeleteAcountDialog from "./DeleteAcountDialog";

interface UserData {
  username: string;
  email: string;
}

interface InfoAccountProps {
  id: number;
  email: string;
  name: string;
  onUpdate?: () => void; // Callback after successful update
}

const InfoAccount = ({ id, email, name }: any) => {
  const [userData, setUserData] = useState<UserData>({
    username: "",
    email: "",
  });
  const [originalData, setOriginalData] = useState<UserData>({
    username: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openDeleteAccountDialog, setOpenDeleteAccountDialog] = useState(false);

  useEffect(() => {
    setOriginalData({ username: name, email: email });
    setUserData({ username: name, email: email });
  }, [name, email]);

  const validateForm = (): boolean => {
    if (!userData.email.trim() || !userData.username.trim()) {
      setError("Please fill all fields");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
      setError("Please enter a valid email address");
      return false;
    }

    setError("");
    return true;
  };

  const handleUpdateUserInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await axios.put(`${domineName}/api/profile/${id}`, {
        name: userData.username,
        email: userData.email,
      });

      location.reload();

      setSuccess(true);
      setOriginalData(userData); // Update original data to match new values
      // if (onUpdate) onUpdate(); // Trigger callback if provided
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update profile";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof UserData, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  };

  const SecurityButton = ({
    onClick,
    label,
    color,
  }: {
    onClick: () => void;
    label: string;
    color: "primary" | "error";
  }) => (
    <div className="flex items-center gap-2">
      <LockIcon color="action" />
      <Button variant="outlined" color={color} fullWidth onClick={onClick}>
        {label}
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Typography variant="h4" component="h1" gutterBottom>
        Profile Settings
      </Typography>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <Typography variant="h6" gutterBottom className="mb-6">
          Profile Information
        </Typography>
        <DialogEditPasswordAccount
          open={openPasswordDialog}
          setOpen={setOpenPasswordDialog}
          id={id}
        />
         <DeleteAcountDialog
        id={id}
        open={openDeleteAccountDialog}
        setOpen={setOpenDeleteAccountDialog}
      />

        {error && (
          <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            onClose={() => setSuccess(false)}
            sx={{ mb: 2 }}
          >
            Profile updated successfully!
          </Alert>
        )}

        <Box component="form" onSubmit={handleUpdateUserInfo}>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <PersonIcon color="action" />
                <TextField
                  fullWidth
                  label="Username"
                  variant="outlined"
                  value={userData.username}
                  onChange={(e) => handleChange("username", e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center gap-2">
                <EmailIcon color="action" />
                <TextField
                  fullWidth
                  label="Email"
                  variant="outlined"
                  type="email"
                  value={userData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={
                loading ? <CircularProgress size={20} /> : <SaveIcon />
              }
              size="large"
              disabled={
                (userData.username === originalData.username &&
                  userData.email === originalData.email) ||
                loading
              }
            >
              {loading ? "Updating..." : "Save Changes"}
            </Button>
          </div>
        </Box>
      </div>

      <Divider className="my-8" />

      <div className="bg-white rounded-lg shadow-md p-6">
        <Typography variant="h6" gutterBottom className="mb-6">
          Security Settings
        </Typography>

        <div className="space-y-4">
          <SecurityButton
            onClick={() => setOpenPasswordDialog(true)}
            label="Change Password"
            color="primary"
          />
          <SecurityButton
            onClick={() => setOpenDeleteAccountDialog(true)}
            label="Delete Account"
            color="error"
          />
        </div>
      </div>
    </div>
  );
};

export default InfoAccount;
