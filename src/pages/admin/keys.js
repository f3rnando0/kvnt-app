import Head from "next/head";
import { Box, Container, LinearProgress, Stack, Typography } from "@mui/material";
import { KeysGenerate } from "src/sections/admin/keys/keys-generate.js";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { useAuth } from "src/hooks/use-auth.js";
import { useRouter } from "next/router.js";
import { KeysTable } from "src/sections/admin/keys/keys-table.js";
import { useState, useEffect, useMemo, useCallback } from "react";
import { applyPagination } from "src/utils/apply-pagination";
import { api } from "src/api/api.js";

const Page = () => {
  const { signOut } = useAuth();
  const router = useRouter();

  const [allKeys, setAllKeys] = useState([]);
  const [isAdmin, setAdmin] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const req = await api.get("/users/@me");

        if (req.data.isAdmin === false) {
          return setAdmin(false);
        } else if (req.data.isAdmin === true) {
          setAdmin(true);
        } else {
          return setAdmin(false);
        }
      } catch (error) {
        if (error.message === "Request failed with status code 401") {
          try {
            const req = api.post("/auth/refresh");

            if (req.status === 200) {
              const req = await api.get("/users/@me");

              if (req.data.isAdmin === false) {
                return setAdmin(false);
              } else if (req.data.isAdmin === true) {
                setAdmin(true);
              } else {
                return setAdmin(false);
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

  useEffect(() => {
    if (isAdmin === true) {
      api
        .get("/subscription")
        .then((data) => {
          setAllKeys(data.data);
        })
        .catch((error) => {
          if (error.message === "Request failed with status code 401") {
            api
              .post("/auth/refresh")
              .then((req) => {
                if (req.status === 200) {
                  api.get("/subscription").then((req) => {
                    setAllKeys(req.data);
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
    }
  }, [isAdmin]);

  const useConsultasPagination = (data, page, rowsPerPage) => {
    return useMemo(() => {
      return applyPagination(data, page, rowsPerPage);
    }, [data, page, rowsPerPage]);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const keys = useConsultasPagination(allKeys, page, rowsPerPage);

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  if (isAdmin === undefined) {
    return (
      <LinearProgress />
    );
  }

  if (isAdmin === true) {
    return (
      <>
        <Head>
          <title>Keys | Knvt</title>
        </Head>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            py: 8,
          }}
        >
          <Container maxWidth="xl">
            <Stack spacing={3}>
              <Stack direction="row" justifyContent="space-between" spacing={4}>
                <Stack spacing={1}>
                  <Typography variant="h4">Keys</Typography>
                </Stack>
              </Stack>
              <KeysGenerate setKeys={setAllKeys} keys={allKeys} isAdmin={isAdmin} />
              <KeysTable
                count={allKeys.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                results={keys}
                setKeys={setAllKeys}
                keys={allKeys}
                isAdmin={isAdmin}
              />
            </Stack>
          </Container>
        </Box>
      </>
    );
  }

  if (isAdmin === false) {
    router.push("/404");
  }
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
