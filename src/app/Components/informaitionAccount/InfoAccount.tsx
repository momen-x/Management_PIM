"use client";
import { Button, Divider, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import SaveIcon from "@mui/icons-material/Save";
import LockIcon from "@mui/icons-material/Lock";
import { useRouter } from "next/navigation";

interface UserData {
  username: string;
  email: string;
}

const InfoAccount = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>({
    username: "",
    email: "",
  });
  const [originalData, setOriginalData] = useState<UserData>({
    username: "",
    email: "",
  });
//   const [isLoading, setIsLoading] = useState(true);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openDeleteAcountDialog, setOpenDeleteAcountDialog] = useState(false);

  const handleChange = (
    name: string,
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setUserData({ ...userData, [name]: e.target.value });
  };

  const handleDeleteAccount = async () => {
    setOpenDeleteAcountDialog(true);
  };

//   if (isLoading) {
//     return <div>Loading...</div>;
//   }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Typography variant="h4" component="h1" gutterBottom>
        Profile Settings
      </Typography>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <Typography variant="h6" gutterBottom className="mb-6">
          Profile Information
        </Typography>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <PersonIcon color="action" />
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={userData.username}
                onChange={(e) => handleChange("username", e)}
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
                onChange={(e) => handleChange("email", e)}
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
            size="large"
            disabled={
              userData.username === originalData.username &&
              userData.email === originalData.email
            }
          >
            Save Changes
          </Button>
        </div>
      </div>

      <Divider className="my-8" />

      <div className="bg-white rounded-lg shadow-md p-6">
        <Typography variant="h6" gutterBottom className="mb-6">
          Security Settings
        </Typography>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <LockIcon color="action" />
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              onClick={() => setOpenPasswordDialog(true)}
            >
              Change Password
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <LockIcon color="action" />
            <Button
              variant="outlined"
              color="error"
              fullWidth
              onClick={handleDeleteAccount}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoAccount;
