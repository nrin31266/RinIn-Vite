import React from "react";
import BoxComponent from "../../../../components/BoxComponent/BoxComponent";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { sendEmailVerification, setUser, verifyEmail } from "../../../../store/authSlice";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const { error, status, user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      token: "",
    },
    onSubmit: async (values) => {
      // Handle form submission logic here
      console.log("Form submitted:", values);
      await dispatch(verifyEmail({ token: values.token })).unwrap().then(() => {
        navigate("/");
      });
    },
    validationSchema: Yup.object({
      token: Yup.string()
        .required("Verification token is required")
        .min(6, "Token must be at least 6 characters"),
    }),
  });

  return (
    <div>
      <BoxComponent className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-700">Verify Email</h1>
        <p className="text-gray-600 text-sm">
          Please check your email for a verification link. If you don't see it,
          check your spam folder.
        </p>
        <form className="space-y-4" action="" onSubmit={formik.handleSubmit}>
          <div className="space-y-1">
            <div>
              <label htmlFor="token" className="font-medium text-gray-700">
                Verification Token
              </label>
            </div>
            <TextField
              id="token"
              name="token"
              type="text"
              onChange={formik.handleChange}
              value={formik.values.token}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="Enter your verification token"
              error={formik.touched.token && Boolean(formik.errors.token)}
              helperText={formik.touched.token && formik.errors.token}
            />
          </div>
          {
            error.verifyEmail && <p className="text-error">
              {error.verifyEmail}
            </p>
          }
          <div className="mt-6">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={status.verifyEmail === "loading" || status.sendEmailVerification === "loading"}
              loading={status.verifyEmail === "loading"}
            >
              Verify
            </Button>
          </div>
        </form>
        <p className="text-gray-600 text-sm">
          If you didn't receive the email, you can request a new one.
        </p>
        <Button
          variant="outlined"
          color="primary"
          size="large"
          fullWidth
          disabled={status.sendEmailVerification === "loading" || status.verifyEmail === "loading"}
          loading={status.sendEmailVerification === "loading"}
          onClick={async () => {
            // Logic to resend verification email
            console.log("Resend verification email");
            await dispatch(sendEmailVerification());
          }}
        >
          Resend Verification Email
        </Button>
      </BoxComponent>
    </div>
  );
};

export default VerifyEmail;
