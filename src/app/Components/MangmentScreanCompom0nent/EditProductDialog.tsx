import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import axios from "axios";
import { Alert, Box, CircularProgress } from "@mui/material";
import { domineName } from "@/app/utils/tokenName";

interface IEditBody {
  price: number;
  title: string;
  total: number;
  tax?: number;
  ads?: number;
  discount?: number;
  categorie?: string;
}

interface IProduct {
  price: number;
  title: string;
  total: number;
  tax: number;
  ads: number;
  discount: number;
  categorie: string;
}

interface ProductDialogProps {
  id: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  product: IProduct;
  onSuccess?: () => void; // Add callback for successful update
}

const DialogEditProducts = ({
  id,
  open,
  setOpen,
  product,
  onSuccess,
}: ProductDialogProps) => {
  const [productData, setProductData] = useState({
    title: "",
    price: 0,
    ads: 0,
    tax: 0,
    discount: 0,
    categorie: "",
    total: 0,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setProductData({
        title: product.title,
        price: product.price,
        ads: product.ads,
        tax: product.tax,
        discount: product.discount,
        categorie: product.categorie,
        total: product.total,
      });
      setError("");
      setSuccess(false);
    }
  }, [open, product]);

  const handleClose = () => {
    setOpen(false);
    setError("");
    setSuccess(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]:
        name === "title" || name === "categorie" ? value : Number(value) || 0,
    }));

    if (error) setError("");
  };

  useEffect(() => {
    if (productData.price > 0) {
      const total =
        productData.price +
        (productData.ads || 0) +
        (productData.tax || 0) -
        (productData.discount || 0);
      setProductData((prev) => ({ ...prev, total: Math.max(0, total) }));
    } else {
      setProductData((prev) => ({ ...prev, total: 0 }));
    }
  }, [
    productData.price,
    productData.ads,
    productData.tax,
    productData.discount,
  ]);

  const validateForm = (): boolean => {
    if (!productData.title.trim()) {
      setError("Product title is required");
      return false;
    }

    if (productData.price <= 0) {
      setError("Price must be greater than 0");
      return false;
    }

    if (productData.total <= 0) {
      setError("Total must be greater than 0");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const body: IEditBody = {
        price: productData.price,
        title: productData.title,
        total: productData.total,
      };

      if (productData.tax > 0) body.tax = productData.tax;
      if (productData.discount > 0) body.discount = productData.discount;
      if (productData.ads > 0) body.ads = productData.ads;
      if (productData.categorie.trim()) body.categorie = productData.categorie;

      await axios.put(`${domineName}/api/products/${id}`, body);

      setSuccess(true);
      location.reload();
      if (onSuccess) onSuccess();
      setTimeout(handleClose, 1500);
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to update product";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle>Update Product Data</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To change your product, please fill in the new data
          </DialogContentText>

          {/* Status Alerts */}
          {error && (
            <Alert severity="error" onClose={() => setError("")} sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Product updated successfully!
            </Alert>
          )}

          {/* Product Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">
              Product Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <TextField
                fullWidth
                required
                name="title"
                label="Product Title"
                value={productData.title}
                onChange={handleInputChange}
                disabled={loading}
              />
              <TextField
                fullWidth
                name="categorie"
                label="Category"
                value={productData.categorie}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <TextField
                fullWidth
                required
                name="price"
                label="Price"
                type="number"
                value={productData.price}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                disabled={loading}
              />
              <TextField
                fullWidth
                name="ads"
                label="Ads Cost"
                type="number"
                value={productData.ads}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                disabled={loading}
              />
              <TextField
                fullWidth
                name="tax"
                label="Tax"
                type="number"
                value={productData.tax}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                disabled={loading}
              />
              <TextField
                fullWidth
                name="discount"
                label="Discount"
                type="number"
                value={productData.discount}
                onChange={handleInputChange}
                InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                disabled={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200">
                <span className="font-medium text-gray-700">
                  Total per item:
                </span>
                <span
                  className={`text-xl font-bold ${
                    productData.total > 0 ? "text-green-600" : "text-gray-400"
                  }`}
                >
                  {productData.total > 0
                    ? `$${productData.total.toFixed(2)}`
                    : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default DialogEditProducts;
