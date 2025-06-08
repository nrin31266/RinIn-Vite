import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  resetPassword,
  sendResetPassword,
  type IPasswordResetRequest,
} from "../../../../store/authSlice";
import BoxComponent from "../../../../components/BoxComponent/BoxComponent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
const stepSchemas = [
  // step 0
  Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("User email is required"),
  }),
  // step 1
  Yup.object({
    newPassword: Yup.string()
      .min(3, "Password must be at least 3 characters")
      .required("New password is required"),

    token: Yup.string().required("Reset token is required"),
  }),
];

const ResetPassword = () => {
  const { error, status, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const formik = useFormik<IPasswordResetRequest>({
    enableReinitialize: true, // Reinitialize form values when user data changes
    initialValues: {
      token: "",
      email: user?.email || "", // Assuming user email is available
      newPassword: "",
    },
    onSubmit: async (values) => {
      // Handle form submission logic here
      console.log("Form submitted:", values);
      if (step === 0) {
        // Dispatch action to send reset password email
        await dispatch(sendResetPassword({ email: values.email }))
          .unwrap()
          .then(() => {
            setStep(1); // Move to the next step
          });
      } else if (step === 1) {
        // Dispatch action to reset password
        await dispatch(resetPassword(values))
          .unwrap()
          .then(() => {
            navigate("/auth/login"); // Redirect to login after successful reset
          });
      }
    },
    validationSchema: stepSchemas[step],
  });

  return (
    <div>
      <BoxComponent className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-700">Reset Password</h1>
        <p className="text-gray-600 text-sm">
          {step === 0
            ? "Enter your email to receive a token reset password."
            : "Enter your new password and the reset token you received."}
        </p>
        <form className="space-y-4" onSubmit={formik.handleSubmit}>
          <div className="space-y-1">
            <label htmlFor="email" className="font-medium text-gray-700">
              Email
            </label>
           <div className="flex items-center gap-3">
             <TextField
              id="email"
              name="email"
              type="email"
              onChange={formik.handleChange}
              value={formik.values.email}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter your email"
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              disabled={step !== 0} // Disable input if not in step 0
              autoComplete="email"
              sx={{width: step === 0 ? "100%" : "90%"}}
            />
            {step === 1 && <CheckCircleIcon color="success" />}
           </div>
          </div>

          {step === 1 && (
            <>
              <div className="space-y-1">
                <label htmlFor="token" className="font-medium text-gray-700">
                  Reset Token
                </label>
                <TextField
                  id="token"
                  name="token"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.token}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter your reset token"
                  error={formik.touched.token && Boolean(formik.errors.token)}
                  helperText={formik.touched.token && formik.errors.token}
                />
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="newPassword"
                  className="font-medium text-gray-700"
                >
                  New Password
                </label>
                <TextField
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.newPassword}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter your new password"
                  error={
                    formik.touched.newPassword &&
                    Boolean(formik.errors.newPassword)
                  }
                  helperText={
                    formik.touched.newPassword && formik.errors.newPassword
                  }
                />
              </div>
            </>
          )}

          {error.resetPassword && status.resetPassword === "failed" && (
            <p className="text-error">{error.resetPassword}</p>
          )}
          {error.sendResetPassword && status.sendResetPassword === "failed" && (
            <p className="text-error">{error.sendResetPassword}</p>
          )}

          <div className="mt-6">
            <Button
            type="submit"
            variant="contained"
            color="primary"
            className="w-full"
            disabled={status.resetPassword === "loading" || status.sendResetPassword === "loading"}
            loading={status.resetPassword === "loading" || status.sendResetPassword === "loading"}
          >
            {step === 0 ? "Send Token Reset" : "Reset Password"}
          </Button>
          </div>
        </form>
      </BoxComponent>
    </div>
  );
};

export default ResetPassword;
