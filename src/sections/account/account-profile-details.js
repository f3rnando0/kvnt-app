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

export const AccountProfileDetails = ({ user }) => {
  const { signOut } = useAuth();

  const formik = useFormik({
    initialValues: {
      name: user.name,
      email: user.email,
      submit: null,
    },
    validationSchema: Yup.object({
      name: Yup.string("O nome precisa ser uma string.")
        .min(3, "O nome precisa ter no minímo 3 caracteres.")
        .max(16, "O nome precisa ter no máximo 16 caracteres.")
        .lowercase(),
      email: Yup.string("Especifique um novo email.")
        .email("Deve ser um email válido")
        .max(255, "O email precisa ter no máximo 128 caracteres.")
        .required("Email é obrigatório"),
    }),
    onSubmit: async (values, helpers) => {
      try {
        try {
          await api.put("/users/@me", {
            email: values.email,
            name: values.name,
          });
          window.location.reload(false);
        } catch (error) {
          if (error.message === "Request failed with status code 401") {
            const refresh = await api.post("/auth/refresh");
            if (refresh.status === 200) {
              await api.put("/users/@me", {
                name: values.name,
                email: values.email,
              });
              window.location.reload(false);
            }
          } else if (error.message === "Request failed with status code 400") {
            if (error.response.data.message === "Refresh Token não encontrado.") {
              signOut()
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
        <CardHeader subheader="Você pode alterar as suas informações" title="Informações" />
        <CardContent sx={{ pt: 0 }}>
          <Box sx={{ m: -1.5 }}>
            <Grid container spacing={3}>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.name && formik.errors.name)}
                  fullWidth
                  helperText={formik.touched.name && formik.errors.name}
                  label="Nome"
                  name="name"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  required
                  value={formik.values.name}
                />
              </Grid>
              <Grid xs={12} md={6}>
                <TextField
                  error={!!(formik.touched.email && formik.errors.email)}
                  fullWidth
                  helperText={formik.touched.email && formik.errors.email}
                  label="Endereço de email"
                  name="email"
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  required
                  value={formik.values.email}
                />
              </Grid>
            </Grid>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ flexDirection: "column", alignItems: "flex-end" }}>
          <Button variant="contained" type="submit">
            Salvar informações
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
