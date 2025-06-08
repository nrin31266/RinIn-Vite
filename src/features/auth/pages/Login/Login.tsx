import BoxComponent from "../../../../components/BoxComponent/BoxComponent";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { login } from "../../../../store/authSlice";
import Divider from "@mui/material/Divider";
import OtherLogin from "../../components/OtherLogin/OtherLogin";
import { useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const {error, status} = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      console.log(values);
      await dispatch(login({email: values.email, password: values.password})).unwrap().then(() => {
         // Redirect to the page user was trying to access before login
        const from = location.state?.from || "/";
        navigate(from);
      });
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
        <h1 className="text-3xl font-bold text-gray-700">Login</h1>
        <p className="text-gray-600 text--sm">
          Welcome back! Please enter your credentials to access your account.
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
            error.login && status.login === "failed" ? (
              <div className="text-error">
                {error.login}
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
              disabled={status.login === "loading" ? true : false}
              loading={status.login === "loading" ? true : false}
            >
              Login
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
          Don't have an account?{" "}
          <a href="/auth/register" className="text-[var(--primary-color)]">
            Register
          </a>
        </div>
      </BoxComponent>
    </div>
  );
};

export default Login;
