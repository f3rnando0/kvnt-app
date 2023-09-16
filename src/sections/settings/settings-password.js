import {
  Button,
  Typography,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { api } from "src/api/api.js";
import { useAuth } from "src/hooks/use-auth.js";
import * as Yup from "yup";

export const SettingsPassword = () => {
  const [sucessText, setSucessText] = useState("");
  const { signOut } = useAuth();

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      submit: null,
    },
    validationSchema: Yup.object({
      currentPassword: Yup.string("A sua senha atual precisa ser uma string.")
        .min(6, "A senha atual deve possuir no mínimo 6 caracteres.")
        .max(128, "A senha atual deve possuir no máximo 128 caracteres.")
        .required("Digite a sua senha atual."),
      newPassword: Yup.string("A sua nova senha precisa ser uma string.")
        .min(6, "A sua nova senha deve possuir no mínimo 6 caracteres.")
        .max(128, "A sua nova senha deve possuir no máximo 128 caracteres.")
        .required("Digite a sua nova senha."),
      confirmNewPassword: Yup.string("A sua confirmação de senha precisa ser uma string.")
        .min(6, "A sua confirmação de senha deve possuir no mínimo 6 caracteres.")
        .max(128, "A sua confirmação de senha deve possuir no máximo 128 caracteres.")
        .required("Digite a sua confirmação de senha."),
    }),
    onSubmit: async (values, helpers) => {
      if (values.newPassword !== values.confirmNewPassword) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: "As senhas não conferem." });
        helpers.setSubmitting(false);
        return;
      }

      try {
        const req = await api.post(`/users/change-password`, {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
          confirmNewPassword: values.confirmNewPassword,
        });

        if (!req.data) return;

        if (!req.data) return;
        if (req.data === "Senha atualizada com sucesso.") {
          setSucessText("Senha atualizada com sucesso.");
        }
      } catch (error) {
        if (error.message === "Request failed with status code 401") {
          const refresh = api
            .post("/auth/refresh")
            .then(async (data) => {
              if (!data) {
                signOut();
              }
              if (refresh.status === 200) {
                const req = await api.post(`/users/change-password`, {
                  currentPassword: values.currentPassword,
                  newPassword: values.newPassword,
                  confirmNewPassword: values.confirmNewPassword,
                });

                if (!req.data) return;
                if (req.data === "Senha atualizada com sucesso.") {
                  setSucessText("Senha atualizada com sucesso.");
                }
              }
            })
            .catch((error) => {
              if (error.message === "Request failed with status code 404") {
                if (error.response.data.message === "Refresh Token não encontrado.") {
                  signOut();
                }
              }

              return;
            });
        } else if (error.message === "Request failed with status code 400") {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: error.response.data.message });
          helpers.setSubmitting(false);
        }
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader subheader="Alterar senha" title="Senha" />
        <Divider />
        <CardContent>
          <Stack spacing={3} sx={{ maxWidth: 400 }}>
            <TextField
              fullWidth
              error={!!(formik.touched.currentPassword && formik.errors.currentPassword)}
              helperText={formik.touched.currentPassword && formik.errors.currentPassword}
              label="Senha atual"
              name="currentPassword"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              required
              value={formik.values.currentPassword}
            />
            <TextField
              fullWidth
              error={!!(formik.touched.newPassword && formik.errors.newPassword)}
              helperText={formik.touched.newPassword && formik.errors.newPassword}
              label="Nova senha"
              name="newPassword"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.newPassword}
            />
            <TextField
              fullWidth
              error={!!(formik.touched.confirmNewPassword && formik.errors.confirmNewPassword)}
              helperText={formik.touched.confirmNewPassword && formik.errors.confirmNewPassword}
              label="Confirme a senha"
              name="confirmNewPassword"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              type="password"
              value={formik.values.confirmNewPassword}
            />
            {sucessText && (
              <Typography color="success.main" variant="h6">
                {sucessText}
              </Typography>
            )}
          </Stack>
        </CardContent>
        <Divider />
        <CardActions sx={{ alignItems: "flex-end", flexDirection: "column" }}>
          <Button variant="contained" type="submit">
            Alterar
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
