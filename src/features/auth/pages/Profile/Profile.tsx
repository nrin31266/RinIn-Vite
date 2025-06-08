import React, { useEffect, useState } from "react";
import BoxComponent from "../../../../components/BoxComponent/BoxComponent";
import { useFormik } from "formik";
import {
  updateUserProfile,
  type IUpdateUserProfileReq,
} from "../../../../store/userProfile";
import { useAppDispatch, useAppSelector } from "../../../../store/store";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import * as Yup from "yup";

const stepSchemas = [
  // step 0: chỉ validate firstName & lastName
  Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName:  Yup.string().required("Last name is required"),
  }),
  // step 1: chỉ validate company & position
  Yup.object({
    company:  Yup.string().required("Company is required"),
    position: Yup.string().required("Position is required"),
  }),
  // step 2: chỉ validate location
  Yup.object({
    location: Yup.string().required("Location is required"),
  }),
];


const Profile = () => {
  const [step, setStep] = useState(0);
  const { user } = useAppSelector((state) => state.auth);
  const { error, state } = useAppSelector((state) => state.userProfile);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();



  const formik = useFormik<IUpdateUserProfileReq>({
    enableReinitialize: true,
    initialValues: {
      firstName: user?.firstName ?? "",
      lastName:  user?.lastName  ?? "",
      company:   user?.company   ?? "",
      position:  user?.position  ?? "",
      location:  user?.location  ?? "",
    },
    onSubmit: (values) => {
      console.log(values);
      if (step === 2) {
        // Dispatch action to update user profile
        dispatch(updateUserProfile({ body: values, id: user!.id }))
          .unwrap()
          .then(() => {
            // Navigate to home or another page after successful update
            navigate("/");
          });
      }else{
        // Move to the next step
        setStep(step + 1);
      }
    },
    validationSchema: stepSchemas[step],
  });

  return (
    <div>
      <BoxComponent className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-700">Only One Last Step</h1>
        <p className="text-sm text-gray-600">Manage your profile information</p>
        <form action="" onSubmit={formik.handleSubmit} className="grid grid-cols-2 gap-4">
          {step === 0 && (
            <>
                <div className="space-y-1 col-span-1">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="font-medium text-gray-700"
                    >
                      First Name
                    </label>
                  </div>
                  <TextField
                    id="firstName"
                    name="firstName"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.firstName}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter your first name"
                    error={
                      formik.touched.firstName &&
                      Boolean(formik.errors.firstName)
                    }
                    helperText={
                      formik.touched.firstName && formik.errors.firstName
                    }
                  />
                </div>
                <div className="space-y-1 col-span-1">
                  <div>
                    <label
                      htmlFor="lastName"
                      className="font-medium text-gray-700"
                    >
                      Last Name
                    </label>
                  </div>
                  <TextField
                    id="lastName"
                    name="lastName"
                    type="text"
                    onChange={formik.handleChange}
                    value={formik.values.lastName}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    placeholder="Enter your last name"
                    error={
                      formik.touched.lastName &&
                      Boolean(formik.errors.lastName)
                    }
                    helperText={
                      formik.touched.lastName && formik.errors.lastName
                    }
                  />
                </div>
              </>
          )}
          {step === 1 && (
            <>
              <div className="space-y-1 col-span-1">
                <div>
                  <label htmlFor="company" className="font-medium text-gray-700">
                    Company
                  </label>
                </div>
                <TextField
                  id="company"
                  name="company"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.company}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter your company name"
                  error={formik.touched.company && Boolean(formik.errors.company)}
                  helperText={formik.touched.company && formik.errors.company}
                />
              </div>
              <div className="space-y-1 col-span-1">
                <div>
                  <label htmlFor="position" className="font-medium text-gray-700">
                    Position
                  </label>
                </div>
                <TextField
                  id="position"
                  name="position"
                  type="text"
                  onChange={formik.handleChange}
                  value={formik.values.position}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  placeholder="Enter your position"
                  error={formik.touched.position && Boolean(formik.errors.position)}
                  helperText={formik.touched.position && formik.errors.position}
                />
              </div>
            </>
          )}
          {step === 2 && (
            <div className="space-y-1 col-span-2">
              <div>
                <label htmlFor="location" className="font-medium text-gray-700">
                  Location
                </label>
              </div>
              <TextField
                id="location"
                name="location"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.location}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                placeholder="Enter your location"
                error={formik.touched.location && Boolean(formik.errors.location)}
                helperText={formik.touched.location && formik.errors.location}
              />
            </div>
          )}

          <div className="space-y-1 col-span-1">
            <Button variant="outlined" onClick={() => setStep(step - 1)} disabled={step === 0} fullWidth>
              Back
            </Button>
          </div>
          <div className="space-y-1 col-span-1">
            <Button
              type="submit"
              variant="contained"
              loading={state.updateProfile === "loading"}
              disabled={state.updateProfile === "loading"}
              fullWidth
            >
              {step === 2 ? "Submit" : "Next"}
            </Button>
          </div>
        </form>
      </BoxComponent>
    </div>
  );
};

export default Profile;
