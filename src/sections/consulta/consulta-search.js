import MagnifyingGlassIcon from "@heroicons/react/24/solid/MagnifyingGlassIcon";
import {
  Button,
  TextField,
  InputAdornment,
  SvgIcon,
  Typography,
  MenuItem,
  Select,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useAuth } from "src/hooks/use-auth.js";
import { api } from "../../api/api.js";

export const ConsultaSearch = ({ setResults, userSubscription }) => {
  const { user, signOut } = useAuth();

  const formik = useFormik({
    initialValues: {
      domain: "",
      api: "V1",
      submit: null,
    },
    validationSchema: Yup.object({
      domain: Yup.string("Informe uma keyword para pesquisar.").required(
        "Informe uma keyword para pesquisar."
      ),
      api: Yup.string("Informe a versão da API a ser utilizada.")
        .oneOf(["V1", "V2"], "A versão precisa ser V1 ou V2.")
        .required("Informe a versão da API a ser utilizada."),
    }),
    onSubmit: async (values, helpers) => {
      if (!user.subscribed) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: "Você não possui um plano ativo." });
        helpers.setSubmitting(false);
        return;
      }
      if (user.remainingConsultas <= 0) {
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: "Você não possui consultas restantes hoje. Volte amanhã." });
        helpers.setSubmitting(false);
        return;
      }
      if (values.api === "V1") {
        if (userSubscription !== "none") {
          try {
            const req = await api.post("/consulta/v1/search", {
              keyword: values.domain,
            });

            if (!req.data.data) return setResults([]);

            setResults(req.data.data);
          } catch (error) {
            if (error.message === "Request failed with status code 402") {
              helpers.setStatus({ success: false });
              helpers.setErrors({ submit: "Você não possui um plano ativo." });
              helpers.setSubmitting(false);
            } else if (error.message === "Request failed with status code 400") {
              if (
                error.response.data.message ===
                "Você não possui consultas restantes hoje. Volte amanhã."
              ) {
                helpers.setStatus({ success: false });
                helpers.setErrors({
                  submit: "Você não possui consultas restantes hoje. Volte amanhã.",
                });
                helpers.setSubmitting(false);
                return;
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
                    try {
                      const req = await api.post("/consulta/search", {
                        keyword: values.domain,
                      });

                      if (!req.data) return setResults([]);
                      setResults(req.data.data);
                    } catch (error) {
                      if (error.message === "Request failed with status code 402") {
                        helpers.setStatus({ success: false });
                        helpers.setErrors({ submit: "Você não possui um plano ativo." });
                        helpers.setSubmitting(false);
                      } else if (error.message === "Request failed with status code 400") {
                        if (
                          error.response.data.message ===
                          "Você não possui consultas restantes hoje. Volte amanhã."
                        ) {
                          helpers.setStatus({ success: false });
                          helpers.setErrors({
                            submit: "Você não possui consultas restantes hoje. Volte amanhã.",
                          });
                          helpers.setSubmitting(false);
                          return;
                        }
                      }
                    }
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
        } else {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: "Você não possui um plano ativo." });
          helpers.setSubmitting(false);
          return;
        }
      } else if (values.api === "V2") {
        if (
          userSubscription === "elite" ||
          userSubscription === "ultra" ||
          userSubscription === "maximum"
        ) {
          try {
            const req = await api.post("/consulta/v1/search", {
              keyword: values.domain,
            });

            if (!req.data.data) return setResults([]);

            setResults(req.data.data);
          } catch (error) {
            if (error.message === "Request failed with status code 402") {
              helpers.setStatus({ success: false });
              helpers.setErrors({ submit: "Você não possui um plano ativo." });
              helpers.setSubmitting(false);
            }
            if (error.message === "Request failed with status code 401") {
              api
                .post("/auth/refresh")
                .then(async (data) => {
                  if (!data) {
                    signOut();
                  }
                  if (data.status === 200) {
                    const req = await api.post("/consulta/v2/search", {
                      keyword: values.domain,
                    });

                    if (!req.data) return setResults([]);
                    setResults(req.data.data);
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
        } else {
          helpers.setStatus({ success: false });
          helpers.setErrors({ submit: "Você não tem acesso a API V2." });
          helpers.setSubmitting(false);
          return;
        }
      }
    },
  });
  if (
    (userSubscription !== null && userSubscription === "elite") ||
    userSubscription === "ultra" ||
    userSubscription === "maximum"
  ) {
    return (
      <form noValidate onSubmit={formik.handleSubmit}>
        <Stack sx={{ gap: 2, flexDirection: "row", alignItems: "center" }}>
          <TextField
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={!!(formik.touched.domain && formik.errors.domain) && formik.errors.submit}
            helperText={formik.touched.domain && formik.errors.domain && formik.errors.submit}
            name="domain"
            type="domain"
            value={formik.values.domain}
            fullWidth
            placeholder="Procurar domínio"
            startadornment={
              <InputAdornment position="start">
                <SvgIcon color="action" fontSize="small">
                  <MagnifyingGlassIcon />
                </SvgIcon>
              </InputAdornment>
            }
            sx={{ maxWidth: 500, pr: 2 }}
          />
          <Button variant="contained" size="small" sx={{ height: "60px" }} type="submit">
            Pesquisar
          </Button>
          {formik.errors.submit && (
            <Typography color="error" variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
          <Stack sx={{ ml: "auto", mr: 0 }}>
            <Select
              id="api"
              name="api"
              value={formik.values.api}
              onBlur={formik.handleBlur}
              onChange={(e) => formik.setFieldValue("api", e.target.value.toString())}
              error={formik.touched.api && Boolean(formik.errors.api)}
              sx={{ width: "70px" }}
            >
              <MenuItem value={"V1"}>V1</MenuItem>
              <MenuItem value={"V2"}>V2</MenuItem>
            </Select>
          </Stack>
        </Stack>
      </form>
    );
  } else {
    return (
      <form noValidate onSubmit={formik.handleSubmit}>
        <Stack sx={{ gap: 2, flexDirection: "row", alignItems: "center" }}>
          <TextField
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            error={!!(formik.touched.domain && formik.errors.domain) && formik.errors.submit}
            helperText={formik.touched.domain && formik.errors.domain && formik.errors.submit}
            name="domain"
            type="domain"
            value={formik.values.domain}
            fullWidth
            placeholder="Procurar domínio"
            startadornment={
              <InputAdornment position="start">
                <SvgIcon color="action" fontSize="small">
                  <MagnifyingGlassIcon />
                </SvgIcon>
              </InputAdornment>
            }
            sx={{ maxWidth: 500, pr: 2 }}
          />
          <Button variant="contained" size="small" sx={{ height: "60px" }} type="submit">
            Pesquisar
          </Button>
          {formik.errors.submit && (
            <Typography color="error" variant="body2">
              {formik.errors.submit}
            </Typography>
          )}
          <Stack sx={{ ml: "auto", mr: 0 }}>
            <Select
              id="api"
              name="api"
              value={formik.values.api}
              onBlur={formik.handleBlur}
              onChange={(e) => formik.setFieldValue("api", e.target.value.toString())}
              error={formik.touched.api && Boolean(formik.errors.api)}
              sx={{ width: "70px" }}
            >
              <MenuItem value={"V1"}>V1</MenuItem>
            </Select>
          </Stack>
        </Stack>
      </form>
    );
  }
};
