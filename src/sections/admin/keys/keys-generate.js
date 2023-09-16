import { Select, Button, Typography, MenuItem, FormHelperText } from "@mui/material";
import { Stack } from "@mui/system";
import { useFormik } from "formik";
import { useRouter } from "next/router.js";
import { useState } from "react";
import { api } from "src/api/api.js";
import { useAuth } from "src/hooks/use-auth.js";
import * as Yup from "yup";

export const KeysGenerate = (props) => {
  const { setKeys = () => {}, keys = [], isAdmin = Boolean } = props;

  const { user, signOut } = useAuth();
  const router = useRouter();
  const [key, setKey] = useState("");

  const formik = useFormik({
    initialValues: {
      planType: "basic",
      duration: "7d",
      submit: null,
    },
    validationSchema: Yup.object({
      planType: Yup.string()
        .oneOf(["basic", "standart", "vip", "elite", "ultra", "maximum"])
        .label("Escolha o tipo do plano")
        .required(),
      duration: Yup.string()
        .oneOf(["7d", "30d", "90d", "lifetime"], "Escolha uma duração válida.")
        .label("Escolha a duração da key")
        .required(),
    }),
    onSubmit: async (values, helpers) => {
      if (user !== null && !user.isAdmin) {
        router.push("/404");
      }
      try {
        const req = await api.post("/subscription/generate", {
          plan: values.planType,
          duration: values.duration,
        });

        if (!req.data) return setKey("");

        const newArray = [...keys];
        newArray.unshift(req.data);
        setKeys(newArray);
      } catch (error) {
        if (error.message === "Request failed with status code 400") {
          if (
            error.response.data.message === "Forneça uma duração para a key." ||
            "Duração da key inválida."
          ) {
            helpers.setStatus({ success: false });
            helpers.setErrors({ submit: "Duração da key inválida." });
            helpers.setSubmitting(false);
          } else {
            helpers.setStatus({ success: false });
            helpers.setErrors({ submit: error.message });
            helpers.setSubmitting(false);
          }
        }
        if (error.message === "Request failed with status code 401") {
          api
            .post("/auth/refresh")
            .then(async (data) => {
              if (!data) {
                signOut();
              }
              if (data.status === 200) {
                const req = await api.post("/subscription/generate", {
                  plan: values.planType,
                  duration: values.duration,
                });

                if (!req.data) return setResults("");
                const newArray = [...keys];
                newArray.unshift(req.data);
                setKeys(newArray);
              }
            })
            .catch((error) => {
              if (error.message === "Request failed with status code 404") {
                if (error.response.data.message === "Refresh Token não encontrado.") {
                  signOut();
                }
              }

              helpers.setStatus({ success: false });
              helpers.setErrors({ submit: error.message });
              helpers.setSubmitting(false);
            });
        }
      }
    },
  });

  return (
    <form noValidate onSubmit={formik.handleSubmit}>
      <Stack sx={{ gap: 2, flexDirection: "row", alignItems: "center" }}>
        <Select
          id="plan-type"
          name="plan-type"
          value={formik.values.planType}
          onBlur={formik.handleBlur}
          onChange={(e) => formik.setFieldValue("planType", e.target.value.toString())}
          error={formik.touched.planType && Boolean(formik.errors.planType)}
          sx={{ width: "150px" }}
        >
          <MenuItem value={"basic"}>Basic</MenuItem>
          <MenuItem value={"standart"}>Standart</MenuItem>
          <MenuItem value={"vip"}>VIP</MenuItem>
          <MenuItem value={"elite"}>Elite</MenuItem>
          <MenuItem value={"ultra"}>Ultra</MenuItem>
          <MenuItem value={"maximum"}>Maximum</MenuItem>
        </Select>
        <Select
          id="duration"
          name="duration"
          value={formik.values.duration}
          onBlur={formik.handleBlur}
          onChange={(e) => formik.setFieldValue("duration", e.target.value.toString())}
          error={formik.touched.duration && Boolean(formik.errors.duration)}
          sx={{ width: "150px" }}
        >
          <MenuItem value={"7d"}>7 dias</MenuItem>
          <MenuItem value={"30d"}>30 dias</MenuItem>
          <MenuItem value={"90d"}>90 dias</MenuItem>
          <MenuItem value={"lifetime"}>Nunca</MenuItem>
        </Select>
        {formik.touched.planType && (
          <FormHelperText sx={{ color: "error.main", pt: "5px" }}>
            {formik.errors.planType}
          </FormHelperText>
        )}
        <Button variant="contained" type="submit" size="small" sx={{ height: "50px" }}>
          Criar key
        </Button>
        {formik.errors.submit && (
          <Typography color="error" variant="body2">
            {formik.errors.submit}
          </Typography>
        )}
      </Stack>
      {key !== "" && (
        <Typography color="success.main" variant="body2">
          {key}
        </Typography>
      )}
    </form>
  );
};
