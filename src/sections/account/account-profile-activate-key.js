import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Typography,
  Unstable_Grid2 as Grid,
} from "@mui/material";
import { useAuth } from "src/hooks/use-auth.js";
import * as Yup from "yup";
import { useFormik } from "formik";
import { api } from "../../api/api.js";

const regex =
  /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/;

export const AccountProfileActivateKey = ({ user }) => {
  const { updateUser, signOut } = useAuth();

  const formik = useFormik({
    initialValues: {
      key: "",
      submit: null,
    },
    validationSchema: Yup.object({
      key: Yup.string("A key precisa ser uma string.").matches(regex).required("Digite a sua key."),
    }),
    onSubmit: async (values, helpers) => {
      try {
        try {
          await api.post("/subscription/activate", {
            key: values.key,
          });

          const newUser = { ...user };
          newUser.subscribed = true;
          updateUser(newUser);
          window.location.reload(false);
        } catch (error) {
          if (error.message === "Request failed with status code 401") {
            const refresh = await api.post("/auth/refresh");
            if (refresh.status === 200) {
              await api.post("/subscription/activate", {
                key: values.key,
              });
              const newUser = { ...user };
              newUser.subscribed = true;
              updateUser(newUser);
              window.location.reload(false);
            }
          } else if (error.message === "Request failed with status code 400") {
            if (error.response.data.message === "Refresh Token não encontrado.") {
              signOut();
            }
          }
          helpers.setStatus({ success: false });
          helpers.setErrors({
            submit:
              error.response.data.message === undefined
                ? error.message
                : error.response.data.message,
          });
          helpers.setSubmitting(false);
        }
      } catch (err) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <form autoComplete="off" noValidate onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader
          subheader="Ative sua key e tenha acesso ao nosso sistema de consultas"
          title="Ativação"
        />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container>
              <Grid xs={16} md={12}>
                <TextField
                  error={!!(formik.touched.key && formik.errors.key)}
                  fullWidth
                  helperText={formik.touched.key && formik.errors.key}
                  label="Key de ativação"
                  name="key"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  required
                  value={formik.values.key}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ flexDirection: "column", alignItems: "flex-end" }}>
          <Button variant="contained" type="submit">
            Ativar
          </Button>
          {formik.errors.submit && (
            <Typography color="error" variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
        </CardActions>
      </Card>
    </form>
  );
};
