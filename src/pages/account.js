import Head from "next/head";
import {
  Box,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  LinearProgress,
} from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { AccountProfile } from "src/sections/account/account-profile";
import { AccountProfileDetails } from "src/sections/account/account-profile-details";
import { AccountProfileActivateKey } from "src/sections/account/account-profile-activate-key.js";
import { useEffect, useState } from "react";
import { api } from "src/api/api.js";

const Page = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const req = await api.get("/users/@me");

        if (req.data) {
          return setUser(req.data);
        }
      } catch (error) {
        if (error.message === "Request failed with status code 401") {
          try {
            const req = await api.post("/auth/refresh");

            if (req.status === 200) {
              const req = await api.get("/users/@me");

              if (req.data) {
                return setUser(req.data);
              }
            }
          } catch (error) {
            if (error.message === "Request failed with status code 400") {
              if (error.response.data.message === "Refresh Token não encontrado.") {
                signOut();
              }
            }
          }
        }
      }
    };

    fetchData();
  }, []);
  if (user === null) {
    return <LinearProgress />;
  } else {
    return (
      <>
        <Head>
          <title>Account | Kvnt</title>
        </Head>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="lg">
            <Stack spacing={3}>
              <div>
                <Typography variant="h4">Conta</Typography>
              </div>
              <div>
                <Grid container spacing={3}>
                  <Grid xs={12} md={6} lg={4}>
                    <AccountProfile user={user} />
                  </Grid>
                  <Grid xs={12} md={6} lg={8}>
                    <AccountProfileDetails user={user} />
                  </Grid>
                  <Grid xs={12} md={6} lg={20}>
                    <AccountProfileActivateKey user={user} />
                  </Grid>
                </Grid>
              </div>
            </Stack>
          </Container>
        </Box>
      </>
    );
  }
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
