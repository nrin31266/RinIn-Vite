import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../../store/store';
import { useLocation, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import { register } from '../../../../store/authSlice';
import * as Yup from 'yup';
import BoxComponent from '../../../../components/BoxComponent/BoxComponent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import OtherLogin from '../../components/OtherLogin/OtherLogin';

const Register = () => {
  const {error, status} = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();



  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      console.log(values);
      await dispatch(register({email: values.email, password: values.password}));
      if (status.register === "succeeded") {
        const from= "/";
        navigate(from);
      }
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
      password: Yup.string()
        .min(3, "Password must be at least 3 characters")
        .required("Required"),
    }),
  });

  return (
    <div>
      <BoxComponent className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-700">Register</h1>
        <p className="text-gray-600 text--sm">
          Create a new account by filling out the form below. 
          You will be able to log in once your account is created.
        </p>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <div>
              <label htmlFor="email" className="font-medium text-gray-700">
                Email
              </label>
            </div>
            <TextField
              id="email"
              name="email"
              placeholder="Email"
              type="email"
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.email}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              fullWidth
            />
          </div>
          <div>
            <div>
              <label htmlFor="password" className="font-medium text-gray-700">
                Password
              </label>
            </div>
            <TextField
              id="password"
              name="password"
              placeholder="Password"
              type="password"
              variant="outlined"
              onChange={formik.handleChange}
              value={formik.values.password}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              fullWidth
              
            />
          </div>
          {
            error.register && status.register === "failed" ? (
              <div className="text-error">
                {error.register}
              </div>
            ) : null
          }
          
          <div className="mt-8">
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              disabled={status.register === "loading" ? true : false}
              loading={status.register === "loading" ? true : false}
            >
              Agree & Register
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <Divider>Or</Divider>
        </div>
        <div>
          <OtherLogin/>
        </div>
        <div className="text-center text-gray-600 mt-8">
          Have an account?{" "}
          <a href="/auth/login" className="text-[var(--primary-color)]">
            Login
          </a>
        </div>
      </BoxComponent>
       <h1 className="text-sm mx-auto text-gray-700 text-center">Bạn đang muốn tạo một trang cho doanh nghiệp? <a href="" className="text-[var(--primary-color)] hover:underline">Nhận trợ giúp</a></h1>
    </div>
  );
}

export default Register