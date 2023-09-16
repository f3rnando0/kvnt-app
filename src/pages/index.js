import Head from "next/head";
import { Box, Container, Unstable_Grid2 as Grid } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { OverviewConsultas } from "src/sections/overview/overview-consultas";
import { OverviewConsultaSemanais } from "src/sections/overview/overview-consultas-semanais";
import { OverviewTotalLines } from "src/sections/overview/overview-total-lines";
import { OverviewConsultasRestantes } from "src/sections/overview/overview-consultas-restantes";
import moment from "moment";
import { useEffect, useState } from "react";
import { api } from "../api/api.js";
import { useAuth } from "src/hooks/use-auth.js";

const Page = () => {
  const { user, updateUser, signOut } = useAuth();
  const [newUser, setUser] = useState(user);
  const [totalLines, setTotalLines] = useState(0);

  useEffect(() => {
    api
      .get("/users/@me")
      .then((data) => {
        setUser(data.data);
        updateUser(data.data);
      })
      .catch((error) => {
        if (error.message === "Request failed with status code 401") {
          api
            .post("/auth/refresh")
            .then((req) => {
              if (req.status == 200) {
                api.get("/users/@me").then((req) => {
                  setUser(req.data);
                  updateUser(req.data);
                });
              }
            })
            .catch((error) => {
              if (error.message === "Request failed with status code 400") {
                if (error.response.data.message === "Refresh Token não encontrado.") {
                  signOut();
                }
              }
            });
        }
      });
    api
      .get("/consulta/count")
      .then((req) => {
        setTotalLines(req.data.count);
      })
      .catch((error) => {
        if (error.message === "Request failed with status code 401") {
          api
            .post("/auth/refresh")
            .then((req) => {
              if (req.status == 200) {
                api.get("/consulta/count").then((req) => {
                  setTotalLines(req.data.count);
                });
              }
            })
            .catch((error) => {
              if (error.message === "Request failed with status code 400") {
                if (error.response.data.message === "Refresh Token não encontrado.") {
                  signOut();
                }
              }
            });
        }
      });
  }, []);

  var seg = 0;
  var ter = 0;
  var qua = 0;
  var qui = 0;
  var sex = 0;
  var sab = 0;
  var dom = 0;

  if (user !== null) {
    user.consultas
      .filter((consulta) => moment(consulta.date).isBetween(moment().subtract(7, "days"), moment()))
      .map((consulta) => {
        switch (consulta.day) {
          case "segunda-feira":
            seg++;
            break;
          case "terça-feira":
            ter++;
            break;
          case "quarta-feira":
            qua++;
            break;
          case "quinta-feira":
            qui++;
            break;
          case "sexta-feira":
            sex++;
            break;
          case "sabádo":
            sab++;
            break;
          case "domingo":
            dom++;
            break;
        }
      });
  }

  const consultasOfTheDay = newUser.consultas.filter((consulta) =>
    moment(consulta.date).isSame(moment(), "day")
  );

  return (
    <>
      <Head>
        <title>Overview | Knvt</title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8,
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={3}>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewConsultas sx={{ height: "100%" }} value={consultasOfTheDay.length} />
            </Grid>
            <Grid xs={12} sm={6} lg={3}>
              <OverviewConsultasRestantes
                sx={{ height: "100%" }}
                value={newUser.remainingConsultas <= 0 ? "0" : newUser.remainingConsultas}
              />
            </Grid>
            <Grid xs={12} sm={6} lg={6}>
              <OverviewTotalLines sx={{ height: "100%" }} value={totalLines.toLocaleString()} />
            </Grid>
            <Grid xs={24} lg={12}>
              <OverviewConsultaSemanais
                chartSeries={[
                  {
                    name: "Consultas",
                    data: [
                      { x: "Seg", y: seg },
                      { x: "Ter", y: ter },
                      { x: "Qua", y: qua },
                      { x: "Qui", y: qui },
                      { x: "Sex", y: sex },
                      { x: "Sab", y: sab },
                      { x: "Dom", y: dom },
                    ],
                  },
                ]}
                sx={{ height: "100%" }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
