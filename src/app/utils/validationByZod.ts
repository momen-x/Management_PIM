import * as z from "zod";

const registerUser = z
  .object({
    name: z.string().min(3, "the name must be at least 3 characters").max(74),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(8, "the password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "the password must be at least 8 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });
const editUserPassword= z
  .object({
    oldPassword: z
      .string()
      .min(8, "the old password must be at least 8 characters"),
    newPassword: z
      .string()
      .min(8, "the password must be at least 8 characters"),
    confirmPassword: z
      .string()
      .min(8, "the password must be at least 8 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ["confirmPassword"],
  }) ;

const editUserInfo = z.object({
  name: z
    .string()
    .min(3, "the name must be at least 3 characters")
    .max(74)
    .optional(),
  email: z.string().email("Please enter a valid email address").optional(),
});



const loginUser = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "the password must be at least 8 characters"),
});

const deleteAcount = z.object({
  password: z.string().min(8),
});

const addNewProduct = z.object({
  title: z.string().min(1, "Title is required"),
  price: z.number().positive("Price must be a positive number"),
  ads: z.number().positive("Ads value must be positive").optional(),
  discount: z.number().positive("Discount must be positive").optional(),
  tax: z.number().positive("Tax must be positive").optional(),
  total: z.number().positive("Total must be a positive number"),
  categorie: z.string().optional(),
});

const editProduct = z.object({
  title: z.string().min(1, "Title is required").optional(),
  price: z.number().positive("Price must be a positive number").optional(),
  ads: z.number().positive("Ads value must be positive").optional(),
  discount: z.number().positive("Discount must be positive").optional(),
  tax: z.number().positive("Tax must be positive").optional(),
  total: z.number().positive("Total must be a positive number").optional(),
  categorie: z.string().optional(),
});

// Export all schemas
export {
  registerUser,
  editUserInfo,
  editUserPassword,
  loginUser,
  addNewProduct,
  editProduct,
  deleteAcount
};

// Type exports for TypeScript usage
export type RegisterUser = z.infer<typeof registerUser>;
export type EditUserInfo = z.infer<typeof editUserInfo>;
export type editUserPassword = z.infer<typeof editUserPassword>;
export type LoginUser = z.infer<typeof loginUser>;
export type AddNewProduct = z.infer<typeof addNewProduct>;
export type EditProduct = z.infer<typeof editProduct>;
