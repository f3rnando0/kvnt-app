import { useCallback, useMemo, useState, useEffect } from "react";
import Head from "next/head";
import ArrowDownOnSquareIcon from "@heroicons/react/24/solid/ArrowDownOnSquareIcon";
import { Box, Button, Container, Stack, SvgIcon, Typography, LinearProgress } from "@mui/material";
import { Layout as DashboardLayout } from "src/layouts/dashboard/layout";
import { ConsultaTable } from "src/sections/consulta/consulta-table";
import { ConsultaSearch } from "src/sections/consulta/consulta-search";
import { applyPagination } from "src/utils/apply-pagination";
import { saveAs } from "file-saver";
import { api } from "src/api/api.js";

const generateExport = (consultas) => {
  if (consultas.length === 0) return;
  try {
    const data = [];
    consultas.map((consulta) => {
      data.push(`${consulta.url}:${`${consulta.username}:${consulta.password}`}`);
    });

    const consultasToTxt = data.join("\n");

    var blob = new Blob([consultasToTxt], { type: "text/plain;charset=utf-8" });
    return saveAs(blob, "export.txt");
  } catch (error) {
    return console.error(error.message);
  }
};

const useConsultasPagination = (data, page, rowsPerPage) => {
  return useMemo(() => {
    return applyPagination(data, page, rowsPerPage);
  }, [data, page, rowsPerPage]);
};

const Page = () => {
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const consultas = useConsultasPagination(results, page, rowsPerPage);
  const [userSubscription, setUserSubscription] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const req = await api.get("/users/@me");

        if (req.data) {
          return setUserSubscription(req.data.subscriptionPlan);
        }
      } catch (error) {
        if (error.message === "Request failed with status code 401") {
          try {
            const req = await api.post("/auth/refresh");

            if (req.status === 200) {
              const req = await api.get("/users/@me");

              if (req.data) {
                return setUserSubscription(req.data.subscriptionPlan);
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

  const handlePageChange = useCallback((event, value) => {
    setPage(value);
  }, []);

  const handleRowsPerPageChange = useCallback((event) => {
    setRowsPerPage(event.target.value);
  }, []);

  if (userSubscription === null) {
    return <LinearProgress />;
  } else {
    return (
      <>
        <Head>
          <title>Search | Knvt</title>
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
                  <Typography variant="h4">Consultar</Typography>
                  <Stack alignItems="center" direction="row" spacing={1}>
                    <Button
                      color="inherit"
                      startIcon={
                        <SvgIcon fontSize="small">
                          <ArrowDownOnSquareIcon />
                        </SvgIcon>
                      }
                      onClick={() => generateExport(results)}
                    >
                      Exportar
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
              <ConsultaSearch userSubscription={userSubscription} setResults={setResults} />
              <ConsultaTable
                count={results.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
                results={consultas}
              />
            </Stack>
          </Container>
        </Box>
      </>
    );
  }
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
